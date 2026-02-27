import { useState } from 'react';
import { useAuth } from '../lib/auth-supabase';
import { supabase } from '../utils/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
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
  const [showLoginHelp, setShowLoginHelp] = useState(false);
  const [loginError, setLoginError] = useState<string>('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState('');
  const [errorDialogTitle, setErrorDialogTitle] = useState('Login Failed');
  const { login, signup, isLoading: isAuthLoading, checkUsernameAvailability } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use isSubmitting for the button state primarily during the action
  // If isAuthLoading is true but we are not submitting, it means global auth check is happening
  const isLoading = isSubmitting || isAuthLoading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setLoginError(''); // Clear previous errors
    setShowLoginHelp(false); // Clear help message
    
    console.log('=== LOGIN ATTEMPT STARTED ===');
    console.log('[Login UI] Form submitted');
    console.log('[Login UI] Email:', loginEmail);
    console.log('[Login UI] Password length:', loginPassword.length);
    
    if (!loginEmail || !loginPassword) {
      console.log('[Login UI] Empty fields, showing error dialog');
      const errorMsg = 'Please fill in all fields';
      setLoginError(errorMsg); // Set inline error
      setErrorDialogTitle('Login Failed');
      setErrorDialogMessage(errorMsg);
      setShowErrorDialog(true);
      toast.error(errorMsg);
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(loginEmail, loginPassword);
      console.log('[Login UI] Login returned:', success);
      console.log('[Login UI] Type:', typeof success);
      
      if (success === false || !success) {
        // Login failed
        console.log('[Login UI] Handling failed login...');
        
        const errorMsg = 'Invalid email or password';
        
        console.log('[Login UI] Setting error message:', errorMsg);
        setLoginError(errorMsg); // Set inline error
        setLoginPassword(''); // Clear password field
        setErrorDialogTitle('Login Failed');
        setErrorDialogMessage(errorMsg);
        console.log('[Login UI] About to show error dialog...');
        setShowErrorDialog(true);
        console.log('[Login UI] showErrorDialog state set to true');
        toast.error(errorMsg);
        console.log('[Login UI] Toast shown, returning');
        return;
      }
      
      if (success === true) {
        // Success - clear any errors
        setLoginError('');
        setShowLoginHelp(false);
        toast.success('Successfully logged in!');
        return;
      }
      
      // Unexpected return value
      const errorMsg = 'Invalid email or password';
      setLoginError(errorMsg);
      setLoginPassword(''); // Clear password field
      setErrorDialogTitle('Login Failed');
      setErrorDialogMessage(errorMsg);
      setShowErrorDialog(true);
      toast.error(errorMsg);
    } catch (error: any) {
      // Handle specific thrown errors (connection issues, etc)
      const errorMessage = error?.message || '';
      
      if (errorMessage === 'CONNECTION_ERROR') {
        const errorMsg = 'Unable to connect to the server. Please check your internet connection and try again.';
        setLoginError(errorMsg);
        setLoginPassword(''); // Clear password field
        setErrorDialogTitle('Connection Error');
        setErrorDialogMessage(errorMsg);
        setShowErrorDialog(true);
        toast.error(errorMsg);
      } else if (errorMessage === 'EMAIL_NOT_CONFIRMED') {
        const errorMsg = 'Please confirm your email address before logging in.';
        setLoginError(errorMsg);
        setLoginPassword(''); // Clear password field
        setErrorDialogTitle('Email Not Confirmed');
        setErrorDialogMessage(errorMsg);
        setShowErrorDialog(true);
        toast.error(errorMsg);
      } else {
        // Unknown error - treat as incorrect credentials
        const errorMsg = 'Invalid email or password';
        setLoginError(errorMsg);
        setLoginPassword(''); // Clear password field
        setErrorDialogTitle('Login Failed');
        setErrorDialogMessage(errorMsg);
        setShowErrorDialog(true);
        toast.error(errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!signupEmail || !signupPassword || !signupName || !signupUsername) {
      const errorMsg = 'Please fill in all fields';
      setErrorDialogTitle('Signup Failed');
      setErrorDialogMessage(errorMsg);
      setShowErrorDialog(true);
      toast.error(errorMsg);
      return;
    }

    // Validate password length
    if (signupPassword.length < 6) {
      const errorMsg = 'Password must be at least 6 characters long';
      setErrorDialogTitle('Signup Failed');
      setErrorDialogMessage(errorMsg);
      setShowErrorDialog(true);
      toast.error(errorMsg);
      return;
    }

    if (usernameAvailable === false) {
      const errorMsg = 'This username is already taken. Please choose a different username.';
      setErrorDialogTitle('Username Taken');
      setErrorDialogMessage(errorMsg);
      setShowErrorDialog(true);
      toast.error('Username is already taken');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await signup(signupEmail, signupPassword, signupName, signupUsername);
      if (success) {
        setShowSetupAlert(false);
        toast.success('Account created successfully!');
        // Don't show success toast here - let the app redirect naturally
      }
    } catch (error: any) {
      // Display specific error messages from Supabase
      const errorMessage = error?.message || 'Signup failed';
      
      if (errorMessage.includes('Email signups are disabled')) {
        setShowSetupAlert(true);
        const errorMsg = 'Email signups are currently disabled. Please see the setup instructions below.';
        setErrorDialogTitle('Setup Required');
        setErrorDialogMessage(errorMsg);
        setShowErrorDialog(true);
        toast.error('Email signups are disabled');
      } else if (errorMessage.includes('already registered')) {
        const errorMsg = 'This email is already registered. Please use a different email or try logging in.';
        setErrorDialogTitle('Email Already Registered');
        setErrorDialogMessage(errorMsg);
        setShowErrorDialog(true);
        toast.error('Email already registered');
      } else if (errorMessage.includes('invalid email')) {
        const errorMsg = 'Please enter a valid email address.';
        setErrorDialogTitle('Invalid Email');
        setErrorDialogMessage(errorMsg);
        setShowErrorDialog(true);
        toast.error('Invalid email');
      } else if (errorMessage.includes('Password should be') || errorMessage.includes('password')) {
        const errorMsg = 'Password must be at least 6 characters long.';
        setErrorDialogTitle('Invalid Password');
        setErrorDialogMessage(errorMsg);
        setShowErrorDialog(true);
        toast.error('Password too short');
      } else if (errorMessage.includes('duplicate') || errorMessage.includes('unique') || errorMessage.includes('username')) {
        const errorMsg = 'This username is already taken. Please choose a different username.';
        setErrorDialogTitle('Username Taken');
        setErrorDialogMessage(errorMsg);
        setShowErrorDialog(true);
        toast.error('Username taken');
      } else {
        setErrorDialogTitle('Signup Failed');
        setErrorDialogMessage(errorMessage);
        setShowErrorDialog(true);
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
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
                  {loginError && (
                    <Alert variant="destructive" className="mb-4">
                      <XCircle className="h-4 w-4" />
                      <AlertTitle>Login Failed</AlertTitle>
                      <AlertDescription>
                        {loginError}
                      </AlertDescription>
                    </Alert>
                  )}
                  {showLoginHelp && (
                    <Alert className="mb-4 bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
                      <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <AlertTitle className="text-yellow-800 dark:text-yellow-200">No Account Found</AlertTitle>
                      <AlertDescription className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                        <p className="font-semibold">You need to create test users first!</p>
                        <div className="bg-white dark:bg-gray-900 p-2 rounded border border-yellow-300 dark:border-yellow-700">
                          <p className="text-xs font-semibold mb-1">Quick Fix:</p>
                          <ol className="list-decimal list-inside space-y-0.5 text-xs">
                            <li>Open file: <code className="bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">RUN_THIS_TO_FIX_LOGIN.sql</code></li>
                            <li>Go to <a href="https://supabase.com/dashboard/project/nrdetgsryanpfxkazcap/sql/new" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Supabase SQL Editor</a></li>
                            <li>Copy & paste the SQL, click "Run"</li>
                            <li>Login with: <code className="bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">test@example.com</code> / <code className="bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">password123</code></li>
                          </ol>
                        </div>
                        <p className="text-xs italic mt-1">Or switch to Sign Up tab to create your own account.</p>
                      </AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => {
                          setLoginEmail(e.target.value);
                          // Clear error when user starts typing
                          if (loginError) setLoginError('');
                        }}
                        placeholder="user@example.com"
                        disabled={isLoading}
                        className={`h-11 ${loginError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          // Clear error when user starts typing
                          if (loginError) setLoginError('');
                        }}
                        placeholder="password"
                        disabled={isLoading}
                        className={`h-11 ${loginError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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
                        placeholder="Create a password (min 6 characters)"
                        disabled={isLoading}
                        className={`h-10 ${
                          signupPassword.length > 0 && signupPassword.length < 6
                            ? 'border-destructive focus:ring-destructive'
                            : signupPassword.length >= 6
                            ? 'border-green-500 focus:ring-green-500'
                            : ''
                        }`}
                      />
                      <div className="h-4">
                        {signupPassword.length > 0 && signupPassword.length < 6 && (
                          <p className="text-xs text-destructive leading-tight">Password must be at least 6 characters</p>
                        )}
                        {signupPassword.length >= 6 && (
                          <p className="text-xs text-green-500 leading-tight">Password meets requirements</p>
                        )}
                      </div>
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

      {/* Error Popup Dialog */}
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive text-xl">
              <XCircle className="h-6 w-6" />
              {errorDialogTitle}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-2 text-foreground">
              {errorDialogMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowErrorDialog(false)}
              className="bg-primary hover:bg-primary/90"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}