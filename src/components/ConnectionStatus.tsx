import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase/client';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Button } from './ui/button';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Try to query a simple system table to test connection
      const { error } = await supabase
        .from('profiles')
        .select('count')
        .limit(0);
      
      if (error && (error.message?.includes('fetch') || error.message?.includes('network'))) {
        setIsConnected(false);
      } else {
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial connection check
    checkConnection();

    // Set up periodic connection checks (every 30 seconds)
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  // Don't show anything while checking for the first time
  if (isConnected === null) {
    return null;
  }

  // Don't show anything if connected
  if (isConnected) {
    return null;
  }

  // Show warning if not connected
  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <Alert variant="destructive" className="shadow-lg border-2">
        <WifiOff className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription className="mt-2 space-y-2">
          <p>
            Unable to connect to the database. Please check:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Your internet connection is active</li>
            <li>Your Supabase project is running and accessible</li>
            <li>The project credentials in <code className="bg-background/20 px-1 rounded">utils/supabase/info.tsx</code> are correct</li>
          </ul>
          <div className="mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={checkConnection}
              disabled={isChecking}
              className="bg-background hover:bg-background/90"
            >
              {isChecking ? (
                <>
                  <Wifi className="mr-2 h-4 w-4 animate-pulse" />
                  Checking...
                </>
              ) : (
                <>
                  <Wifi className="mr-2 h-4 w-4" />
                  Retry Connection
                </>
              )}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
