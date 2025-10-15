import { ArrowLeft, UserPlus, Users, Bell, BookOpen, MessageCircle, Star, Eye, UserCheck, Search, Filter, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpCommunityFollowingProps {
  onBack: () => void;
}

export function HelpCommunityFollowing({ onBack }: HelpCommunityFollowingProps) {
  const followingBenefits = [
    {
      icon: BookOpen,
      title: "Discover New Books",
      description: "See what books your followed readers are adding to their libraries and reading lists",
      examples: ["Get recommendations from trusted sources", "Find books similar to your tastes", "Discover hidden gems"]
    },
    {
      icon: Star,
      title: "Quality Reviews",
      description: "Read reviews from readers whose opinions you value and trust",
      examples: ["Skip books that didn't work for similar readers", "Prioritize highly-rated books", "Understand different perspectives"]
    },
    {
      icon: MessageCircle,
      title: "Engage in Discussions",
      description: "Participate in conversations with readers who share your interests",
      examples: ["Join book club discussions", "Comment on reviews", "Share reading experiences"]
    },
    {
      icon: Bell,
      title: "Stay Updated",
      description: "Get notifications when followed readers post reviews or start discussions",
      examples: ["Never miss a new review", "Join conversations early", "Keep up with reading progress"]
    }
  ];

  const howToFollow = [
    {
      step: 1,
      title: "Find Interesting Readers",
      description: "Discover readers through various channels in the community",
      methods: ["Browse book reviews and comments", "Join book club discussions", "Check who's active in your favorite genres", "Look at followers of readers you already follow"]
    },
    {
      step: 2,
      title: "Check Their Profile",
      description: "Review their reading history and preferences before following",
      tips: ["Look at their recent reviews", "Check their favorite genres", "See their reading statistics", "Review their public reading lists"]
    },
    {
      step: 3,
      title: "Follow or Connect",
      description: "Click the follow button to start seeing their activity",
      options: ["Public follow (no approval needed)", "Send follow request (for private profiles)", "Mutual following for closer connections"]
    },
    {
      step: 4,
      title: "Engage Meaningfully",
      description: "Interact with their content to build reading relationships",
      actions: ["Like and comment on reviews", "Join their discussions", "Share book recommendations", "Participate in their book clubs"]
    }
  ];

  const findingReaders = [
    {
      method: "Browse by Genre",
      description: "Find readers who specialize in your favorite genres",
      tips: ["Check top reviewers in specific genres", "Look for readers with extensive genre knowledge", "Follow genre-specific book club leaders"]
    },
    {
      method: "Review Comments",
      description: "Look for thoughtful commenters on book reviews",
      tips: ["Notice readers who leave insightful comments", "Find people who engage respectfully", "Follow those who ask good questions"]
    },
    {
      method: "Book Club Members",
      description: "Connect with active participants in book clubs",
      tips: ["Join clubs to meet like-minded readers", "Follow regular discussion participants", "Connect with club moderators"]
    },
    {
      method: "Reading Challenges",
      description: "Find motivated readers through reading challenges",
      tips: ["Join challenge groups", "Follow challenge leaders", "Connect with readers with similar goals"]
    }
  ];

  const followingEtiquette = [
    {
      title: "Respect privacy settings",
      description: "Honor whether someone has a public or private profile and don't pressure for follows back."
    },
    {
      title: "Engage genuinely",
      description: "Comment and interact when you have something meaningful to add, not just for attention."
    },
    {
      title: "Avoid overwhelming",
      description: "Don't comment on every single post or review - space out your interactions naturally."
    },
    {
      title: "Be supportive",
      description: "Celebrate others' reading achievements and milestones, even if they differ from your preferences."
    },
    {
      title: "Disagree respectfully",
      description: "It's okay to have different opinions about books, but express disagreement kindly and constructively."
    }
  ];

  const managingFollows = [
    {
      feature: "Following Feed",
      description: "See activity from all the readers you follow in one place",
      includes: ["New reviews and ratings", "Reading list updates", "Discussion posts", "Reading milestone celebrations"]
    },
    {
      feature: "Notification Settings",
      description: "Control what notifications you receive from followed readers",
      options: ["All activity", "Reviews only", "Major updates only", "Mentions only"]
    },
    {
      feature: "Lists and Organization",
      description: "Organize your followed readers into meaningful groups",
      examples: ["Close friends", "Genre experts", "Book club members", "Reading buddies"]
    },
    {
      feature: "Mutual Connections",
      description: "See who follows you back and build stronger reading relationships",
      benefits: ["Direct messaging", "Private reading list sharing", "Exclusive book club invites"]
    }
  ];

  const privacySettings = [
    {
      setting: "Public Profile",
      description: "Anyone can follow you and see your reading activity",
      bestFor: "Readers who want to build a large community and share recommendations widely"
    },
    {
      setting: "Followers by Request",
      description: "You approve each follow request individually",
      bestFor: "Readers who want to curate their audience and maintain some privacy"
    },
    {
      setting: "Friends Only",
      description: "Only confirmed friends can see your full reading activity",
      bestFor: "Readers who prefer intimate reading communities and close connections"
    }
  ];

  const networkingTips = [
    {
      title: "Start with quality over quantity",
      description: "Follow fewer readers who truly align with your interests rather than following everyone."
    },
    {
      title: "Be patient building connections",
      description: "Good reading relationships develop over time through consistent, genuine interactions."
    },
    {
      title: "Contribute to the community",
      description: "Share your own reviews and insights to attract followers who value your perspective."
    },
    {
      title: "Participate in group activities",
      description: "Join book clubs and reading challenges to meet readers with similar goals."
    },
    {
      title: "Support other readers",
      description: "Celebrate others' reading achievements and share books you think they'd enjoy."
    }
  ];

  const troubleshooting = [
    {
      issue: "Not getting follow-backs",
      solution: "Focus on engaging with others' content genuinely rather than expecting reciprocal follows. Quality connections matter more than numbers."
    },
    {
      issue: "Too many notifications",
      solution: "Adjust your notification settings to only receive alerts for the most important updates from followed readers."
    },
    {
      issue: "Following too many inactive users",
      solution: "Regularly review your following list and unfollow readers who haven't been active recently to keep your feed relevant."
    },
    {
      issue: "Disagreements with followed readers",
      solution: "Remember that different opinions make discussions interesting. Engage respectfully or simply scroll past content you disagree with."
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
          <Badge variant="secondary" className="mb-4">Community Features</Badge>
          <h1 className="text-3xl font-bold mb-4">Following Other Readers</h1>
          <p className="text-muted-foreground text-lg">
            Building a network of fellow readers enhances your reading journey by providing recommendations, discussions, and community. Learn how to find, follow, and engage with readers who share your literary interests.
          </p>
        </div>

        {/* Benefits of Following */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Why Follow Other Readers?</h2>
          <div className="grid gap-4">
            {followingBenefits.map((benefit, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{benefit.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {benefit.examples.map((example, exampleIndex) => (
                      <Badge key={exampleIndex} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Follow */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">How to Follow Readers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {howToFollow.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">{item.title}</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">{item.description}</p>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    {(item.methods || item.tips || item.options || item.actions)?.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-1">
                        <div className="w-1 h-1 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Finding Readers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Finding Readers to Follow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {findingReaders.map((method, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{method.method}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Tips:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {method.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-1">
                          <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Managing Your Network */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Managing Your Reading Network</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managingFollows.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{feature.feature}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {feature.includes ? 'Includes:' : feature.options ? 'Options:' : feature.examples ? 'Examples:' : 'Benefits:'}
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {(feature.includes || feature.options || feature.examples || feature.benefits)?.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-1">
                          <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy and Follower Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {privacySettings.map((setting, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-1">{setting.setting}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{setting.description}</p>
                  <div className="p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                    <strong>Best for:</strong> {setting.bestFor}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Following Etiquette */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Following Etiquette
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {followingEtiquette.map((rule, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{rule.title}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Building Your Network */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Building a Strong Reading Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {networkingTips.map((tip, index) => (
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

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Understanding Your Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">What You'll See:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• New reviews from followed readers</li>
                  <li>• Books added to reading lists</li>
                  <li>• Reading milestone celebrations</li>
                  <li>• Discussion posts and comments</li>
                  <li>• Book ratings and recommendations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Customizing Your Feed:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Filter by activity type</li>
                  <li>• Sort by recency or engagement</li>
                  <li>• Hide/show specific readers temporarily</li>
                  <li>• Adjust notification frequency</li>
                  <li>• Create themed feed sections</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mutual Connections */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Building Mutual Connections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              When you and another reader follow each other, you unlock additional community features:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Enhanced Features:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Direct messaging for book discussions</li>
                  <li>• Private reading list sharing</li>
                  <li>• Buddy reading coordination</li>
                  <li>• Exclusive book club invitations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Collaboration Options:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Joint reading challenges</li>
                  <li>• Shared book recommendation lists</li>
                  <li>• Private discussion groups</li>
                  <li>• Reading accountability partnerships</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Common Issues and Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {troubleshooting.map((item, index) => (
              <div key={index}>
                <h4 className="font-medium">{item.issue}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.solution}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Success Tips */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Building Your Reading Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Following other readers is just the beginning. The real magic happens when you engage authentically and build genuine reading relationships. Start small, be genuine, and watch your reading community grow naturally.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Explore Community
              </Button>
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Find Reading Buddies
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}