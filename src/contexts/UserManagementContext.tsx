import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, SubscriptionTier, SUBSCRIPTION_LIMITS } from '@/types';
import { mockUsers } from '@/data/mockData';

interface UserManagementContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserStatus: (id: string) => void;
  updateUserSubscription: (id: string, tier: SubscriptionTier) => void;
  resetUserCredits: (id: string) => void;
}

const UserManagementContext = createContext<UserManagementContextType | undefined>(undefined);

export function UserManagementProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('axsec_users');
    return saved ? JSON.parse(saved) : mockUsers;
  });

  const saveUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('axsec_users', JSON.stringify(newUsers));
  };

  const addUser = useCallback((userData: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
    };
    saveUsers([...users, newUser]);
  }, [users]);

  const updateUser = useCallback((id: string, updates: Partial<User>) => {
    saveUsers(users.map(user => user.id === id ? { ...user, ...updates } : user));
  }, [users]);

  const deleteUser = useCallback((id: string) => {
    saveUsers(users.filter(user => user.id !== id));
  }, [users]);

  const toggleUserStatus = useCallback((id: string) => {
    saveUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  }, [users]);

  const updateUserSubscription = useCallback((id: string, tier: SubscriptionTier) => {
    const limits = SUBSCRIPTION_LIMITS[tier];
    saveUsers(users.map(user => 
      user.id === id ? { 
        ...user, 
        subscription: tier,
        dailyCreditsLimit: limits.dailyCredits,
        dailyCreditsUsed: 0
      } : user
    ));
  }, [users]);

  const resetUserCredits = useCallback((id: string) => {
    saveUsers(users.map(user => 
      user.id === id ? { ...user, dailyCreditsUsed: 0 } : user
    ));
  }, [users]);

  return (
    <UserManagementContext.Provider value={{ 
      users, 
      addUser, 
      updateUser, 
      deleteUser, 
      toggleUserStatus,
      updateUserSubscription,
      resetUserCredits
    }}>
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error('useUserManagement must be used within a UserManagementProvider');
  }
  return context;
}
