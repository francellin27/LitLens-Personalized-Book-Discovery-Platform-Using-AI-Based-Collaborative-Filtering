import { ArrowLeft, Share2, Users, Link, Eye, EyeOff, UserPlus, MessageCircle, Heart, Copy, Mail, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpReadingListsSharingProps {
  onBack: () => void;
}

export function HelpReadingListsSharing({ onBack }: HelpReadingListsSharingProps) {
  const sharingMethods = [
    {
      icon: Link,
      title: "Share by Link",
      description: "Generate a link that anyone can use to view your list.",
      features: [
        "Works with anyone, even non-users",
        "Can be shared via social media, email, or messaging",
        "Option to make link expire after set time",
        "Track how many people viewed your list"
      ],
      bestFor: "Public sharing and social media"
    },
    {
      icon: UserPlus,
      title: "Direct Friend Sharing",
      description: "Share lists directly with specific friends on LitLens.",
      features: [
        "Send to friends within the app",
        "Recipients get notification",
        "Can add personal message",
        "Friends can comment and react"
      ],
      bestFor: "Close friends and book club members"
    },
    {
      icon: Users,
      title: "Collaborative Lists",
      description: "Create lists that multiple people can edit together.",
      features: [
        "Multiple contributors can add/remove books",
        "See who added each book",
        "Real-time updates for all collaborators",
        "Set different permission levels"
      ],
      bestFor: "Book clubs and reading groups"
    }
  ];

  const privacySettings = [
    {
      icon: Globe,
      title: "Public",
      description: "Anyone can discover and view your list",
      features: ["Appears in search results", "Can be featured", "Visible to all users"],
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    },
    {
      icon: Users,
      title: "Friends Only",
      description: "Only your friends can see and access the list",
      features: ["Hidden from public search", "Requires friend connection", "Can still be shared by link"],
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      icon: Link,
      title: "Link Only",
      description: "Only people with the direct link can view",
      features: ["Not discoverable publicly", "No friend requirement", "Perfect for selective sharing"],
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    },
    {
      icon: EyeOff,
      title: "Private",
      description: "Only you can see the list",
      features: ["Completely hidden", "Cannot be shared", "For personal use only"],
      color: "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
    }
  ];

  const collaborationFeatures = [
    {
      icon: UserPlus,
      title: "Add Contributors",
      description: "Invite friends to help build and maintain the list"
    },
    {
      icon: Eye,
      title: "Permission Levels",
      description: "Set who can view, comment, or edit the list"
    },
    {
      icon: MessageCircle,
      title: "Comments & Discussion",
      description: "Let contributors discuss books and recommendations"
    },
    {
      icon: Heart,
      title: "Reactions",
      description: "Allow friends to like and react to book additions"
    }
  ];

  const sharingTips = [
    {
      title: "Write compelling descriptions",
      description: "A good description makes people want to explore your list and understand its purpose."
    },
    {
      title: "Update regularly",
      description: "Keep shared lists fresh with new additions and remove books you no longer recommend."
    },
    {
      title: "Engage with viewers",
      description: "Respond to comments and questions to build a community around your list."
    },
    {
      title: "Cross-promote",
      description: "Share your lists across different platforms and in relevant communities."
    },
    {
      title: "Collaborate wisely",
      description: "Choose collaborators who share your vision and will actively contribute."
    }
  ];

  const useCase = [
    {
      title: "Book Club Lists",
      description: "Collaborative lists for book club selections and recommendations",
      tips: ["Let all members add suggestions", "Vote on next reads", "Track what you've read together"]
    },
    {
      title: "Friend Recommendations",
      description: "Personal lists of books you want to recommend to specific friends",
      tips: ["Tailor to their interests", "Add personal notes", "Update based on their feedback"]
    },
    {
      title: "Public Curation",
      description: "Themed lists that showcase your expertise in specific genres or topics",
      tips: ["Focus on a niche", "Provide detailed descriptions", "Engage with the community"]
    },
    {
      title: "Family Reading",
      description: "Shared lists for family reading challenges or kids' book recommendations",
      tips: ["Include age-appropriate content", "Add reading levels", "Track family goals together"]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Help Center
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Badge variant="secondary" className="mb-4">Reading Lists & Organization</Badge>
          <h1 className="text-3xl font-bold mb-4">Sharing Lists with Friends</h1>
          <p className="text-muted-foreground text-lg">
            Turn your reading lists into social experiences. Share your favorite books, collaborate on reading challenges, and discover new titles through your friends' recommendations.
          </p>
        </div>

        {/* Sharing Methods */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Ways to Share Your Lists</h2>
          <div className="grid gap-6">
            {sharingMethods.map((method, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <method.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{method.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{method.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    {method.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Badge variant="outline" className="w-fit text-xs">
                    Best for: {method.bestFor}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Privacy and Access Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {privacySettings.map((setting, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${setting.color}`}>
                      <setting.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{setting.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{setting.description}</p>
                      <ul className="space-y-1">
                        {setting.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="text-xs text-muted-foreground flex items-start gap-1">
                            <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Share */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">How to Share a List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Quick Share:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>Open the reading list you want to share</li>
                  <li>Click the "Share" button</li>
                  <li>Choose your sharing method</li>
                  <li>Set privacy preferences</li>
                  <li>Share the link or send directly</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Advanced Options:</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Add a personal message when sharing</li>
                  <li>• Set expiration dates for shared links</li>
                  <li>• Choose what information is visible</li>
                  <li>• Enable or disable comments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collaboration Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Collaborative Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collaborationFeatures.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Managing Shared Lists */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Managing Your Shared Lists
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">As a List Owner:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Control who can see and edit your list</li>
                  <li>• Remove contributors if needed</li>
                  <li>• Moderate comments and discussions</li>
                  <li>• Change privacy settings anytime</li>
                  <li>• Track views and engagement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">As a Contributor:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Add books that fit the list theme</li>
                  <li>• Leave thoughtful comments</li>
                  <li>• Respect the list owner's vision</li>
                  <li>• Engage with other contributors</li>
                  <li>• Suggest improvements respectfully</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Use Cases */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Popular Sharing Scenarios</h2>
          <div className="grid gap-4">
            {useCase.map((scenario, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{scenario.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Tips:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {scenario.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-1">
                          <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sharing Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Sharing Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {sharingTips.map((tip, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sharing Etiquette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Community Guidelines for Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Do:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Give credit when sharing others' recommendations</li>
                  <li>• Be respectful in comments and discussions</li>
                  <li>• Keep collaborative lists focused</li>
                  <li>• Update and maintain your shared lists</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Avoid:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Adding off-topic books to collaborative lists</li>
                  <li>• Sharing lists with inappropriate content</li>
                  <li>• Overwhelming friends with too many shares</li>
                  <li>• Neglecting lists after sharing them</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Common Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Friends can't see my shared list</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Check your privacy settings. Make sure the list is set to "Friends Only" or "Public" rather than "Private".
              </p>
            </div>
            <div>
              <h4 className="font-medium">Shared link isn't working</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Verify that the list privacy is set to allow link sharing. Private lists cannot be accessed via shared links.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Too many notifications from collaborative lists</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Adjust your notification settings in your profile to control alerts for list updates and comments.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Enhance Your Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Take your list organization to the next level with advanced tagging and categorization:
            </p>
            <Button variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Learn About Tags and Categories
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}