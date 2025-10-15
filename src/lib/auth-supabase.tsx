import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { ReviewReport } from './bookData';

export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  role: 'user' | 'admin';
  avatar?: string;
  bio?: string;
  preferences?: {
    favoriteGenres: string[];
    readingGoal?: number;
    readBooks?: string[]; // Array of book IDs
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, username: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  reportReview: (reviewId: string, reason: string, description: string) => Promise<void>;
  getReviewReports: () => Promise<ReviewReport[]>;
  updateReportStatus: (reportId: string, status: ReviewReport['status']) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (!profile) return null;

      // Transform database profile to User interface
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        username: profile.username,
        role: profile.role as 'user' | 'admin',
        avatar: profile.avatar || undefined,
        bio: profile.bio || undefined,
        preferences: {
          favoriteGenres: profile.favorite_genres || [],
          readingGoal: profile.reading_goal || undefined,
          readBooks: [] // Will be populated from user_book_status
        }
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user).then(setUser);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchUserProfile(session.user);
        setUser(profile);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check if username is available
  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .ilike('username', username)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is what we want
        console.error('Error checking username:', error);
        return false;
      }

      return !data; // Available if no data found
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user);
        setUser(profile);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Signup function
  const signup = async (
    email: string,
    password: string,
    name: string,
    username: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Check username availability first
      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        setIsLoading(false);
        return false;
      }

      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        setIsLoading(false);
        // Throw error with message so UI can display it
        throw new Error(error.message || 'Signup failed');
      }

      if (data.user) {
        // Profile is automatically created by database trigger
        // Wait a moment for trigger to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const profile = await fetchUserProfile(data.user);
        setUser(profile);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      throw error; // Re-throw so Login component can catch it
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const dbUpdates: any = {};
      
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.username) dbUpdates.username = updates.username;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar;
      if (updates.preferences?.favoriteGenres) {
        dbUpdates.favorite_genres = updates.preferences.favoriteGenres;
      }
      if (updates.preferences?.readingGoal !== undefined) {
        dbUpdates.reading_goal = updates.preferences.readingGoal;
      }

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      // Update local user state
      setUser({ ...user, ...updates });
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  // Report a review
  const reportReview = async (reviewId: string, reason: string, description: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('review_reports')
        .insert({
          review_id: reviewId,
          reporter_id: user.id,
          reason,
          description,
        });

      if (error) {
        console.error('Error reporting review:', error);
        throw error;
      }

      // Update the review's report count
      const { error: updateError } = await supabase.rpc('increment_review_report_count', {
        review_id: reviewId
      });

      if (updateError) {
        console.error('Error updating review report count:', updateError);
      }
    } catch (error) {
      console.error('Error reporting review:', error);
      throw error;
    }
  };

  // Get all review reports (admin only)
  const getReviewReports = async (): Promise<ReviewReport[]> => {
    if (!user || user.role !== 'admin') return [];

    try {
      const { data, error } = await supabase
        .from('review_reports')
        .select(`
          *,
          reporter:profiles!review_reports_reporter_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching review reports:', error);
        return [];
      }

      // Transform to ReviewReport interface
      return data.map(report => ({
        id: report.id,
        reviewId: report.review_id,
        reporterId: report.reporter_id,
        reporterName: report.reporter?.name || 'Unknown',
        reason: report.reason,
        description: report.description,
        date: report.created_at,
        status: report.status as ReviewReport['status']
      }));
    } catch (error) {
      console.error('Error fetching review reports:', error);
      return [];
    }
  };

  // Update report status (admin only)
  const updateReportStatus = async (reportId: string, status: ReviewReport['status']) => {
    if (!user || user.role !== 'admin') return;

    try {
      const { error } = await supabase
        .from('review_reports')
        .update({ status })
        .eq('id', reportId);

      if (error) {
        console.error('Error updating report status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        checkUsernameAvailability,
        reportReview,
        getReviewReports,
        updateReportStatus,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
