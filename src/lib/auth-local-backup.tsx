import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ReviewReport } from './bookData';

// THIS IS THE OLD LOCAL STORAGE AUTH SYSTEM
// KEPT AS BACKUP - DO NOT USE
// Use auth-supabase.tsx instead

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
  checkUsernameAvailability: (username: string) => boolean;
  reportReview: (reviewId: string, reason: string, description: string) => Promise<void>;
  getReviewReports: () => ReviewReport[];
  updateReportStatus: (reportId: string, status: ReviewReport['status']) => void;
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
  const [reviewReports, setReviewReports] = useState<ReviewReport[]>([]);

  // Mock users for demo
  const mockUsers: { [key: string]: User & { password: string } } = {
    'user@example.com': {
      id: '1',
      email: 'user@example.com',
      name: 'John Reader',
      username: 'johnreader',
      role: 'user',
      password: 'password',
      bio: 'Passionate reader exploring diverse worlds through books. Love fantasy, fiction, and discovering new authors!',
      preferences: {
        favoriteGenres: ['Fiction', 'Fantasy'],
        readingGoal: 50,
        readBooks: ['1', '3', '5'] // User has read The Midnight Library, Seven Husbands, and Name of the Wind
      }
    },
    'admin@example.com': {
      id: '2',
      email: 'admin@example.com',
      name: 'Admin User',
      username: 'admin',
      role: 'admin',
      password: 'admin',
      bio: 'LitLens administrator managing the platform and helping readers discover their next favorite book.',
      preferences: {
        favoriteGenres: ['Biography', 'Non-Fiction'],
        readingGoal: 30,
        readBooks: ['6', '10'] // Educated and Becoming
      }
    }
  };

  // Get registered users from localStorage
  const getRegisteredUsers = (): { [key: string]: User & { password: string } } => {
    const stored = localStorage.getItem('litlens_registered_users');
    return stored ? JSON.parse(stored) : {};
  };

  // Save registered users to localStorage
  const saveRegisteredUsers = (users: { [key: string]: User & { password: string } }) => {
    localStorage.setItem('litlens_registered_users', JSON.stringify(users));
  };

  // Check if username is available
  const checkUsernameAvailability = (username: string): boolean => {
    const registeredUsers = getRegisteredUsers();
    const allUsers = { ...mockUsers, ...registeredUsers };
    
    return !Object.values(allUsers).some(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
  };

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('litlens_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('litlens_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registeredUsers = getRegisteredUsers();
    const allUsers = { ...mockUsers, ...registeredUsers };
    
    const foundUser = allUsers[email];
    if (foundUser && foundUser.password === password) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('litlens_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, password: string, name: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const registeredUsers = getRegisteredUsers();
    const allUsers = { ...mockUsers, ...registeredUsers };
    
    // Check if email already exists
    if (allUsers[email]) {
      setIsLoading(false);
      return false; // User already exists
    }
    
    // Check if username already exists
    if (!checkUsernameAvailability(username)) {
      setIsLoading(false);
      return false; // Username already taken
    }
    
    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email,
      name,
      username,
      role: 'user',
      password,
      preferences: {
        favoriteGenres: [],
        readingGoal: 25,
        readBooks: []
      }
    };
    
    // Save to registered users
    const updatedRegisteredUsers = { ...registeredUsers, [email]: newUser };
    saveRegisteredUsers(updatedRegisteredUsers);
    
    // Set current user (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('litlens_user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('litlens_user');
  };

  // Mock reports for demo
  const mockReports: ReviewReport[] = [
    {
      id: '1',
      reviewId: '1', // Report for Alice Johnson's review
      reporterId: '3',
      reporterName: 'Mike Reader',
      reason: 'spam',
      description: 'This review appears to be promotional content for another book platform.',
      date: '2024-09-20T10:30:00Z',
      status: 'pending'
    },
    {
      id: '2',
      reviewId: '3', // Report for David Chen's review
      reporterId: '4',
      reporterName: 'Sarah Wilson',
      reason: 'inappropriate',
      description: 'Contains offensive language and personal attacks against the author.',
      date: '2024-09-21T14:15:00Z',
      status: 'pending'
    },
    {
      id: '3',
      reviewId: '5', // Report for Emma Davis's review
      reporterId: '2',
      reporterName: 'John Reader',
      reason: 'fake',
      description: 'This review seems fake - the user mentions plot points that don\'t exist in the book.',
      date: '2024-09-19T09:45:00Z',
      status: 'pending'
    },
    {
      id: '4',
      reviewId: '7', // Report for Michael Brown's review (already processed)
      reporterId: '5',
      reporterName: 'Lisa Anderson',
      reason: 'harassment',
      description: 'Review contains personal attacks and harassment towards other reviewers.',
      date: '2024-09-18T16:20:00Z',
      status: 'actionTaken'
    },
    {
      id: '5',
      reviewId: '9', // Report for Jennifer White's review (dismissed)
      reporterId: '6',
      reporterName: 'Tom Johnson',
      reason: 'hate-speech',
      description: 'Review contains discriminatory language.',
      date: '2024-09-17T11:30:00Z',
      status: 'dismissed'
    }
  ];

  // Load reports from localStorage
  useEffect(() => {
    const storedReports = localStorage.getItem('litlens_review_reports');
    if (storedReports) {
      try {
        setReviewReports(JSON.parse(storedReports));
      } catch (error) {
        localStorage.removeItem('litlens_review_reports');
        // If localStorage is corrupted, initialize with mock data
        setReviewReports(mockReports);
        localStorage.setItem('litlens_review_reports', JSON.stringify(mockReports));
      }
    } else {
      // Initialize with mock data if no stored reports
      setReviewReports(mockReports);
      localStorage.setItem('litlens_review_reports', JSON.stringify(mockReports));
    }
  }, []);

  // Save reports to localStorage
  const saveReports = (reports: ReviewReport[]) => {
    localStorage.setItem('litlens_review_reports', JSON.stringify(reports));
  };

  const reportReview = async (reviewId: string, reason: string, description: string) => {
    if (!user) return;

    const newReport: ReviewReport = {
      id: Date.now().toString(),
      reviewId,
      reporterId: user.id,
      reporterName: user.name,
      reason,
      description,
      date: new Date().toISOString(),
      status: 'pending'
    };

    const updatedReports = [...reviewReports, newReport];
    setReviewReports(updatedReports);
    saveReports(updatedReports);
  };

  const getReviewReports = () => {
    return reviewReports;
  };

  const updateReportStatus = (reportId: string, status: ReviewReport['status']) => {
    const updatedReports = reviewReports.map(report =>
      report.id === reportId ? { ...report, status } : report
    );
    setReviewReports(updatedReports);
    saveReports(updatedReports);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      isLoading, 
      checkUsernameAvailability,
      reportReview,
      getReviewReports,
      updateReportStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}
