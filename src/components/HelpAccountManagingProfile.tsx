import { ArrowLeft, User, Edit, Camera, Clock, Save, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpAccountManagingProfileProps {
  onBack: () => void;
}

export function HelpAccountManagingProfile({ onBack }: HelpAccountManagingProfileProps) {
  const profileSections = [
    {
      icon: User,
      title: "Basic Profile Information",
      description: "Update your display name, username, and personal details.",
      steps: [
        "Navigate to your Profile page from the top navigation",
        "Click the 'Settings' tab to access account options",
        "Click 'Edit Profile' to modify your information",
        "Update your display name, username, or bio",
        "Save your changes to update your profile"
      ],
      tips: [
        "Profile changes are limited to once every 30 days for security",
        "Choose a username that represents you professionally",
        "Your display name is what other users see in discussions"
      ]
    },
    {
      icon: Camera,
      title: "Profile Picture",
      description: "Add or change your profile photo to personalize your account.",
      steps: [
        "Go to Profile &gt; Settings tab",
        "Click 'Edit Profile' button",
        "Click on your current profile picture or avatar",
        "Upload a new image (JPG or PNG, max 5MB)",
        "Adjust the crop if needed and save"
      ],
      tips: [
        "Use a clear, recent photo for better community connections",
        "Profile pictures should be appropriate for all audiences",
        "Square images work best for the circular profile display"
      ]
    },
    {
      icon: Edit,
      title: "Reading Bio & Interests",
      description: "Share your reading preferences and connect with like-minded readers.",
      steps: [
        "Access your Profile settings",
        "Scroll to the 'Reading Bio' section",
        "Write a brief description of your reading interests",
        "Add your favorite genres and authors",
        "Set your current reading goals"
      ],
      tips: [
        "A good bio helps others discover shared interests",
        "Mention specific genres or authors you love",
        "Update your bio as your reading tastes evolve"
      ]
    }
  ];

  const privacyOptions = [
    {
      title: "Profile Visibility",
      description: "Control who can see your profile information",
      options: ["Public", "Friends Only", "Private"]
    },
    {
      title: "Reading Activity",
      description: "Manage what reading data is visible to others",
      options: ["Show all activity", "Show reading lists only", "Hide all activity"]
    },
    {
      title: "Review History",
      description: "Choose visibility of your book reviews and ratings",
      options: ["Public reviews", "Friends only", "Private reviews"]
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
          <h1 className="text-3xl font-bold mb-4">Managing Your Profile</h1>
          <p className="text-muted-foreground text-lg">
            Learn how to customize your LitLens profile, update your information, and control your privacy settings to create the perfect reading experience.
          </p>
        </div>

        {/* Profile Management Sections */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Profile Management Guide</h2>
          <div className="grid gap-6">
            {profileSections.map((section, index) => (
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
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Step-by-Step:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      {section.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  {section.tips && (
                    <div>
                      <h4 className="font-medium mb-2">💡 Pro Tips:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Controls */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Privacy Controls</h2>
          <div className="grid gap-4">
            {privacyOptions.map((option, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{option.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {option.options.map((opt, optIndex) => (
                          <Badge key={optIndex} variant="outline" className="text-xs">
                            {opt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Access Guide */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Quick Access to Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Desktop Navigation:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 pl-4">
                <li>Click 'Profile' in the top navigation bar</li>
                <li>Select the 'Settings' tab</li>
                <li>Click 'Edit Profile' to make changes</li>
                <li>Use 'Account Actions' for advanced settings</li>
              </ol>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Mobile Access:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200 pl-4">
                <li>Tap the menu icon (☰) in the top right</li>
                <li>Tap your profile card at the top</li>
                <li>Navigate to the 'Settings' tab</li>
                <li>Tap 'Edit Profile' to customize</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" aria-hidden="true" />
              Common Issues & Solutions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">I can't edit my profile information</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Profile changes are limited to once every 30 days for security. Check when you last updated your profile in the Settings tab.
              </p>
            </div>
            <div>
              <h4 className="font-medium">My profile picture won't upload</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ensure your image is in JPG or PNG format and under 5MB. Try resizing the image or using a different file.
              </p>
            </div>
            <div>
              <h4 className="font-medium">My username is already taken</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Usernames must be unique. Try variations with numbers or different combinations. Remember you can only change it once every 30 days.
              </p>
            </div>
            <div>
              <h4 className="font-medium">I can't see privacy options</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Privacy settings are located in your Profile Settings tab. If you can't access them, try refreshing the page or contact support.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Once your profile is set up, explore these related features:
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Shield className="h-4 w-4" aria-hidden="true" />
                Configure Privacy Settings
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Eye className="h-4 w-4" aria-hidden="true" />
                Set Notification Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}