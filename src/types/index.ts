export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  subscription: SubscriptionTier;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

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
