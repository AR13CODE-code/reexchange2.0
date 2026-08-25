export type ItemCategory = 
  | 'books'
  | 'electronics'
  | 'notes'
  | 'academic'
  | 'creative'
  | 'sports'
  | 'hostel'
  | 'skills'
  | 'opportunities'
  | 'tournaments'
  | 'free';

export type ExchangeType = 
  | 'giveaway'    // Free
  | 'sell'        // For sale with price in INR ₹
  | 'swap'        // Item Exchange
  | 'skill_swap'  // Skill for Skill
  | 'borrow'      // Temporary lend
  | 'collab';     // Project/Study collaboration

export type SRM_CampusLocation = 
  | 'Tech Park'
  | 'BEL Lab'
  | 'University Building'
  | 'Central Library'
  | 'N Block Hostel'
  | 'Java Canteen'
  | 'Vendhat Square'
  | 'Indoor Stadium'
  | 'Main Football Ground'
  | 'Arch Gate / Potheri'
  | 'Flexible / Anywhere on campus';

export const SRM_CAMPUS_LOCATIONS: SRM_CampusLocation[] = [
  'Tech Park',
  'BEL Lab',
  'University Building',
  'Central Library',
  'N Block Hostel',
  'Java Canteen',
  'Vendhat Square',
  'Indoor Stadium',
  'Main Football Ground',
  'Arch Gate / Potheri',
  'Flexible / Anywhere on campus'
];

export type ListingType = 'offer' | 'need';

export interface UserProfile {
  id: string;
  name: string;
  regNo?: string; // SRM College Registration Number e.g. RA2311003010123
  email: string;
  mobileNumber?: string; // Indian mobile/WhatsApp number e.g. +91 9876543210
  avatarUrl: string;
  college: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Postgrad';
  department: string;
  skillsOffered: string[];
  skillsNeeded: string[];
  interests: string[];
  campusZone?: string;
  bio?: string;
  contactHandle?: string; // e.g., campus email, WhatsApp or discord, shared only upon connection acceptance
  stats: {
    resourcesShared: number;
    skillExchanges: number;
    connectionsMade: number;
  };
  isDemo?: boolean;
}

export interface Listing {
  id: string;
  type: ListingType;
  title: string;
  description: string;
  category: ItemCategory;
  exchangeType: ExchangeType;
  price?: number;
  priceNegotiable?: boolean;
  lendDuration?: string;
  lookingFor?: string; // what they want in exchange or specific help required
  tags: string[];
  condition?: 'Brand New' | 'Like New' | 'Gently Used' | 'Well Loved' | 'Digital / Notes';
  imageUrl?: string;
  campusZone: string;
  ownerId: string;
  ownerName: string;
  ownerRegNo?: string;
  ownerAvatar: string;
  ownerDept: string;
  ownerYear: string;
  ownerCollege: string;
  createdAt: string;
  status: 'active' | 'completed' | 'paused';
  savesCount: number;
  isDemo?: boolean;
}

export type TournamentSport = 
  | 'football' 
  | 'cricket' 
  | 'badminton' 
  | 'basketball' 
  | 'esports' 
  | 'volleyball' 
  | 'chess' 
  | 'table_tennis' 
  | 'athletics' 
  | 'other';

export interface TournamentTeamMember {
  name: string;
  regNo: string;
  department?: string;
}

export interface TournamentRegistration {
  id: string;
  tournamentId: string;
  teamName: string;
  captainId: string;
  captainName: string;
  captainEmail: string;
  captainPhone: string;
  captainRegNo: string;
  members: TournamentTeamMember[];
  status: 'confirmed' | 'pending';
  registeredAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  sport: TournamentSport;
  organizerName: string;
  organizerId: string;
  organizerContact: string;
  venue: string;
  startDate: string;
  endDate?: string;
  registrationDeadline: string;
  teamFormat: 'Solo (1v1)' | 'Doubles (2v2)' | '3v3 Squad' | '5v5 Squad' | '7v7 Team' | '11v11 Squad' | 'Custom Team';
  maxTeams: number;
  registeredTeamsCount: number;
  prizePool?: string;
  entryFee?: string;
  rules: string[];
  description: string;
  posterUrl?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrations?: TournamentRegistration[];
  createdAt: string;
}

export interface SkillSwapPair {
  id: string;
  userA: {
    id: string;
    name: string;
    avatar: string;
    dept: string;
    year: string;
    offers: string;
    needs: string;
  };
  userB: {
    id: string;
    name: string;
    avatar: string;
    dept: string;
    year: string;
    offers: string;
    needs: string;
  };
  matchScore: number;
  reason: string;
  category: string;
}

export interface SmartMatchResult {
  id: string;
  listing?: Listing;
  user?: Partial<UserProfile>;
  matchType: 'strong' | 'good' | 'potential';
  headline: string;
  offersSummary: string;
  reasonWhy: string;
  suggestedAction: 'connect' | 'view_listing' | 'message';
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'hackathon' | 'workshop' | 'internship' | 'club' | 'project' | 'competition';
  organizer: string;
  deadline?: string;
  venue?: string;
  link?: string;
  description: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  fromUserDept: string;
  fromUserYear: string;
  toUserId: string;
  toUserName: string;
  listingId?: string;
  listingTitle?: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  contactInfoIfAccepted?: string;
  createdAt: string;
  messages: {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'match' | 'request' | 'accepted' | 'message' | 'opportunity';
  title: string;
  message: string;
  linkTab?: string;
  read: boolean;
  createdAt: string;
}

export interface ImpactStats {
  resourcesShared: number;
  skillExchanges: number;
  studentConnections: number;
  estimatedValueSaved: number;
}
