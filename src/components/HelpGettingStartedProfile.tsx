import { ArrowLeft, User, BookOpen, Heart, Settings, Star, Target, Palette, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpGettingStartedProfileProps {
  onBack: () => void;
  onPageChange?: (page: string) => void;
}

export function HelpGettingStartedProfile({ onBack, onPageChange }: HelpGettingStartedProfileProps) {
  const profileSections = [
    {
      icon: User,
      title: "Basic Information",
      description: "Update your display name, bio, and profile picture to personalize your account.",
      items: [
        "Choose a display name that represents you",
        "Write a brief bio about your reading interests",
        "Upload a profile picture (optional)",
        "Set your location and reading goals"
      ]
    },
    {
      icon: BookOpen,
      title: "Reading Preferences",
      description: "Tell us about your favorite genres, authors, and reading habits.",
      items: [
        "Select your favorite genres",
        "Add preferred authors",
        "Set your reading pace (books per month)",
        "Choose content ratings you're comfortable with"
      ]
    },
    {
      icon: Heart,
      title: "Interests & Themes",
      description: "Help us understand what types of stories and themes you enjoy.",
      items: [
        "Select themes you enjoy (romance, mystery, adventure, etc.)",
        "Choose your preferred book lengths",
        "Set trigger warning preferences",
        "Select age groups and content types"
      ]
    },
    {
      icon: Settings,
      title: "Privacy & Sharing",
      description: "Control what information is visible to other users and how you interact with the community.",
      items: [
        "Choose who can see your reading lists",
        "Set review and rating visibility",
        "Control discussion participation",
        "Manage friend requests and followers"
      ]
    }
  ];

  const tips = [
    {
      icon: Target,
      title: "Be Specific",
      description: "The more specific you are about your preferences, the better our recommendations will be."
    },
    {
      icon: Star,
      title: "Update Regularly",
      description: "Your tastes might evolve - update your profile as you discover new interests."
    },
    {
      icon: Palette,
      title: "Express Yourself",
      description: "Use your bio and profile to connect with like-minded readers in the community."
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
          <Badge variant="secondary" className="mb-4">Getting Started</Badge>
          <h1 className="text-3xl font-bold mb-4">Setting Up Your Reading Profile</h1>
          <p className="text-muted-foreground text-lg">
            Your reading profile is the key to getting personalized recommendations and connecting with fellow readers. Take a few minutes to set it up properly.
          </p>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Profile Setup Guide</h2>
          <div className="grid gap-6">
            {profileSections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10" aria-hidden="true">
                      <section.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold" id={`section-${index + 1}-heading`}>{section.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{section.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2" aria-labelledby={`section-${index + 1}-heading`}>
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Access Profile Settings */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" role="region" aria-labelledby="profile-access-heading">
          <CardHeader>
            <CardTitle id="profile-access-heading" className="text-blue-900 dark:text-blue-100">How to Access Your Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100" id="desktop-access">From the Navigation Menu:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 pl-4" aria-labelledby="desktop-access">
                <li>Click on your avatar in the top-right corner</li>
                <li>Select <kbd className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-xs">"Profile"</kbd> from the dropdown menu</li>
                <li>Click <kbd className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-xs">"Edit Profile"</kbd> to make changes</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100" id="mobile-access">Mobile Users:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 pl-4" aria-labelledby="mobile-access">
                <li>Tap the menu icon (three lines)</li>
                <li>Tap <kbd className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-xs">"Profile"</kbd> in the mobile menu</li>
                <li>Tap <kbd className="bg-blue-100 dark:bg-blue-800 px-1 rounded text-xs">"Edit Profile"</kbd> to customize</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Pro Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tips.map((tip, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                    <tip.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-center">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Privacy Settings Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Public Profile</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Choose what information other users can see when they visit your profile. You can make your reading lists, reviews, and activity public or private.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Reading Data</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Control how your reading data is used for recommendations. You can opt out of data sharing while still receiving personalized suggestions.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Community Interaction</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Set preferences for how other users can interact with you, including friend requests, messages, and mentions in discussions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Customize which notifications you receive to stay informed without being overwhelmed:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                New book recommendations based on your preferences
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Community activity (replies, likes, new discussions)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Reading reminders and goal updates
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                New releases from favorite authors
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Ready for the Next Step?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Once your profile is set up, you're ready to start building your personal library:
            </p>
            <Button 
              variant="outline" 
              className="gap-2 focus-visible-ring"
              onClick={() => onPageChange?.('help-getting-started-library')}
              aria-label="Navigate to help article about adding books to your library"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Learn How to Add Books to Your Library
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}