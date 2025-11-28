import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import UserProfileORM, {
  type UserProfileModel,
  type UserProfilePreferencesModel,
  UserProfileSubscriptionTier
} from '@/components/data/orm/orm_user_profile';
import { seedAdminUser } from '@/lib/seed-admin';

interface AuthContextType {
  user: UserProfileModel | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  googleAuth: (googleId: string, email: string, name: string, picture?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<UserProfileModel>) => Promise<void>;
  isPremium: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfileModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const orm = UserProfileORM.getInstance();

  useEffect(() => {
    // Seed admin user on app initialization
    seedAdminUser().catch(console.error);

    // Check for existing session
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      loadUser(storedUserId);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async (userId: string) => {
    try {
      const users = await orm.getUserProfileById(userId);
      if (users.length > 0) {
        setUser(users[0]);
      } else {
        localStorage.removeItem('userId');
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('userId');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const users = await orm.getUserProfileByEmail(email);

      if (users.length === 0) {
        return { success: false, error: 'Invalid email or password' };
      }

      const foundUser = users[0];

      // Simple password check (in production, use proper hashing)
      if (foundUser.password !== password) {
        return { success: false, error: 'Invalid email or password' };
      }

      setUser(foundUser);
      if (foundUser.id) {
        localStorage.setItem('userId', foundUser.id);
      }
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if user exists
      const existingUsers = await orm.getUserProfileByEmail(email);
      if (existingUsers.length > 0) {
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const newUsers = await orm.insertUserProfile([{
        email,
        password, // In production, use proper hashing
        name,
        subscription_tier: UserProfileSubscriptionTier.Free,
        preferences: {
          dark_mode: false,
          language: 'en',
          notifications_enabled: true
        }
      } as UserProfileModel]);

      if (newUsers.length > 0) {
        const newUser = newUsers[0];
        setUser(newUser);
        if (newUser.id) {
          localStorage.setItem('userId', newUser.id);
        }
        return { success: true };
      }

      return { success: false, error: 'Failed to create account' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const googleAuth = async (googleId: string, email: string, name: string, picture?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if user exists by email
      const existingUsers = await orm.getUserProfileByEmail(email);

      if (existingUsers.length > 0) {
        // User exists - login
        const foundUser = existingUsers[0];
        setUser(foundUser);
        if (foundUser.id) {
          localStorage.setItem('userId', foundUser.id);
        }
        return { success: true };
      }

      // User doesn't exist - create new account
      const newUsers = await orm.insertUserProfile([{
        email,
        password: googleId, // Store Google ID as password identifier
        name,
        subscription_tier: UserProfileSubscriptionTier.Free,
        preferences: {
          dark_mode: false,
          language: 'en',
          notifications_enabled: true
        }
      } as UserProfileModel]);

      if (newUsers.length > 0) {
        const newUser = newUsers[0];
        setUser(newUser);
        if (newUser.id) {
          localStorage.setItem('userId', newUser.id);
        }
        return { success: true };
      }

      return { success: false, error: 'Failed to create account' };
    } catch (error) {
      console.error('Google auth error:', error);
      return { success: false, error: 'Google authentication failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  const updateUser = async (updates: Partial<UserProfileModel>) => {
    if (!user || !user.id) return;

    try {
      const updatedData = { ...user, ...updates };
      const updatedUsers = await orm.setUserProfileById(user.id, updatedData);
      if (updatedUsers.length > 0) {
        setUser(updatedUsers[0]);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const isPremium = user?.subscription_tier === UserProfileSubscriptionTier.Premium &&
    (!user.subscription_expiry_date || new Date(user.subscription_expiry_date) > new Date());

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, googleAuth, logout, updateUser, isPremium }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
