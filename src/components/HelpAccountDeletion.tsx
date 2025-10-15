import { ArrowLeft, AlertTriangle, Download, UserX, Shield, Clock, Archive, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpAccountDeletionProps {
  onBack: () => void;
}

export function HelpAccountDeletion({ onBack }: HelpAccountDeletionProps) {
  const deletionSteps = [
    {
      step: 1,
      title: "Consider Alternatives",
      description: "Review other options before permanent deletion",
      actions: [
        "Temporarily deactivate your account",
        "Make your profile private instead",
        "Delete specific data (reviews, lists) while keeping account",
        "Take a break with account suspension"
      ]
    },
    {
      step: 2,
      title: "Export Your Data",
      description: "Download a copy of your information",
      actions: [
        "Go to Profile &gt; Settings &gt; Privacy Controls",
        "Click 'Export My Data'",
        "Choose what data to include (reading lists, reviews, etc.)",
        "Confirm your request",
        "Download the file when ready (usually within 24 hours)"
      ]
    },
    {
      step: 3,
      title: "Initiate Deletion",
      description: "Start the account deletion process",
      actions: [
        "Navigate to Profile &gt; Settings &gt; Account Actions",
        "Scroll to 'Delete Account' section",
        "Click 'Request Account Deletion'",
        "Confirm your decision and enter your password",
        "Check your email for verification instructions"
      ]
    }
  ];

  const dataImpact = [
    {
      icon: UserX,
      title: "Profile Information",
      description: "Your username, bio, and profile picture will be permanently removed.",
      recoverable: false
    },
    {
      icon: Archive,
      title: "Reading Lists & Reviews",
      description: "All your reading lists, book reviews, and ratings will be deleted.",
      recoverable: false
    },
    {
      icon: Shield,
      title: "Community Content",
      description: "Your discussions, comments, and community interactions will be removed.",
      recoverable: false
    },
    {
      icon: Clock,
      title: "Reading History",
      description: "Your complete reading history and progress tracking will be erased.",
      recoverable: false
    }
  ];

  const alternatives = [
    {
      title: "Private Account",
      description: "Hide your profile from other users while keeping your data",
      icon: Shield,
      recommended: true
    },
    {
      title: "Temporary Deactivation",
      description: "Suspend your account for 30-90 days with option to reactivate",
      icon: Clock,
      recommended: true
    },
    {
      title: "Selective Data Deletion",
      description: "Delete specific content (reviews, lists) while keeping your account",
      icon: Trash2,
      recommended: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="gap-2 focus-visible-ring"
          aria-label="Return to Help Center main page"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Help Center
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Badge variant="secondary" className="mb-4">Account & Settings</Badge>
          <h1 className="text-3xl font-bold mb-4">Deleting Your Account</h1>
          <p className="text-muted-foreground text-lg">
            Account deletion is permanent and cannot be undone. Please review all options and consider alternatives before proceeding with this irreversible action.
          </p>
        </div>

        {/* Warning */}
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              Important Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-red-800 dark:text-red-200">
                Account deletion is <strong>permanent and irreversible</strong>. Once confirmed, you will lose:
              </p>
              <ul className="text-red-800 dark:text-red-200 space-y-1 text-sm pl-4">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                  All reading lists, reviews, and ratings
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                  Your complete reading history and progress
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                  All community discussions and comments
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 flex-shrink-0" />
                  Connections with other readers
                </li>
              </ul>
              <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                We cannot recover this data once deletion is complete.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alternatives */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Consider These Alternatives</h2>
          <div className="grid gap-4">
            {alternatives.map((alternative, index) => (
              <Card key={index} className={alternative.recommended ? "ring-2 ring-primary/20" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <alternative.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{alternative.title}</h4>
                        {alternative.recommended && (
                          <Badge variant="secondary" className="text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{alternative.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Export */}
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
              <Download className="h-5 w-5" aria-hidden="true" />
              Export Your Data First
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 dark:text-green-200 mb-4">
              Before deleting your account, we strongly recommend exporting your data:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-green-800 dark:text-green-200 mb-4">
              <li>Go to Profile &gt; Settings &gt; Privacy Controls</li>
              <li>Click 'Export My Data'</li>
              <li>Choose what data to include (reading lists, reviews, etc.)</li>
              <li>Confirm your request</li>
              <li>Download the file when it's ready (usually within 24 hours)</li>
            </ol>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded">
              <p className="text-xs text-green-700 dark:text-green-300">
                💡 Your export will include reading lists, reviews, ratings, and profile information in standard formats (JSON, CSV) that you can import into other platforms.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Deletion Process */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Account Deletion Process</h2>
          <div className="space-y-4">
            {deletionSteps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{step.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {step.actions.map((action, actionIndex) => (
                      <li key={actionIndex} dangerouslySetInnerHTML={{ __html: action }} />
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What Gets Deleted */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">What Gets Deleted</h2>
          <div className="grid gap-4">
            {dataImpact.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex-shrink-0">
                      <item.icon className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <Badge variant="destructive" className="text-xs">
                        Not Recoverable
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Access Instructions */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">How to Access Deletion Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Desktop Process:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 pl-4">
                <li>Go to Profile &gt; Settings &gt; Account Actions</li>
                <li>Scroll to 'Delete Account' section</li>
                <li>Click 'Request Account Deletion'</li>
                <li>Confirm your decision and enter your password</li>
                <li>Check your email for verification instructions</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Mobile Process:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 pl-4">
                <li>Tap menu (☰) &gt; Profile &gt; Settings</li>
                <li>Navigate to 'Account Actions'</li>
                <li>Tap 'Delete Account'</li>
                <li>Follow the confirmation prompts</li>
                <li>Verify deletion via email</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Grace Period */}
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="text-amber-900 dark:text-amber-100 flex items-center gap-2">
              <Clock className="h-5 w-5" aria-hidden="true" />
              30-Day Grace Period
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800 dark:text-amber-200 mb-3">
              After requesting deletion, you have 30 days to change your mind:
            </p>
            <ul className="text-amber-800 dark:text-amber-200 space-y-1 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                Your account is deactivated but data remains intact
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                You can log in to cancel the deletion at any time
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                After 30 days, deletion becomes permanent and irreversible
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0" />
                You'll receive email reminders at 7 days and 1 day before final deletion
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Can't access deletion settings</h4>
              <p className="text-sm text-muted-foreground mt-1">
                If you're unable to access your account settings, contact our support team with your username and email address.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Want to discuss alternatives</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Our support team can help you explore alternatives to deletion that might address your concerns while keeping your data.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Technical issues during deletion</h4>
              <p className="text-sm text-muted-foreground mt-1">
                If you encounter errors during the deletion process, contact support immediately to ensure your request is processed correctly.
              </p>
            </div>
            <div className="pt-2">
              <Button variant="outline" className="gap-2 focus-visible-ring">
                Contact Support Team
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Final Warning */}
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Final Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-destructive">
              Account deletion is permanent. Once the 30-day grace period expires, your data cannot be recovered by you or our support team.
            </p>
            <p className="text-sm text-muted-foreground">
              If you're sure about deleting your account, please follow the steps above. Consider exporting your data first and exploring alternatives that might meet your needs.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}