import { ArrowLeft, Shield, Eye, EyeOff, Lock, Globe, Users, Settings, Database, UserCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpAccountPrivacySettingsProps {
  onBack: () => void;
}

export function HelpAccountPrivacySettings({ onBack }: HelpAccountPrivacySettingsProps) {
  const privacySections = [
    {
      icon: Eye,
      title: "Profile Visibility",
      description: "Control who can view your profile and reading activity.",
      settings: [
        {
          name: "Public Profile",
          description: "Anyone can view your profile and reading lists",
          recommended: false
        },
        {
          name: "Friends Only",
          description: "Only users you follow and who follow you back",
          recommended: true
        },
        {
          name: "Private",
          description: "Only you can see your profile information",
          recommended: false
        }
      ]
    },
    {
      icon: Database,
      title: "Data Sharing",
      description: "Manage how your reading data is used for recommendations and community features.",
      settings: [
        {
          name: "Full Data Sharing",
          description: "Use all reading data for personalized recommendations",
          recommended: true
        },
        {
          name: "Limited Sharing",
          description: "Share only genres and ratings for recommendations",
          recommended: false
        },
        {
          name: "No Data Sharing",
          description: "Don't use reading data for recommendations",
          recommended: false
        }
      ]
    },
    {
      icon: UserCheck,
      title: "Community Interactions",
      description: "Set preferences for how other users can interact with you.",
      settings: [
        {
          name: "Anyone Can Follow",
          description: "Any user can follow you and see your public activity",
          recommended: true
        },
        {
          name: "Follow Requests",
          description: "Users must request to follow you",
          recommended: false
        },
        {
          name: "No Followers",
          description: "Disable the ability for others to follow you",
          recommended: false
        }
      ]
    }
  ];

  const quickSettings = [
    {
      icon: Shield,
      title: "Private Reading Lists",
      description: "Make all your reading lists private by default"
    },
    {
      icon: EyeOff,
      title: "Hide Reading Activity",
      description: "Don't show what you're currently reading"
    },
    {
      icon: Lock,
      title: "Limit Search Visibility",
      description: "Don't appear in user search results"
    },
    {
      icon: Users,
      title: "Friends Only Reviews",
      description: "Only friends can see your book reviews"
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
          <h1 className="text-3xl font-bold mb-4">Privacy Settings</h1>
          <p className="text-muted-foreground text-lg">
            Take control of your privacy on LitLens. Customize who can see your information, how your data is used, and how others can interact with you.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Privacy Controls</h2>
          <div className="grid gap-6">
            {privacySections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <section.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{section.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.settings.map((setting, settingIndex) => (
                      <div key={settingIndex} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{setting.name}</h4>
                              {setting.recommended && (
                                <Badge variant="secondary" className="text-xs">Recommended</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Privacy Settings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Quick Privacy Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickSettings.map((setting, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <setting.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{setting.title}</h4>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Access Privacy Settings */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">How to Access Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Desktop Navigation:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 pl-4">
                <li>Click 'Profile' in the top navigation</li>
                <li>Select the 'Settings' tab</li>
                <li>Scroll to 'Privacy & Security' section</li>
                <li>Adjust your preferences</li>
                <li>Click 'Save Changes' to apply</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Mobile Access:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 pl-4">
                <li>Tap the menu icon (☰)</li>
                <li>Tap 'Profile' then 'Settings'</li>
                <li>Navigate to 'Privacy' section</li>
                <li>Configure your settings</li>
                <li>Tap 'Save' to confirm</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Recommendations */}
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
              <Shield className="h-5 w-5" aria-hidden="true" />
              Privacy Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100">For New Users:</h4>
              <ul className="text-sm text-green-800 dark:text-green-200 mt-2 space-y-1">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  Start with 'Friends Only' profile visibility
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  Enable data sharing for better recommendations
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  Review settings after your first month
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100">For Privacy-Conscious Users:</h4>
              <ul className="text-sm text-green-800 dark:text-green-200 mt-2 space-y-1">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  Use 'Private' profile with limited data sharing
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  Disable follow requests and search visibility
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  Regularly review and export your data
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" aria-hidden="true" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Export Your Data</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Download a copy of all your LitLens data including reading lists, reviews, and profile information. Available in JSON and CSV formats.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Delete Specific Data</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Selectively remove reading history, reviews, or other data while keeping your account active.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Data Retention</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Learn how long we keep different types of data and how to request early deletion of specific information.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Related Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Explore related privacy and security features:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Settings className="h-4 w-4" aria-hidden="true" />
                Notification Preferences
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Lock className="h-4 w-4" aria-hidden="true" />
                Account Security
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}