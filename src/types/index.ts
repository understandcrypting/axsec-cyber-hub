export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  subscription: SubscriptionTier;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
  dailyCreditsUsed: number;
  dailyCreditsLimit: number;
}

export type SubscriptionTier = 'pro' | 'enterprise';

export interface SubscriptionLimits {
  dailyCredits: number;
  displayCredits: string;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  pro: { dailyCredits: 100, displayCredits: '100/day' },
  enterprise: { dailyCredits: -1, displayCredits: 'Unlimited' },
};

export interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ModuleCategory;
  searchTypes: SearchType[];
  isActive: boolean;
  requiredTier: SubscriptionTier;
}

export type ModuleCategory = 
  | 'social'
  | 'breach'
  | 'network'
  | 'identity'
  | 'gaming'
  | 'utilities';

export interface SearchType {
  id: string;
  label: string;
  placeholder: string;
  icon: string;
}

export interface SearchResult {
  id: string;
  module: string;
  query: string;
  timestamp: string;
  status: 'success' | 'not_found' | 'error';
  data: Record<string, unknown>;
}

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  startDate: string;
  endDate: string;
  isActive: boolean;
  features: string[];
}
