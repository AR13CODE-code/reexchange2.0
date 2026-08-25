import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
Listing,
Opportunity,
ConnectionRequest,
NotificationItem,
ImpactStats,
UserProfile,
Tournament,
TournamentRegistration
} from "./src/types";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

// In-memory database
let listings: Listing[] = [];
let opportunities: Opportunity[] = [];
let users: UserProfile[] = [];
let tournaments: Tournament[] = [];
let connections: ConnectionRequest[] = [];
let notifications: NotificationItem[] = [];

let registeredAuthMap: Record<
string,
{ password: string; user: UserProfile }
> = {};

let impactStats: ImpactStats = {
resourcesShared: 0,
skillExchanges: 0,
studentConnections: 0,
estimatedValueSaved: 0,
};

// Gemini client
function getGeminiClient(): GoogleGenAI | null {
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
  return null;
}

try {
  return new GoogleGenAI({ apiKey });
} catch (err) {
  console.error("Gemini initialization error:", err);
  return null;
}
}



// ============================================================
// HEALTH
// ============================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// ============================================================
// STATS
// ============================================================

app.get("/api/stats", (req, res) => {
  res.json(impactStats);
});

// ============================================================
// USERS
// ============================================================

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

// ============================================================
// AUTH - LOGIN
// ============================================================

app.post("/api/auth/login", (req, res) => {
  const { loginId, password } = req.body;

  if (!loginId || !password) {
    return res.status(400).json({
      error:
        "Email, Registration Number, or Mobile Number and Password are required.",
    });
  }

  const key = loginId.trim().toLowerCase();
  const cleanDigits = loginId.replace(/\D/g, "");

  const entry = registeredAuthMap[key];

  if (!entry) {
    const matchedUser = users.find(
      (u) =>
        u.email.toLowerCase() === key ||
        (u.regNo && u.regNo.toLowerCase() === key) ||
        (u.mobileNumber &&
          (u.mobileNumber.toLowerCase() === key ||
            (cleanDigits.length >= 10 &&
              u.mobileNumber.replace(/\D/g, "").includes(cleanDigits)))) ||
        u.id === key
    );

    if (matchedUser) {
      const userEntry =
        registeredAuthMap[matchedUser.email.toLowerCase()] ||
        (matchedUser.regNo
          ? registeredAuthMap[matchedUser.regNo.toLowerCase()]
          : undefined);

      if (userEntry && userEntry.password === password) {
        return res.json({
          success: true,
          user: matchedUser,
          token: `token_${matchedUser.id}_${Date.now()}`,
        });
      }
    }

    return res.status(401).json({
      error:
        "No account found with this email, registration number, or mobile number. Please register.",
    });
  }

  if (entry.password !== password) {
    return res.status(401).json({
      error: "Incorrect password. Please verify your credentials.",
    });
  }

  return res.json({
    success: true,
    user: entry.user,
    token: `token_${entry.user.id}_${Date.now()}`,
  });
});

// ============================================================
// AUTH - REGISTER
// ============================================================

app.post("/api/auth/register", (req, res) => {
  const {
    name,
    regNo,
    email,
    mobileNumber,
    password,
    confirmPassword,
    department,
    year,
    campusZone,
    skillsOffered,
    skillsNeeded,
    bio,
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Full Name, Email, and Password are required.",
    });
  }

  if (
    !mobileNumber ||
    mobileNumber.trim().replace(/\D/g, "").length < 10
  ) {
    return res.status(400).json({
      error:
        "A valid 10-digit mobile number is required for campus registration.",
    });
  }

  if (confirmPassword && password !== confirmPassword) {
    return res.status(400).json({
      error: "Passwords do not match.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "Password must be at least 6 characters long.",
    });
  }

  const emailKey = email.trim().toLowerCase();
  const regNoKey = regNo ? regNo.trim().toLowerCase() : "";
  const phoneClean = mobileNumber.trim().replace(/\D/g, "");

  const formattedPhone =
    phoneClean.length === 10
      ? `+91 ${phoneClean.slice(0, 5)} ${phoneClean.slice(5)}`
      : mobileNumber.trim();

  if (
    registeredAuthMap[emailKey] ||
    users.some((u) => u.email.toLowerCase() === emailKey)
  ) {
    return res.status(400).json({
      error:
        "An account with this email address already exists. Please log in.",
    });
  }

  if (
    regNoKey &&
    (registeredAuthMap[regNoKey] ||
      users.some(
        (u) => u.regNo && u.regNo.toLowerCase() === regNoKey
      ))
  ) {
    return res.status(400).json({
      error:
        "An account with this College Registration Number already exists. Please log in.",
    });
  }

  if (
    users.some(
      (u) =>
        u.mobileNumber &&
        u.mobileNumber.replace(/\D/g, "") === phoneClean
    )
  ) {
    return res.status(400).json({
      error:
        "An account with this mobile number already exists. Please log in.",
    });
  }

  const newUser: UserProfile = {
    id: `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 4)}`,
    name: name.trim(),
    regNo: regNo ? regNo.trim().toUpperCase() : undefined,
    email: email.trim(),
    mobileNumber: formattedPhone,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
      name.trim()
    )}&backgroundColor=0f172a`,
    college:
      "SRM Institute of Science and Technology, Kattankulathur",
    year: year || "2nd Year",
    department:
      department || "Computer Science & Engineering",
    skillsOffered:
      Array.isArray(skillsOffered) && skillsOffered.length > 0
        ? skillsOffered
        : ["General Academic Help"],
    skillsNeeded:
      Array.isArray(skillsNeeded) && skillsNeeded.length > 0
        ? skillsNeeded
        : ["Coursework Guidance"],
    interests: [
      "Campus Exchange",
      "Student Collaboration",
      "Tech & Sports",
    ],
    campusZone: campusZone || "Tech Park",
    bio:
      bio ||
      `Student at SRM IST Kattankulathur (${
        department || "CSE"
      }, ${year || "2nd Year"}).`,
    contactHandle: `${formattedPhone} • ${email.trim()}`,
    stats: {
      resourcesShared: 0,
      skillExchanges: 0,
      connectionsMade: 0,
    },
    isDemo: false,
  };

  users.push(newUser);

  registeredAuthMap[emailKey] = {
    password,
    user: newUser,
  };

  if (regNoKey) {
    registeredAuthMap[regNoKey] = {
      password,
      user: newUser,
    };
  }

  registeredAuthMap[phoneClean] = {
    password,
    user: newUser,
  };

  registeredAuthMap[newUser.id] = {
    password,
    user: newUser,
  };

  res.status(201).json({
    success: true,
    user: newUser,
    token: `token_${newUser.id}_${Date.now()}`,
  });
});

// ============================================================
// LOGOUT
// ============================================================

app.post("/api/auth/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// ============================================================
// LISTINGS
// ============================================================

app.get("/api/listings", (req, res) => {
  const { category, type, search, zone, exchangeType } = req.query;

  let filtered = [...listings];

  if (type && type !== "all") {
    filtered = filtered.filter((l) => l.type === type);
  }

  if (category && category !== "all") {
    filtered = filtered.filter((l) => l.category === category);
  }

  if (exchangeType && exchangeType !== "all") {
    filtered = filtered.filter(
      (l) => l.exchangeType === exchangeType
    );
  }

  if (zone && zone !== "all") {
    filtered = filtered.filter((l) =>
      l.campusZone
        .toLowerCase()
        .includes(String(zone).toLowerCase())
    );
  }

  if (search) {
    const q = String(search).toLowerCase();

    filtered = filtered.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q)) ||
        l.ownerName.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

app.post("/api/listings", (req, res) => {
  const newListing: Listing = {
    id: `list_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 4)}`,
    status: "active",
    savesCount: 0,
    createdAt: "Just now",
    ...req.body,
  };

  listings.unshift(newListing);
  impactStats.resourcesShared += 1;

  res.status(201).json(newListing);
});

app.put("/api/listings/:id", (req, res) => {
  const { id } = req.params;

  const index = listings.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Listing not found",
    });
  }

  listings[index] = {
    ...listings[index],
    ...req.body,
  };

  res.json(listings[index]);
});

app.delete("/api/listings/:id", (req, res) => {
  const { id } = req.params;

  listings = listings.filter((l) => l.id !== id);

  res.json({
    success: true,
    message: "Listing removed",
  });
});

app.post("/api/listings/:id/save", (req, res) => {
  const { id } = req.params;

  const item = listings.find((l) => l.id === id);

  if (!item) {
    return res.status(404).json({
      error: "Listing not found",
    });
  }

  const { increment } = req.body;

  item.savesCount = Math.max(
    0,
    item.savesCount + (increment ? 1 : -1)
  );

  res.json({
    savesCount: item.savesCount,
  });
});

// ============================================================
// TOURNAMENTS
// ============================================================

app.get("/api/tournaments", (req, res) => {
  const { sport, search } = req.query;

  let filtered = [...tournaments];

  if (sport && sport !== "all") {
    filtered = filtered.filter((t) => t.sport === sport);
  }

  if (search) {
    const q = String(search).toLowerCase();

    filtered = filtered.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.venue.toLowerCase().includes(q) ||
        t.organizerName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  res.json(filtered);
});

app.get("/api/tournaments/:id", (req, res) => {
  const tourney = tournaments.find(
    (t) => t.id === req.params.id
  );

  if (!tourney) {
    return res.status(404).json({
      error: "Tournament not found",
    });
  }

  res.json(tourney);
});

app.post("/api/tournaments", (req, res) => {
  const {
    title,
    sport,
    organizerName,
    organizerId,
    organizerContact,
    venue,
    startDate,
    endDate,
    registrationDeadline,
    teamFormat,
    maxTeams,
    prizePool,
    entryFee,
    rules,
    description,
    posterUrl,
  } = req.body;

  if (!title || !sport || !venue || !startDate) {
    return res.status(400).json({
      error: "Title, sport, venue, and start date are required.",
    });
  }

  const newTourney: Tournament = {
    id: `tourney_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 4)}`,
    title: title.trim(),
    sport,
    organizerName:
      organizerName || "Campus Sports Council",
    organizerId: organizerId || "user_organizer",
    organizerContact:
      organizerContact || "sports@srmist.edu.in",
    venue: venue.trim(),
    startDate,
    endDate,
    registrationDeadline:
      registrationDeadline || startDate,
    teamFormat: teamFormat || "5v5 Squad",
    maxTeams: Number(maxTeams) || 16,
    registeredTeamsCount: 0,
    prizePool: prizePool || "Trophy + Certificates",
    entryFee: entryFee || "Free",
    rules:
      Array.isArray(rules) && rules.length > 0
        ? rules
        : [
            "Standard college sports guidelines apply.",
            "Valid SRM Student ID is mandatory.",
          ],
    description:
      description ||
      `Official ${sport} tournament organized for SRM IST students.`,
    posterUrl: posterUrl || undefined,
    status: "upcoming",
    registrations: [],
    createdAt: "Just now",
  };

  tournaments.unshift(newTourney);

  users.forEach((u) => {
    if (u.id !== organizerId) {
      notifications.unshift({
        id: `notif_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 3)}`,
        userId: u.id,
        type: "opportunity",
        title: `🏆 New ${newTourney.sport.toUpperCase()} Tournament!`,
        message: `"${newTourney.title}" at ${newTourney.venue}. Registration is now open.`,
        linkTab: "tournaments",
        read: false,
        createdAt: "Just now",
      });
    }
  });

  res.status(201).json(newTourney);
});

app.post("/api/tournaments/:id/register", (req, res) => {
  const { id } = req.params;

  const {
    teamName,
    captainId,
    captainName,
    captainEmail,
    captainPhone,
    captainRegNo,
    members,
  } = req.body;

  const tourney = tournaments.find((t) => t.id === id);

  if (!tourney) {
    return res.status(404).json({
      error: "Tournament not found",
    });
  }

  if (tourney.registeredTeamsCount >= tourney.maxTeams) {
    return res.status(400).json({
      error: "Tournament is fully booked! Capacity reached.",
    });
  }

  if (!teamName || !captainName || !captainRegNo) {
    return res.status(400).json({
      error:
        "Team Name, Captain Name, and College Reg No are required.",
    });
  }

  if (!tourney.registrations) {
    tourney.registrations = [];
  }

  if (
    tourney.registrations.some(
      (r) =>
        r.teamName.toLowerCase() ===
        teamName.trim().toLowerCase()
    )
  ) {
    return res.status(400).json({
      error:
        "A team with this name is already registered for this tournament.",
    });
  }

  const newReg: TournamentRegistration = {
    id: `reg_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 4)}`,
    tournamentId: id,
    teamName: teamName.trim(),
    captainId: captainId || "captain",
    captainName: captainName.trim(),
    captainEmail: captainEmail || "",
    captainPhone: captainPhone || "",
    captainRegNo: captainRegNo.trim().toUpperCase(),
    members: Array.isArray(members) ? members : [],
    status: "confirmed",
    registeredAt: new Date().toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    ),
  };

  tourney.registrations.push(newReg);
  tourney.registeredTeamsCount += 1;
  impactStats.studentConnections += 1;

  notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: captainId,
    type: "accepted",
    title: `🎉 Registration Confirmed: ${tourney.title}`,
    message: `Team "${teamName}" has been successfully registered for ${tourney.title} at ${tourney.venue}!`,
    linkTab: "tournaments",
    read: false,
    createdAt: "Just now",
  });

  res.status(201).json({
    success: true,
    registration: newReg,
    tournament: tourney,
  });
});

app.delete("/api/tournaments/:id", (req, res) => {
  const { id } = req.params;

  tournaments = tournaments.filter((t) => t.id !== id);

  res.json({
    success: true,
    message: "Tournament deleted.",
  });
});

// ============================================================
// OPPORTUNITIES
// ============================================================

app.get("/api/opportunities", (req, res) => {
  res.json(opportunities);
});

app.post("/api/opportunities", (req, res) => {
  const newOpp: Opportunity = {
    id: `opp_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 4)}`,
    createdAt: "Just now",
    ...req.body,
  };

  opportunities.unshift(newOpp);

  res.status(201).json(newOpp);
});

// ============================================================
// CONNECTIONS
// ============================================================

app.get("/api/connections", (req, res) => {
  res.json(connections);
});

app.post("/api/connections", (req, res) => {
  const {
    fromUserId,
    fromUserName,
    fromUserAvatar,
    fromUserDept,
    fromUserYear,
    toUserId,
    toUserName,
    listingId,
    listingTitle,
    message,
  } = req.body;

  const newConn: ConnectionRequest = {
    id: `conn_${Date.now()}`,
    fromUserId: fromUserId || "current_user",
    fromUserName: fromUserName || "You",
    fromUserAvatar:
      fromUserAvatar ||
      "https://api.dicebear.com/7.x/bottts/svg?seed=student",
    fromUserDept:
      fromUserDept || "Computer Science",
    fromUserYear: fromUserYear || "2nd Year",
    toUserId,
    toUserName,
    listingId,
    listingTitle,
    message:
      message ||
      "Hey! I think your offer/need matches what I'm looking for.",
    status: "pending",
    createdAt: "Just now",
    messages: [
      {
        id: `msg_${Date.now()}`,
        senderId: fromUserId || "current_user",
        senderName: fromUserName || "You",
        text:
          message ||
          "Hey! I think your offer/need matches what I'm looking for.",
        timestamp: "Just now",
      },
    ],
  };

  connections.unshift(newConn);
  impactStats.studentConnections += 1;

  notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: toUserId,
    type: "request",
    title: "🤝 New Connection Request",
    message: `${
      fromUserName || "A student"
    } wants to connect regarding "${
      listingTitle || "an exchange"
    }".`,
    linkTab: "messages",
    read: false,
    createdAt: "Just now",
  });

  res.status(201).json(newConn);
});

const handleConnectionStatusUpdate = (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const { status, contactInfo } = req.body;

  const conn = connections.find((c) => c.id === id);

  if (!conn) {
    return res.status(404).json({
      error: "Connection not found",
    });
  }

  conn.status = status;

  if (contactInfo) {
    conn.contactInfoIfAccepted = contactInfo;
  } else if (
    status === "accepted" &&
    !conn.contactInfoIfAccepted
  ) {
    conn.contactInfoIfAccepted = `${conn.toUserName
      .toLowerCase()
      .replace(/\s+/g, ".")}@srmist.edu.in`;
  }

  if (status === "accepted") {
    impactStats.skillExchanges += 1;

    notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: conn.fromUserId,
      type: "accepted",
      title: "🎉 Connection Request Accepted!",
      message: `${conn.toUserName} accepted your connection. Chat and contact handles are now unlocked!`,
      linkTab: "messages",
      read: false,
      createdAt: "Just now",
    });
  }

  res.json(conn);
};

app.put(
  "/api/connections/:id/status",
  handleConnectionStatusUpdate
);

app.patch(
  "/api/connections/:id/status",
  handleConnectionStatusUpdate
);

app.post("/api/connections/:id/messages", (req, res) => {
  const { id } = req.params;
  const { senderId, senderName, text } = req.body;

  const conn = connections.find((c) => c.id === id);

  if (!conn) {
    return res.status(404).json({
      error: "Connection not found",
    });
  }

  const newMsg = {
    id: `msg_${Date.now()}`,
    senderId: senderId || "current_user",
    senderName: senderName || "You",
    text,
    timestamp: "Just now",
  };

  conn.messages.push(newMsg);

  res.status(201).json(newMsg);
});

// ============================================================
// NOTIFICATIONS
// ============================================================

app.get("/api/notifications", (req, res) => {
  res.json(notifications);
});

app.put("/api/notifications/mark-read", (req, res) => {
  notifications.forEach((n) => {
    n.read = true;
  });

  res.json({
    success: true,
  });
});

// ============================================================
// AI SMART MATCH
// ============================================================

app.post("/api/ai/smart-match", async (req, res) => {
  const { prompt, userProfile } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      error: "Prompt is required",
    });
  }

  const ai = getGeminiClient();

  const availableListings = listings.filter(
    (l) => l.status === "active"
  );

  const listingsContext = availableListings.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    category: l.category,
    type: l.type,
    exchangeType: l.exchangeType,
    tags: l.tags,
    ownerName: l.ownerName,
    ownerDept: l.ownerDept,
    ownerYear: l.ownerYear,
    campusZone: l.campusZone,
    lookingFor: l.lookingFor,
  }));

  if (ai) {
    try {
      const systemPrompt = `You are the intelligent campus matchmaking engine for RExchange at SRM Institute of Science & Technology.

Your goal is to parse a student's natural language request and match them with real resources, tutors, and students in our campus database.

Current Database Listings:
${JSON.stringify(listingsContext, null, 2)}

User Profile info:
${JSON.stringify(userProfile || {}, null, 2)}

Analyze the user's natural language prompt.

Generate a valid JSON object matching this schema:

{
"extractedIntent": {
  "needs": ["string"],
  "subject": "string",
  "urgency": "normal" | "high",
  "suggestedCategory": "string"
},
"matches": [
  {
    "listingId": "string",
    "matchType": "strong" | "good" | "potential",
    "headline": "Short punchy match summary",
    "offersSummary": "What this student offers that helps",
    "reasonWhy": "Clear explanation of why this matches",
    "suggestedAction": "connect"
  }
],
"noMatchAdvice": "Friendly advice if no strong matches exist"
}

IMPORTANT:
- ONLY reference listingIds that actually exist.
- If there are zero listings or no matches, return empty matches array [].
- Return ONLY the JSON object.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\nStudent Query: "${prompt}"`,
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      const rawText = response.text;

      if (rawText) {
        try {
          const parsed = JSON.parse(rawText);

          if (Array.isArray(parsed.matches)) {
            parsed.matches = parsed.matches
              .map((m: any) => {
                const listing = availableListings.find(
                  (l) => l.id === m.listingId
                );

                if (!listing) return null;

                return {
                  id: `match_${listing.id}_${Date.now()}`,
                  listing,
                  matchType: m.matchType || "good",
                  headline:
                    m.headline ||
                    `Match: ${listing.title}`,
                  offersSummary:
                    m.offersSummary || listing.title,
                  reasonWhy:
                    m.reasonWhy ||
                    `Matches your search for ${listing.tags.join(
                      ", "
                    )}`,
                  suggestedAction: "connect",
                };
              })
              .filter(Boolean);
          }

          return res.json(parsed);
        } catch (jsonErr) {
          console.error(
            "Failed to parse Gemini JSON:",
            jsonErr
          );
        }
      }
    } catch (geminiError) {
      console.warn(
        "Gemini API call failed, falling back to heuristic matcher:",
        geminiError
      );
    }
  }

  const q = prompt.toLowerCase();
  const matches: any[] = [];

  for (const listing of availableListings) {
    let score = 0;
    const reasons: string[] = [];

    const terms = q
      .split(/\s+/)
      .filter((w) => w.length > 2);

    for (const term of terms) {
      if (listing.title.toLowerCase().includes(term)) {
        score += 4;
        reasons.push(`Title matches "${term}"`);
      }

      if (
        listing.description
          .toLowerCase()
          .includes(term)
      ) {
        score += 2;
        reasons.push(`Mentions "${term}" in description`);
      }

      if (
        listing.tags.some((t) =>
          t.toLowerCase().includes(term)
        )
      ) {
        score += 3;
        reasons.push(`Tagged with "${term}"`);
      }
    }

    if (score >= 4) {
      matches.push({
        id: `match_${listing.id}`,
        listing,
        matchType: score >= 8 ? "strong" : "good",
        headline:
          score >= 8
            ? `🎯 Strong Match: ${listing.title}`
            : `✨ Good Match: ${listing.title}`,
        offersSummary: `${listing.ownerName} (${listing.ownerDept}, ${listing.ownerYear}) offers ${listing.title}`,
        reasonWhy:
          reasons.slice(0, 2).join(" and ") ||
          "Directly aligns with what you are looking for.",
        suggestedAction: "connect",
      });
    }
  }

  res.json({
    extractedIntent: {
      needs: [prompt],
      subject: "Campus Request",
      urgency:
        q.includes("tomorrow") || q.includes("urgent")
          ? "high"
          : "normal",
      suggestedCategory:
        matches[0]?.listing?.category || "academic",
    },
    matches: matches.slice(0, 5),
    noMatchAdvice:
      matches.length === 0
        ? "No matching listings in the campus exchange yet — be the first to post what you need!"
        : undefined,
  });
});

// ============================================================
// AI LISTING ENHANCER
// ============================================================

app.post("/api/ai/enhance-listing", async (req, res) => {
  const { rawInput, type, category } = req.body;

  if (!rawInput) {
    return res.status(400).json({
      error: "rawInput is required",
    });
  }

  const ai = getGeminiClient();

  if (ai) {
    try {
      const prompt = `You are the RExchange Campus Assistant at SRM IST.

A student wants to share something on campus and gave this rough note:

"${rawInput}"

Listing Type: ${type || "offer"}
Category hint: ${category || "general"}

Rewrite this into a clean, attractive, friendly campus listing.

Output ONLY a JSON object:
{
"title": "Clean descriptive title",
"description": "2-3 engaging sentences",
"category": "books" | "electronics" | "notes" | "academic" | "creative" | "sports" | "hostel" | "skills" | "opportunities" | "free",
"exchangeType": "giveaway" | "sell" | "swap" | "skill_swap" | "borrow" | "collab",
"tags": ["tag1", "tag2", "tag3"],
"suggestedLookingFor": "Friendly suggestion"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (err) {
      console.warn(
        "Listing enhance AI fallback:",
        err
      );
    }
  }

  const words = rawInput.trim().split(/\s+/);

  const capitalizedTitle = words
    .map(
      (w: string) =>
        w.charAt(0).toUpperCase() + w.slice(1)
    )
    .join(" ");

  res.json({
    title:
      capitalizedTitle.length > 60
        ? capitalizedTitle.slice(0, 57) + "..."
        : capitalizedTitle,

    description: `${capitalizedTitle}. Available on SRMIST campus for fellow students.`,

    category:
      category ||
      (rawInput.toLowerCase().includes("book")
        ? "books"
        : rawInput.toLowerCase().includes("note")
        ? "notes"
        : "electronics"),

    exchangeType: rawInput
      .toLowerCase()
      .includes("free")
      ? "giveaway"
      : "swap",

    tags: [
      "CampusExchange",
      "StudentResource",
      "SRMIST",
    ],

    suggestedLookingFor:
      "Open to exchange or reasonable offer",
  });
});

// ============================================================
// REX AI CHAT
// ============================================================

app.post("/api/ai/rex-chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const ai = getGeminiClient();

  const activeListings = listings
    .filter((l) => l.status === "active")
    .slice(0, 10);

  const activeTournaments = tournaments.slice(0, 5);

  if (ai) {
    try {
      const systemPrompt = `You are Rex 🤖, the friendly campus AI companion for RExchange at SRM Institute of Science & Technology.

Help students find sports tournaments, study resources, calculators, textbooks, team registrations, and skill swaps.

NEVER fabricate fake listings or users.

Current listings:
${JSON.stringify(
activeListings.map((l) => ({
  id: l.id,
  title: l.title,
  type: l.type,
  owner: l.ownerName,
  dept: l.ownerDept,
  zone: l.campusZone,
})),
null,
2
)}

Current tournaments:
${JSON.stringify(
activeTournaments.map((t) => ({
  id: t.id,
  title: t.title,
  sport: t.sport,
  venue: t.venue,
  startDate: t.startDate,
  capacity: `${t.registeredTeamsCount}/${t.maxTeams}`,
})),
null,
2
)}

Provide a concise friendly reply.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\nStudent asks: "${message}"`,
              },
            ],
          },
        ],
      });

      return res.json({
        reply:
          response.text ||
          "Hey! I'm Rex, your SRM exchange companion. How can I help?",
      });
    } catch (err) {
      console.warn("Rex chat AI error:", err);
    }
  }

  const m = message.toLowerCase();

  let reply =
    "Hey! I'm Rex 🤖, your SRMIST campus exchange companion. ";

  if (
    m.includes("tournament") ||
    m.includes("sports") ||
    m.includes("football") ||
    m.includes("cricket") ||
    m.includes("badminton")
  ) {
    reply +=
      "Check out our Tournaments tab! You can register your team for campus sports events or host your own.";
  } else if (
    m.includes("calculator") ||
    m.includes("casio")
  ) {
    reply +=
      "Scientific calculators are high in demand! Check the Explore tab or post a Need request.";
  } else if (
    m.includes("skill swap") ||
    m.includes("skill")
  ) {
    reply +=
      "Skill Swap lets SRM students exchange skills directly without money.";
  } else {
    reply +=
      "You can search for anything on campus, register for tournaments, or list items you want to sell, swap, or give away!";
  }

  res.json({ reply });
});

// ============================================================
// SKILL SWAPS
// ============================================================

app.get("/api/skill-swaps", (req, res) => {
  const pairs: any[] = [];

  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      const u1 = users[i];
      const u2 = users[j];

      const hasComplement =
        u1.skillsOffered.some((s) =>
          u2.skillsNeeded.includes(s)
        ) ||
        u2.skillsOffered.some((s) =>
          u1.skillsNeeded.includes(s)
        );

      if (hasComplement) {
        pairs.push({
          id: `swap_${u1.id}_${u2.id}`,

          userA: {
            id: u1.id,
            name: u1.name,
            avatar: u1.avatarUrl,
            dept: u1.department,
            year: u1.year,
            offers: u1.skillsOffered.join(", "),
            needs: u1.skillsNeeded.join(", "),
          },

          userB: {
            id: u2.id,
            name: u2.name,
            avatar: u2.avatarUrl,
            dept: u2.department,
            year: u2.year,
            offers: u2.skillsOffered.join(", "),
            needs: u2.skillsNeeded.join(", "),
          },

          matchScore: 95,

          reason: `Complementary skill exchange between ${u1.name} and ${u2.name}`,

          category: `${u1.department} ↔ ${u2.department}`,
        });
      }
    }
  }

  res.json(pairs);
});


// ============================================================
// LOCAL DEVELOPMENT / VERCEL EXPORT
// ============================================================

/*
 * Vercel detects this file because it is named server.ts and the
 * Express application is exported as the default export.
 *
 * IMPORTANT:
 * - Never call app.listen() on Vercel.
 * - Local development still starts a normal HTTP server.
 */
if (process.env.VERCEL !== "1") {
  if (process.env.NODE_ENV !== "production") {
    createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    })
      .then((vite) => {
        app.use(vite.middlewares);

        const PORT = Number(process.env.PORT) || 3000;

        app.listen(PORT, "0.0.0.0", () => {
          console.log(
            `RExchange server active on http://0.0.0.0:${PORT}`
          );
        });
      })
      .catch((err) => {
        console.error("Failed to start Vite development server:", err);
        process.exit(1);
      });
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));

    // Regex form works with Express 4 and Express 5.
    app.get(/.*/, (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });

    const PORT = Number(process.env.PORT) || 3000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `RExchange server active on http://0.0.0.0:${PORT}`
      );
    });
  }
}

// Final Express error handler.
// This keeps application errors from becoming an unhandled function crash.
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled Express error:", err);

    if (res.headersSent) {
      return next(err);
    }

    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected server error occurred."
          : err?.message || "Unknown server error",
    });
  }
);

// Vercel uses this default export as the serverless Express application.
export default app;
export { app };
