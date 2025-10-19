import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2, AlertCircle, Copy, ExternalLink, Database } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

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

export function MigrationRunner() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(MIGRATION_SQL);
      setCopied(true);
      toast.success('SQL copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard/project/_/sql', '_blank');
  };

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <Database className="w-5 h-5" />
          Required Migration - Reading Dates
        </CardTitle>
        <CardDescription className="text-orange-700">
          Run this migration to enable start/finish date tracking for books
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-orange-300 bg-orange-100">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-900">
            <strong>Action Required:</strong> The user_book_status table is missing date columns. Follow the steps below to fix this.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="bg-white rounded-lg border border-orange-200 p-4 space-y-3">
            <h4 className="font-medium text-orange-900">Step 1: Copy the SQL</h4>
            <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto">
              {MIGRATION_SQL}
            </pre>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              size="sm"
              className="w-full border-orange-300 hover:bg-orange-100"
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

          <div className="bg-white rounded-lg border border-orange-200 p-4 space-y-3">
            <h4 className="font-medium text-orange-900">Step 2: Run in Supabase</h4>
            <ol className="text-sm space-y-2 text-orange-800 list-decimal list-inside">
              <li>Click the button below to open Supabase SQL Editor</li>
              <li>Click "New Query" in the SQL Editor</li>
              <li>Paste the copied SQL</li>
              <li>Click "Run" to execute the migration</li>
              <li>Refresh this page when done</li>
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
        </div>

        <Alert className="border-green-300 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900">
            <strong>Safe to run:</strong> This migration uses "IF NOT EXISTS" so it's safe to run multiple times without errors.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
