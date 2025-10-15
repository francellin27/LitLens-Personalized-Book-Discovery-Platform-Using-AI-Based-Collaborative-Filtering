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
  user: { id: string; name: string; username: string; email: string; role: 'user' | 'admin'; preferences?: any } | null;
}

export function Navigation({ currentPage, onPageChange, user }: NavigationProps) {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
                onClick={logout}
                className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 focus-visible-ring"
                aria-label="Sign out of your admin account"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>Logout</span>
              </Button>
              
              {/* Welcome Message */}
              <div className="flex items-center gap-3 ml-4">
                <span className="text-sm text-muted-foreground hidden xl:block whitespace-nowrap">
                  Welcome, {user?.name}
                </span>
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
                    <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage 
                            src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODU1MDMwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                            alt={user?.name} 
                          />
                          <AvatarFallback>
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-base">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">@{user?.username}</p>
                          <p className="text-xs text-primary font-medium">Administrator</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex-1 px-4 py-6">
                      <div className="space-y-3">
                        <Button
                          variant={currentPage === 'admin' ? "default" : "ghost"}
                          onClick={() => handleNavigation('admin')}
                          className="w-full justify-start gap-4 h-12 px-4 font-medium focus-visible-ring"
                          aria-label="Access admin panel"
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <Settings className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <span className="text-base">Admin Panel</span>
                        </Button>
                        
                        {/* Logout Button for Admin in Mobile Menu */}
                        <Button
                          variant="ghost"
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                          className="w-full justify-start gap-4 h-12 px-4 font-medium text-destructive hover:text-destructive hover:bg-destructive/10 mt-2 focus-visible-ring"
                          aria-label="Sign out of your admin account"
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <LogOut className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <span className="text-base">Logout</span>
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

  const handleNavigation = (page: PageType) => {
    onPageChange(page);
    setIsOpen(false);
  };

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
            
            {/* Welcome Message */}
            <div className="flex items-center gap-3 ml-4">
              <span className="text-sm text-muted-foreground hidden xl:block whitespace-nowrap">
                Welcome, {user?.name}
              </span>
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
                      className="w-full px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-colors text-left focus-visible-ring"
                      aria-label="View your profile and account settings"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage 
                            src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODU1MDMwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                            alt={user?.name} 
                          />
                          <AvatarFallback>
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-base">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">@{user?.username}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          View Profile
                        </div>
                      </div>
                    </button>
                  ) : (
                    <div className="px-6 py-4 bg-gradient-to-r from-primary/5 to-primary/10">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage 
                            src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODU1MDMwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
                            alt={user?.name} 
                          />
                          <AvatarFallback>
                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-base">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">@{user?.username}</p>
                          <p className="text-xs text-primary font-medium">Administrator</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <div className="flex-1 px-4 py-6">
                    <div className="space-y-3">
                      <div className="px-2">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Navigation
                        </h3>
                      </div>
                      {mainNavItems.map((item) => (
                        <Button
                          key={item.id}
                          variant={currentPage === item.id ? "default" : "ghost"}
                          onClick={() => handleNavigation(item.id)}
                          className="w-full justify-start gap-4 h-12 px-4 font-medium focus-visible-ring"
                          aria-label={`Navigate to ${item.label.toLowerCase()} page`}
                        >
                          <div className="w-5 h-5 flex items-center justify-center">
                            <item.icon className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <span className="text-base">{item.label}</span>
                        </Button>
                      ))}
                      
                      {userNavItems.length > 0 && (
                        <>
                          <div className="px-2 pt-4">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Administration
                            </h3>
                          </div>
                          {userNavItems.map((item) => (
                            <Button
                              key={item.id}
                              variant={currentPage === item.id ? "default" : "ghost"}
                              onClick={() => handleNavigation(item.id)}
                              className="w-full justify-start gap-4 h-12 px-4 font-medium focus-visible-ring"
                              aria-label={`Access ${item.label.toLowerCase()} panel`}
                            >
                              <div className="w-5 h-5 flex items-center justify-center">
                                <item.icon className="w-5 h-5" aria-hidden="true" />
                              </div>
                              <span className="text-base">{item.label}</span>
                            </Button>
                          ))}
                          
                          {/* Logout Button for Admin in Mobile Menu */}
                          {user?.role === 'admin' && (
                            <Button
                              variant="ghost"
                              onClick={() => {
                                logout();
                                setIsOpen(false);
                              }}
                              className="w-full justify-start gap-4 h-12 px-4 font-medium text-destructive hover:text-destructive hover:bg-destructive/10 mt-2 focus-visible-ring"
                              aria-label="Sign out of your admin account"
                            >
                              <div className="w-5 h-5 flex items-center justify-center">
                                <LogOut className="w-5 h-5" aria-hidden="true" />
                              </div>
                              <span className="text-base">Logout</span>
                            </Button>
                          )}
                        </>
                      )}
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