import { ArrowLeft, Bell, Mail, Smartphone, Clock, Settings, BookOpen, Users, MessageSquare, Star, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpAccountNotificationsProps {
  onBack: () => void;
}

export function HelpAccountNotifications({ onBack }: HelpAccountNotificationsProps) {
  const emailNotificationTypes = [
    {
      icon: Settings,
      title: "Account Security",
      description: "Important security alerts and account changes",
      details: [
        "Login attempts from new devices",
        "Password changes",
        "Email address updates",
        "Account recovery requests"
      ]
    },
    {
      icon: BookOpen,
      title: "Reading Goal Progress",
      description: "Updates on your reading goals and achievements",
      details: [
        "Weekly progress reports",
        "Goal milestone celebrations",
        "Monthly reading summaries",
        "Year-end reading statistics"
      ]
    },
    {
      icon: Star,
      title: "New Book Recommendations",
      description: "Personalized book suggestions based on your reading history",
      details: [
        "Weekly curated recommendations",
        "New releases in your favorite genres",
        "Books similar to your recent reads",
        "Staff picks and editor's choices"
      ]
    },
    {
      icon: Clock,
      title: "Monthly Reading Summary",
      description: "A comprehensive overview of your reading activity",
      details: [
        "Books read this month",
        "Reading goals progress",
        "Time spent reading",
        "Favorite genres and authors"
      ]
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
          <h1 className="text-3xl font-bold mb-4">Email Notifications</h1>
          <p className="text-muted-foreground text-lg">
            LitLens uses email notifications to keep you informed about important account updates and your reading journey. Learn about what emails you'll receive and how to manage your preferences.
          </p>
        </div>

        {/* Current Email Notifications */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">What Email Notifications You'll Receive</h2>
          <div className="grid gap-6">
            {emailNotificationTypes.map((type, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <type.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{type.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{type.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Includes:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {type.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Email Settings */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Mail className="h-5 w-5" aria-hidden="true" />
              Email Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-blue-800 dark:text-blue-200">
              You have simple control over your email notifications. You can either receive all emails or turn them off completely.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Enabled:</strong> Receive all email notifications listed above
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Disabled:</strong> Only receive critical security alerts
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Access Settings */}
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">How to Manage Email Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-green-900 dark:text-green-100">To Change Your Email Preferences:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-green-800 dark:text-green-200 pl-4">
                <li>Go to your Profile page</li>
                <li>Click on the 'Settings' tab</li>
                <li>Find the 'Email Notifications' section</li>
                <li>Toggle the switch to enable or disable all email notifications</li>
                <li>Your preferences are saved automatically</li>
              </ol>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mt-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Note:</strong> Even if you disable email notifications, you'll still receive critical security alerts to protect your account.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Email Best Practices */}
        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
              <Mail className="h-5 w-5" aria-hidden="true" />
              Email Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-yellow-900 dark:text-yellow-100">To Ensure You Receive Our Emails:</h4>
              <ul className="text-sm text-yellow-800 dark:text-yellow-200 mt-2 space-y-1">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                  Add notifications@litlens.com to your contacts
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                  Check your spam/junk folder periodically
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                  Ensure your email address is correct in your profile
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                  Create a filter to organize LitLens emails
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" aria-hidden="true" />
              Troubleshooting Email Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">I'm not receiving any emails from LitLens</h4>
              <p className="text-sm text-muted-foreground mt-1">
                First, check your spam/junk folder. If emails are there, mark them as "not spam" and add notifications@litlens.com to your safe senders list. Also verify that email notifications are enabled in your profile settings.
              </p>
            </div>
            <div>
              <h4 className="font-medium">I want to receive fewer emails</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Simply turn off email notifications in your profile settings. You'll still receive critical security alerts, but no reading-related emails.
              </p>
            </div>
            <div>
              <h4 className="font-medium">My email address needs to be updated</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Contact our support team for help changing your email address. This requires verification for security purposes.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Emails are going to the wrong address</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Check your profile settings to ensure the correct email address is listed. If you need to change it, contact support for assistance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Related Help Topics */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Related Help Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Learn more about managing your LitLens account:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Settings className="h-4 w-4" aria-hidden="true" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Users className="h-4 w-4" aria-hidden="true" />
                Managing Your Profile
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Shield className="h-4 w-4" aria-hidden="true" />
                Account Security
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}