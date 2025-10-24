import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertCircle, Copy, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../utils/supabase/client';
import { copyToClipboard } from "../utils/supabase/clipboard";

const MIGRATION_SQL = `-- Add reading date tracking to user_book_status table
ALTER TABLE user_book_status
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS finish_date DATE;

-- Add index for date queries
CREATE INDEX IF NOT EXISTS idx_user_book_status_dates 
ON user_book_status(start_date, finish_date);

-- Add comments
COMMENT ON COLUMN user_book_status.start_date IS 'Date when user started reading the book';
COMMENT ON COLUMN user_book_status.finish_date IS 'Date when user finished reading the book';`;

export function MigrationAlert() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [needsMigration, setNeedsMigration] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkIfMigrationNeeded();
  }, []);

  const checkIfMigrationNeeded = async () => {
    try {
      // Try to select the start_date column - if it fails, migration is needed
      const { error } = await supabase
        .from('user_book_status')
        .select('start_date')
        .limit(1);

      if (error) {
        setNeedsMigration(true);
      } else {
        setNeedsMigration(false);
      }
    } catch (error) {
      setNeedsMigration(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCopyToClipboard = async () => {
    const success = await copyToClipboardUtil(MIGRATION_SQL);
    if (success) {
      setCopied(true);
      toast.success('SQL copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard/project/_/sql', '_blank');
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Store in localStorage so it doesn't show again this session
    localStorage.setItem('migration-alert-dismissed', 'true');
  };

  // Don't show if checking, dismissed, or migration not needed
  if (isChecking || isDismissed || !needsMigration) {
    return null;
  }

  // Check if user dismissed it this session
  if (typeof window !== 'undefined' && localStorage.getItem('migration-alert-dismissed') === 'true') {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl animate-in slide-in-from-top duration-300">
      <Card className="border-2 border-orange-500 bg-orange-50 dark:bg-orange-950 shadow-2xl">
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <AlertTitle className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-1">
                  🚨 Database Migration Required
                </AlertTitle>
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  Your database needs a quick update to enable book logging with dates. This will only take 1 minute!
                </AlertDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="flex-shrink-0 text-orange-700 hover:text-orange-900 hover:bg-orange-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Quick Steps */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border-2 border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-600 text-white text-sm">1</span>
              Copy the SQL
            </h4>
            <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto mb-3 max-h-32">
              {MIGRATION_SQL}
            </pre>
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              size="sm"
              className="w-full border-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy SQL
                </>
              )}
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border-2 border-orange-200 dark:border-orange-800">
            <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-600 text-white text-sm">2</span>
              Run in Supabase
            </h4>
            <ol className="text-sm space-y-2 text-orange-800 dark:text-orange-200 list-decimal list-inside mb-3">
              <li>Click "Open Supabase" below</li>
              <li>Click "New Query" in SQL Editor</li>
              <li>Paste the copied SQL and click "Run"</li>
              <li>Refresh this page</li>
            </ol>
            <Button
              onClick={openSupabaseDashboard}
              variant="default"
              size="sm"
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Supabase SQL Editor
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-orange-700 dark:text-orange-300 text-center">
            ✅ Safe to run • Uses IF NOT EXISTS • Won't affect existing data
          </p>
        </div>
      </Card>
    </div>
  );
}
