import { ArrowLeft, Share2, Database, Users, Eye, EyeOff, Settings, ToggleLeft, ToggleRight, Sparkles, TrendingUp, BookOpen, UserCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";

interface HelpPrivacyDataSharingProps {
  onBack: () => void;
}

export function HelpPrivacyDataSharing({ onBack }: HelpPrivacyDataSharingProps) {
  const sharingCategories = [
    {
      icon: BookOpen,
      title: "Reading Preferences",
      description: "Genres, authors, and book types you enjoy",
      purpose: "Personalized book recommendations and discovery",
      impact: "Better suggestions tailored to your taste",
      defaultEnabled: true,
      sensitive: false
    },
    {
      icon: TrendingUp,
      title: "Rating Patterns",
      description: "How you rate books and what influences your ratings",
      purpose: "Improve recommendation algorithms and matching",
      impact: "More accurate predictions of books you'll love",
      defaultEnabled: true,
      sensitive: false
    },
    {
      icon: Users,
      title: "Community Activity",
      description: "Your participation in discussions and follows",
      purpose: "Connect you with similar readers and communities",
      impact: "Better community recommendations and networking",
      defaultEnabled: true,
      sensitive: false
    },
    {
      icon: Eye,
      title: "Reading Behavior",
      description: "How you browse, search, and interact with content",
      purpose: "Platform improvements and feature development",
      impact: "Enhanced user experience and interface design",
      defaultEnabled: false,
      sensitive: true
    }
  ];

  const partnersAndIntegrations = [
    {
      name: "Goodreads Import",
      type: "Reading Platform",
      description: "Import your reading history and ratings",
      dataShared: "Book titles, ratings, reading dates, reviews",
      userControl: "One-time import with your consent",
      purpose: "Faster onboarding and better initial recommendations"
    },
    {
      name: "Local Libraries",
      type: "Library Systems",
      description: "Check book availability at nearby libraries",
      dataShared: "Location (city/state), book interests",
      userControl: "Enable/disable in settings",
      purpose: "Help you find books to borrow locally"
    },
    {
      name: "Book Analytics Partners",
      type: "Industry Research",
      description: "Anonymous reading trend analysis",
      dataShared: "Aggregated, anonymized reading patterns",
      userControl: "Opt-out available",
      purpose: "Industry insights and platform improvements"
    },
    {
      name: "Accessibility Services",
      type: "Assistive Technology",
      description: "Enhanced access for users with disabilities",
      dataShared: "Accessibility preferences and usage patterns",
      userControl: "Automatic for accessibility users",
      purpose: "Improve accessibility features and support"
    }
  ];

  const benefitsOfSharing = [
    {
      icon: Sparkles,
      title: "Better Recommendations",
      description: "More accurate book suggestions based on your reading patterns and preferences",
      impact: "90% of users find better books when sharing is enabled"
    },
    {
      icon: Users,
      title: "Community Connections",
      description: "Connect with readers who have similar tastes and interests",
      impact: "3x more likely to discover books through community"
    },
    {
      icon: TrendingUp,
      title: "Platform Improvements",
      description: "Help us build better features and fix issues that matter to you",
      impact: "Features developed based on user data are 5x more successful"
    },
    {
      icon: BookOpen,
      title: "Personalized Experience",
      description: "Customize the platform to match your reading style and goals",
      impact: "Personalized interfaces increase reading discovery by 40%"
    }
  ];

  const privacyControls = [
    {
      setting: "Reading History Sharing",
      description: "Share your reading history for better recommendations",
      granularity: "Genre-level, Full history, or Disabled",
      default: "Genre-level"
    },
    {
      setting: "Community Data",
      description: "Allow community features to use your data",
      granularity: "Public, Friends Only, or Private",
      default: "Friends Only"
    },
    {
      setting: "Analytics Participation",
      description: "Contribute to platform analytics and research",
      granularity: "Full, Anonymous Only, or Opt-out",
      default: "Anonymous Only"
    },
    {
      setting: "Third-party Integrations",
      description: "Connect with external services and platforms",
      granularity: "Per-service approval required",
      default: "Case-by-case consent"
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
          <Badge variant="secondary" className="mb-4">Privacy & Security</Badge>
          <h1 className="text-3xl font-bold mb-4">Managing Data Sharing</h1>
          <p className="text-muted-foreground text-lg">
            Control how your reading data is used to improve your experience and help the community. Learn about data sharing benefits, privacy controls, and third-party integrations.
          </p>
        </div>

        {/* Data Sharing Overview */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
          <Share2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Your Control:</strong> You have complete control over what data is shared and how it's used. All sharing is optional and can be disabled at any time in your privacy settings.
          </AlertDescription>
        </Alert>

        {/* Data Categories */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">What Data Can Be Shared</h2>
          <div className="space-y-4">
            {sharingCategories.map((category, index) => (
              <Card key={index} className={category.sensitive ? "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <category.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{category.title}</h3>
                        {category.sensitive && (
                          <Badge variant="outline" className="text-yellow-700 border-yellow-300">Sensitive</Badge>
                        )}
                        <div className="ml-auto flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {category.defaultEnabled ? "Enabled by default" : "Opt-in only"}
                          </span>
                          <Switch checked={category.defaultEnabled} disabled />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-normal">{category.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-1">Purpose</h4>
                      <p className="text-muted-foreground">{category.purpose}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Your Benefit</h4>
                      <p className="text-muted-foreground">{category.impact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits of Data Sharing */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Benefits of Data Sharing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefitsOfSharing.map((benefit, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-green-600" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{benefit.description}</p>
                      <p className="text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded">
                        {benefit.impact}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Controls */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Privacy Controls</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" aria-hidden="true" />
                Granular Control Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {privacyControls.map((control, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{control.setting}</h4>
                      <p className="text-sm text-muted-foreground">{control.description}</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Options:</span>
                      <span>{control.granularity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Default:</span>
                      <span className="font-medium">{control.default}</span>
                    </div>
                  </div>
                  {index < privacyControls.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Third-party Integrations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Third-party Integrations</h2>
          <p className="text-muted-foreground">
            LitLens partners with trusted services to enhance your reading experience. All integrations require your explicit consent and can be disabled at any time.
          </p>
          <div className="space-y-4">
            {partnersAndIntegrations.map((partner, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{partner.name}</h3>
                      <Badge variant="outline">{partner.type}</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" aria-hidden="true" />
                      Manage
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-1">Data Shared</h4>
                      <p className="text-muted-foreground">{partner.dataShared}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Your Control</h4>
                      <p className="text-muted-foreground">{partner.userControl}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Purpose</h4>
                      <p className="text-muted-foreground">{partner.purpose}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Anonymization */}
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
              <Database className="h-5 w-5" aria-hidden="true" />
              How We Protect Your Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Data Anonymization</h4>
              <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                When possible, we use anonymized and aggregated data for analytics and research. This means your individual identity cannot be determined from the data.
              </p>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Personal identifiers are removed or encrypted</li>
                <li>• Data is grouped with thousands of other users</li>
                <li>• Statistical analysis prevents re-identification</li>
                <li>• Regular audits ensure anonymization effectiveness</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Minimal Data Principle</h4>
              <p className="text-sm text-green-800 dark:text-green-200">
                We only collect and share the minimum amount of data necessary to provide the specific feature or benefit. You can always choose more restrictive sharing options without losing core functionality.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sharing Lifecycle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium mb-1">Collection</h4>
                  <p className="text-sm text-muted-foreground">Data is collected only when you use features that require it</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium mb-1">Processing</h4>
                  <p className="text-sm text-muted-foreground">Data is anonymized, encrypted, and processed according to your preferences</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium mb-1">Usage</h4>
                  <p className="text-sm text-muted-foreground">Processed data is used only for the purposes you've approved</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-medium mb-1">Retention</h4>
                  <p className="text-sm text-muted-foreground">Data is kept only as long as necessary, then securely deleted</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Manage Your Data Sharing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Take control of your data sharing preferences:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Settings className="h-4 w-4" aria-hidden="true" />
                Privacy Settings
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Sharing Preferences
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Database className="h-4 w-4" aria-hidden="true" />
                Download My Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}