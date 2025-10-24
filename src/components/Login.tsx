import { useState } from 'react';
import { useAuth } from '../lib/auth-supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { BookOpen, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [showSetupAlert, setShowSetupAlert] = useState(false);
  const { login, signup, isLoading, checkUsernameAvailability } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const success = await login(loginEmail, loginPassword);
      if (!success) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      // Handle connection errors
      toast.error(error.message || 'Unable to connect. Please check your internet connection.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword || !signupName || !signupUsername) {
      toast.error('Please fill in all fields');
      return;
    }

    if (usernameAvailable === false) {
      toast.error('Username is already taken');
      return;
    }

    try {
      await signup(signupEmail, signupPassword, signupName, signupUsername);
      toast.success('Account created successfully!');
      setShowSetupAlert(false);
    } catch (error: any) {
      // Display specific error messages from Supabase
      const errorMessage = error?.message || 'Signup failed';
      
      if (errorMessage.includes('Email signups are disabled')) {
        setShowSetupAlert(true);
        toast.error('Email signups are currently disabled. Please see the setup instructions below.');
      } else if (errorMessage.includes('already registered')) {
        toast.error('This email is already registered');
      } else if (errorMessage.includes('invalid email')) {
        toast.error('Please enter a valid email address');
      } else if (errorMessage.includes('Password should be')) {
        toast.error('Password must be at least 6 characters');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleUsernameChange = async (username: string) => {
    setSignupUsername(username);
    if (username.length >= 3) {
      const available = await checkUsernameAvailability(username);
      setUsernameAvailable(available);
    } else {
      setUsernameAvailable(null);
    }
  };



  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 md:px-20 py-8 md:py-16">
      <div className="w-full max-w-7xl flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-20 items-center">
        {/* Left Column - Branding */}
        <div className="flex flex-col justify-center space-y-6 md:space-y-8 w-full text-center md:text-left">
          {/* Logo & Branding */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <BookOpen className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              <h1 className="text-3xl md:text-4xl">LitLens</h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto md:mx-0">
              Personalized Book Discovery Platform
            </p>
          </div>
        </div>

        {/* Right Column - Auth Forms */}
        <div className="flex flex-col justify-center w-full">
          <Tabs defaultValue="login" className="w-full max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-2 h-11 md:h-12">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-4 md:mt-6">
              <Card>
                <CardHeader className="pb-3 md:pb-4">
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="user@example.com"
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="password"
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>
                    <Button type="submit" className="w-full h-10 md:h-11 mt-4 md:mt-6" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-4 md:mt-6">
              <Card>
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Sign up to start discovering your next favorite book
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {showSetupAlert && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Setup Required</AlertTitle>
                      <AlertDescription className="text-sm space-y-2">
                        <p>Email signups are disabled in Supabase. To enable signups:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Go to Authentication → Providers in Supabase Dashboard</li>
                          <li>Enable the Email provider</li>
                          <li>Toggle OFF "Confirm email" for easier testing</li>
                          <li>Save changes</li>
                        </ol>
                        <p className="text-xs mt-2">
                          Dashboard: <a 
                            href="https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/auth/providers" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:text-destructive-foreground"
                          >
                            Open Settings
                          </a>
                        </p>
                      </AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSignup} className="space-y-2.5 md:space-y-3">
                    <div className="space-y-1 md:space-y-1.5">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="John Doe"
                        disabled={isLoading}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1 md:space-y-1.5">
                      <Label htmlFor="signup-username">Username</Label>
                      <div className="relative">
                        <Input
                          id="signup-username"
                          type="text"
                          value={signupUsername}
                          onChange={(e) => handleUsernameChange(e.target.value)}
                          placeholder="johndoe"
                          disabled={isLoading}
                          className={`h-10 ${
                            usernameAvailable === false 
                              ? 'border-destructive focus:ring-destructive' 
                              : usernameAvailable === true 
                              ? 'border-green-500 focus:ring-green-500' 
                              : ''
                          }`}
                        />
                        {signupUsername.length >= 3 && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {usernameAvailable === true && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                            {usernameAvailable === false && (
                              <XCircle className="w-4 h-4 text-destructive" />
                            )}
                          </div>
                        )}
                      </div>
                      <div className="h-4">
                        {signupUsername.length >= 3 && usernameAvailable === false && (
                          <p className="text-xs text-destructive leading-tight">Username is already taken</p>
                        )}
                        {signupUsername.length >= 3 && usernameAvailable === true && (
                          <p className="text-xs text-green-500 leading-tight">Username is available</p>
                        )}
                        {signupUsername.length > 0 && signupUsername.length < 3 && (
                          <p className="text-xs text-muted-foreground leading-tight">Username must be at least 3 characters</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1 md:space-y-1.5">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="john@example.com"
                        disabled={isLoading}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-1 md:space-y-1.5">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create a password"
                        disabled={isLoading}
                        className="h-10"
                      />
                    </div>
                    <Button type="submit" className="w-full h-10 mt-3 md:mt-4" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign Up
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}