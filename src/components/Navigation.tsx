import { BookOpen, Search, User, Settings, Heart, BookMarked, Star, Users, Menu, X, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { useAuth } from '../lib/auth-supabase';

export type PageType = 'home' | 'search' | 'profile' | 'admin' | 'browse' | 'recommendations' | 'reading-lists' | 'community' | 'help' | 'privacy' | 'terms' | 'contact' | 'help-getting-started-account' | 'help-getting-started-profile' | 'help-getting-started-library' | 'help-getting-started-recommendations' | 'help-reading-lists-creating' | 'help-reading-lists-organizing' | 'help-reading-lists-sharing' | 'help-reading-lists-tags' | 'help-community-discussions' | 'help-community-reviews' | 'help-community-following' | 'help-account-managing-profile' | 'help-account-privacy-settings' | 'help-account-notifications' | 'help-account-deletion' | 'help-privacy-data-policy' | 'help-privacy-account-security' | 'help-privacy-data-sharing' | 'help-privacy-reporting';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  user: { id: string; name: string; username: string; email: string; role: 'user' | 'admin'; avatar?: string; preferences?: any } | null;
}

export function Navigation({ currentPage, onPageChange, user }: NavigationProps) {
  const { logout, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Define handleNavigation early so it can be used by both admin and user sections
  const handleNavigation = (page: PageType) => {
    onPageChange(page);
    setIsOpen(false);
  };

  // Handle logout with loading state
  const handleLogout = async () => {
    setIsLoggingOut(true);
    setIsOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Don't reset isLoggingOut here - let the component unmount
    }
  };

  // For admin users, only show admin panel
  if (user?.role === 'admin') {
    const adminNavItems = [
      { id: 'admin' as PageType, label: 'Admin Panel', icon: Settings },
    ];

    // Combined for mobile menu (admin only)
    const allNavItems = [...adminNavItems];

    return (
      <nav className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-semibold">LitLens Admin</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={currentPage === 'admin' ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation('admin')}
                className="flex items-center gap-2 focus-visible-ring"
                aria-label="Access admin panel"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                <span>Admin Panel</span>
              </Button>
              
              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible-ring"
                aria-label="Sign out of your admin account"
              >
                {isLoggingOut ? (
                  <>
                    <div className="w-4 h-4 border-2 border-destructive border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    <span>Logout</span>
                  </>
                )}
              </Button>
              
              {/* Welcome Message with Avatar */}
              <div className="flex items-center gap-3 ml-4">
                <span className="text-sm text-muted-foreground hidden md:block whitespace-nowrap">
                  Hello, {user?.name}
                </span>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Mobile Menu for Admin */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 p-0">
                  <SheetHeader className="px-6 py-6 border-b">
                    <SheetTitle className="text-left">Admin Menu</SheetTitle>
                    <SheetDescription className="text-left">
                      Administrator panel and account settings
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="flex flex-col h-full">
                    {/* Admin User Section */}
                    <div className="px-6 py-5 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                          <AvatarImage 
                            src={user?.avatar} 
                            alt={user?.name} 
                          />
                          <AvatarFallback className="text-lg">
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base truncate">{user?.name}</p>
                          <p className="text-sm text-muted-foreground truncate">@{user?.username}</p>
                          <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            <span className="text-xs font-medium">Administrator</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 py-6 overflow-y-auto">
                      <div className="px-4 space-y-1">
                        {/* Administration Section */}
                        <div className="px-3 py-2">
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Administration
                          </h3>
                        </div>
                        
                        <Button
                          variant={currentPage === 'admin' ? "default" : "ghost"}
                          onClick={() => handleNavigation('admin')}
                          className="w-full justify-start gap-3 h-11 px-3 font-medium focus-visible-ring"
                          aria-label="Access admin panel"
                        >
                          <Settings className="w-5 h-5" aria-hidden="true" />
                          <span>Admin Panel</span>
                        </Button>
                        
                        {/* Account Section */}
                        <div className="px-3 py-2 pt-6">
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Account
                          </h3>
                        </div>
                        
                        {/* Logout Button */}
                        <Button
                          variant="ghost"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full justify-start gap-3 h-11 px-3 font-medium text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible-ring"
                          aria-label="Sign out of your admin account"
                        >
                          {isLoggingOut ? (
                            <>
                              <div className="w-5 h-5 border-2 border-destructive border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                              <span>Logging out...</span>
                            </>
                          ) : (
                            <>
                              <LogOut className="w-5 h-5" aria-hidden="true" />
                              <span>Logout</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Main navigation items for regular users (left side)
  const mainNavItems = [
    { id: 'home' as PageType, label: 'Home', icon: BookOpen },
    { id: 'browse' as PageType, label: 'Browse', icon: BookMarked },
    { id: 'community' as PageType, label: 'Community', icon: Users },
    { id: 'recommendations' as PageType, label: 'Recommendations', icon: Star },
  ];

  // User/admin related items (right side)
  const userNavItems = [];

  // Combined for mobile menu
  const allNavItems = [...mainNavItems, ...userNavItems];

  return (
    <nav className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleNavigation('home')}>
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-semibold">LitLens</h1>
          </div>

          {/* Desktop Navigation - Left Side (Main Nav) */}
          <div className="hidden md:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item.id)}
                className="flex items-center gap-2 focus-visible-ring"
                aria-label={`Navigate to ${item.label.toLowerCase()} page`}
              >
                <item.icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden lg:inline">{item.label}</span>
              </Button>
            ))}
          </div>

          {/* Desktop Navigation - Right Side (User Nav & Actions) */}
          <div className="hidden md:flex items-center gap-2">
            {/* User Navigation */}
            {userNavItems.length > 0 && (
              <div className="flex items-center gap-1">
                {userNavItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={currentPage === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleNavigation(item.id)}
                    className="flex items-center gap-2 focus-visible-ring"
                    aria-label={`Access ${item.label.toLowerCase()} panel`}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                ))}
              </div>
            )}
            
            {/* Profile Button (Only for non-admin users) */}
            {user?.role !== 'admin' && (
              <Button
                variant={currentPage === 'profile' ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation('profile')}
                className="flex items-center gap-2 focus-visible-ring"
                aria-label="Access your profile and account settings"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                <span className="hidden lg:inline">Profile</span>
              </Button>
            )}
            
            {/* Logout Button (Only for admin users) */}
            {user?.role === 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible-ring"
                aria-label="Sign out of your admin account"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span className="hidden lg:inline">Logout</span>
              </Button>
            )}
            
            {/* Welcome Message with Avatar */}
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm text-muted-foreground hidden md:block whitespace-nowrap">
                Hello, {user?.name}
              </span>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SheetHeader className="px-6 py-6 border-b">
                  <SheetTitle className="text-left">Navigation Menu</SheetTitle>
                  <SheetDescription className="text-left">
                    Access all LitLens features and your account settings
                  </SheetDescription>
                </SheetHeader>
                
                <div className="flex flex-col h-full">
                  {/* User Welcome Section - Clickable Profile (Only for non-admin users) */}
                  {user?.role !== 'admin' ? (
                    <button
                      onClick={() => handleNavigation('profile')}
                      className="w-full px-6 py-5 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all duration-200 text-left focus-visible-ring border-b"
                      aria-label="View your profile and account settings"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                          <AvatarImage 
                            src={user?.avatar} 
                            alt={user?.name} 
                          />
                          <AvatarFallback className="text-lg">
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base truncate">{user?.name}</p>
                          <p className="text-sm text-muted-foreground truncate">@{user?.username}</p>
                          <p className="text-xs text-primary font-medium mt-1">View Profile →</p>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="px-6 py-5 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 ring-2 ring-primary/20">
                          <AvatarImage 
                            src={user?.avatar} 
                            alt={user?.name} 
                          />
                          <AvatarFallback className="text-lg">
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-base truncate">{user?.name}</p>
                          <p className="text-sm text-muted-foreground truncate">@{user?.username}</p>
                          <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            <span className="text-xs font-medium">Administrator</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <div className="flex-1 py-6 overflow-y-auto">
                    <div className="px-4 space-y-1">
                      {/* Main Navigation Section */}
                      <div className="px-3 py-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Navigation
                        </h3>
                      </div>
                      
                      {mainNavItems.map((item) => (
                        <Button
                          key={item.id}
                          variant={currentPage === item.id ? "default" : "ghost"}
                          onClick={() => handleNavigation(item.id)}
                          className="w-full justify-start gap-3 h-11 px-3 font-medium focus-visible-ring"
                          aria-label={`Navigate to ${item.label.toLowerCase()} page`}
                        >
                          <item.icon className="w-5 h-5" aria-hidden="true" />
                          <span>{item.label}</span>
                        </Button>
                      ))}
                      
                      {/* Account Section */}
                      <div className="px-3 py-2 pt-6">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Account
                        </h3>
                      </div>
                      
                      {/* Profile Button (Only for non-admin users) */}
                      {user?.role !== 'admin' && (
                        <Button
                          variant={currentPage === 'profile' ? "default" : "ghost"}
                          onClick={() => handleNavigation('profile')}
                          className="w-full justify-start gap-3 h-11 px-3 font-medium focus-visible-ring"
                          aria-label="View your profile and account settings"
                        >
                          <User className="w-5 h-5" aria-hidden="true" />
                          <span>My Profile</span>
                        </Button>
                      )}
                      
                      {/* Logout Button */}
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full justify-start gap-3 h-11 px-3 font-medium text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible-ring"
                        aria-label="Sign out of your account"
                      >
                        {isLoggingOut ? (
                          <>
                            <div className="w-5 h-5 border-2 border-destructive border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                            <span>Logging out...</span>
                          </>
                        ) : (
                          <>
                            <LogOut className="w-5 h-5" aria-hidden="true" />
                            <span>Logout</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}