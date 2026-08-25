import { Listing, Opportunity, SkillSwapPair, UserProfile, ImpactStats, Tournament } from '../types';

export const INITIAL_IMPACT_STATS: ImpactStats = {
  resourcesShared: 0,
  skillExchanges: 0,
  studentConnections: 0,
  estimatedValueSaved: 0,
};

// No demo accounts or fake credentials - start with a pristine, authentic database
export const DEMO_ACCOUNTS_CREDENTIALS: any[] = [];

// Empty initial users - user personally creates the first real account
export const DEMO_USERS: UserProfile[] = [];

// Empty initial listings - ready for real student posts
export const INITIAL_LISTINGS: Listing[] = [];

// Empty initial skill swap pairs
export const INITIAL_SKILL_SWAP_PAIRS: SkillSwapPair[] = [];

// Empty initial opportunities
export const INITIAL_OPPORTUNITIES: Opportunity[] = [];

// Empty initial tournaments
export const INITIAL_TOURNAMENTS: Tournament[] = [];
