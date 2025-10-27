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
    let mounted = true;
    
    // Check active session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setIsLoading(false);
          return;
        }
        
        if (session?.user && mounted) {
          const profile = await fetchUserProfile(session.user);
          if (mounted) {
            setUser(profile);
            setIsLoading(false);
          }
        } else if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session ? `User: ${session.user.email}` : 'No session');
      
      try {
        if (!mounted) return;
        
        if (session?.user) {
          console.log('Loading user profile for:', session.user.email);
          const profile = await fetchUserProfile(session.user);
          if (mounted) {
            console.log('Setting user profile:', profile?.email, 'Role:', profile?.role);
            setUser(profile);
            setIsLoading(false);
          }
        } else {
          console.log('Clearing user session');
          if (mounted) {
            setUser(null);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
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
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn('Login timeout - resetting loading state');
        setIsLoading(false);
      }, 15000); // 15 second timeout
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      clearTimeout(timeoutId);

      if (error) {
        console.error('Login error:', error);
        setIsLoading(false);
        
        // Check for connection errors
        if (error.message?.includes('fetch') || error.name === 'AuthRetryableFetchError') {
          throw new Error('Unable to connect to authentication service. Please check your internet connection or try again later.');
        }
        
        return false;
      }

      if (data.user) {
        // Don't manually set user here - let the onAuthStateChange listener handle it
        // This prevents race conditions and duplicate state updates
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      // Re-throw connection errors so they can be displayed to the user
      if (error.message?.includes('connect') || error.message?.includes('fetch')) {
        throw error;
      }
      
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

      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn('Signup timeout - resetting loading state');
        setIsLoading(false);
      }, 15000); // 15 second timeout

      // Check username availability first
      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        clearTimeout(timeoutId);
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

      clearTimeout(timeoutId);

      if (error) {
        console.error('Signup error:', error);
        setIsLoading(false);
        // Throw error with message so UI can display it
        throw new Error(error.message || 'Signup failed');
      }

      if (data.user) {
        // Don't manually set user here - let the onAuthStateChange listener handle it
        // This prevents race conditions and duplicate state updates
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
      setIsLoading(true);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn('Logout timeout - resetting state anyway');
        setUser(null);
        setIsLoading(false);
      }, 5000); // 5 second timeout for logout
      
      // Sign out from Supabase - this clears all auth tokens and sessions
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Logout error:', error);
        // Even if there's an error, clear the local state
      }
      
      // Clear user state immediately
      // The onAuthStateChange listener will also handle this, but we do it here for immediate feedback
      setUser(null);
      setIsLoading(false);
      
      // Force a small delay to ensure all cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Logout complete - session cleared');
    } catch (error) {
      console.error('Logout error:', error);
      // Always ensure we clear state even if logout fails
      setUser(null);
      setIsLoading(false);
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

      console.log('Updating profile in database with:', dbUpdates);
      
      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile in database:', error);
        return false;
      }

      console.log('Database update successful, updating local user state');
      console.log('Current user:', user);
      console.log('Updates to apply:', updates);
      
      // Update local user state
      const updatedUser = { ...user, ...updates };
      console.log('New user object:', updatedUser);
      setUser(updatedUser);
      
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
