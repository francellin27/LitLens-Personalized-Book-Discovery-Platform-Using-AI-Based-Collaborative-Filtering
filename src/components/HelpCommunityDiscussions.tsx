import { ArrowLeft, MessageCircle, Users, ThumbsUp, Flag, Reply, Edit3, Eye, EyeOff, MessageSquare, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpCommunityDiscussionsProps {
  onBack: () => void;
}

export function HelpCommunityDiscussions({ onBack }: HelpCommunityDiscussionsProps) {
  const discussionTypes = [
    {
      icon: MessageSquare,
      title: "Book Discussions",
      description: "In-depth conversations about specific books, characters, and themes",
      examples: ["Chapter-by-chapter analysis", "Character development discussions", "Plot theory threads"],
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      icon: Users,
      title: "General Community",
      description: "Broader conversations about reading, literature, and book culture",
      examples: ["Reading challenges and goals", "Book recommendation requests", "Author spotlights"],
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    },
    {
      icon: Eye,
      title: "Spoiler Discussions",
      description: "Protected spaces for discussing plot details and endings",
      examples: ["Ending analysis", "Major plot reveals", "Theory confirmations"],
      color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    },
    {
      icon: ThumbsUp,
      title: "Reviews & Ratings",
      description: "Share detailed thoughts and opinions about books you've read",
      examples: ["Detailed book reviews", "Rating discussions", "Comparison threads"],
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    }
  ];

  const participationSteps = [
    {
      step: 1,
      title: "Read the Discussion",
      description: "Start by reading existing posts to understand the conversation",
      tips: ["Check if it's spoiler-free or contains spoilers", "Read the original post and top replies", "Note any specific questions being asked"]
    },
    {
      step: 2,
      title: "Consider Your Response",
      description: "Think about what unique perspective or insight you can add",
      tips: ["Avoid repeating what others have said", "Share personal experiences with the book", "Ask follow-up questions"]
    },
    {
      step: 3,
      title: "Write Thoughtfully",
      description: "Craft a well-considered response that adds value",
      tips: ["Use clear, respectful language", "Support opinions with examples", "Acknowledge different viewpoints"]
    },
    {
      step: 4,
      title: "Engage Responsively",
      description: "Reply to responses and continue the conversation",
      tips: ["Thank others for their insights", "Answer questions directed at you", "Build on others' ideas"]
    }
  ];

  const discussionFeatures = [
    {
      icon: Reply,
      title: "Reply & Thread",
      description: "Respond to specific comments to create organized conversations",
      usage: "Use when responding directly to someone's point"
    },
    {
      icon: ThumbsUp,
      title: "Like & React",
      description: "Show appreciation for good posts without adding clutter",
      usage: "Use for posts you agree with but don't need to comment on"
    },
    {
      icon: Flag,
      title: "Report Content",
      description: "Flag inappropriate content or violations of community rules",
      usage: "Use sparingly for genuine rule violations only"
    },
    {
      icon: EyeOff,
      title: "Spoiler Tags",
      description: "Hide plot details to protect readers who haven't finished",
      usage: "Always use when discussing major plot points or endings"
    }
  ];

  const discussionBestPractices = [
    {
      title: "Be respectful and kind",
      description: "Remember there's a real person behind every username.",
      examples: ["Disagree with ideas, not people", "Use 'I think' instead of 'You're wrong'", "Thank others for sharing"]
    },
    {
      title: "Use spoiler warnings appropriately",
      description: "Protect other readers' experience by marking spoilers clearly.",
      examples: ["Mark anything beyond the first few chapters", "Be specific about spoiler scope", "Use spoiler tags consistently"]
    },
    {
      title: "Stay on topic",
      description: "Keep discussions focused on the stated topic or book.",
      examples: ["Don't hijack threads for different topics", "Create new discussions for tangential subjects", "Respect the original poster's intent"]
    },
    {
      title: "Add value to conversations",
      description: "Contribute meaningfully rather than just agreeing or disagreeing.",
      examples: ["Share specific examples from the text", "Ask thoughtful follow-up questions", "Offer new perspectives"]
    },
    {
      title: "Read before responding",
      description: "Make sure you understand the full context before replying.",
      examples: ["Read the entire original post", "Check if your point has been made", "Understand the current discussion flow"]
    }
  ];

  const spoilerGuidelines = [
    {
      category: "Always Spoiler Tag",
      items: [
        "Major plot twists or reveals",
        "Character deaths or major changes",
        "Book endings and resolutions",
        "Identity reveals or mysteries solved",
        "Any plot details from the last 25% of a book"
      ]
    },
    {
      category: "Usually Safe to Discuss",
      items: [
        "General genre and setting",
        "Writing style and prose quality",
        "Characters' names and basic traits",
        "Early plot setup (first few chapters)",
        "General themes without specific examples"
      ]
    }
  ];

  const engagementTips = [
    {
      title: "Ask open-ended questions",
      description: "Encourage others to share their thoughts and interpretations."
    },
    {
      title: "Share personal connections",
      description: "Relate books to your own experiences when relevant."
    },
    {
      title: "Acknowledge good points",
      description: "Credit others when they make insightful observations."
    },
    {
      title: "Be patient with disagreements",
      description: "Understand that book interpretation is subjective."
    },
    {
      title: "Follow up on conversations",
      description: "Return to discussions to see responses and continue dialogue."
    }
  ];

  const moderationGuidelines = [
    {
      title: "What gets moderated",
      items: ["Personal attacks or harassment", "Excessive spoilers without warnings", "Off-topic spam", "Inappropriate content", "Repeated rule violations"]
    },
    {
      title: "How to report issues",
      items: ["Use the report button on problematic posts", "Contact moderators for serious issues", "Provide specific details about violations", "Don't engage in arguments - let moderators handle it"]
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
          <h1 className="text-3xl font-bold mb-4">Participating in Discussions</h1>
          <p className="text-muted-foreground text-lg">
            Great discussions are the heart of any reading community. Learn how to contribute meaningfully, engage respectfully, and make the most of conversations with fellow readers.
          </p>
        </div>

        {/* Types of Discussions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Types of Discussions</h2>
          <div className="grid gap-4">
            {discussionTypes.map((type, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${type.color}`}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{type.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{type.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Common topics:</p>
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((example, exampleIndex) => (
                        <Badge key={exampleIndex} variant="outline" className="text-xs">
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Participate */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">How to Join Discussions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {participationSteps.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium flex-shrink-0">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">{item.title}</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">{item.description}</p>
                  <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    {item.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-1">
                        <div className="w-1 h-1 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Discussion Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Discussion Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discussionFeatures.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                      <div className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
                        <strong>When to use:</strong> {feature.usage}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Discussion Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {discussionBestPractices.map((practice, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{practice.title}</h4>
                    <p className="text-sm text-muted-foreground">{practice.description}</p>
                  </div>
                </div>
                <div className="ml-9 space-y-1">
                  {practice.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Spoiler Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Spoiler Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Protecting fellow readers' experience is crucial. Here's what needs spoiler warnings:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {spoilerGuidelines.map((section, index) => (
                <div key={index}>
                  <h4 className={`font-medium mb-2 ${section.category.includes('Always') ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                    {section.category}:
                  </h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <span className={section.category.includes('Always') ? 'text-red-600' : 'text-green-600'}>
                          {section.category.includes('Always') ? '⚠' : '✓'}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Pro tip:</strong> When in doubt, use a spoiler tag. It's better to be overly cautious than to ruin someone's reading experience.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Making Discussions More Engaging</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {engagementTips.map((tip, index) => (
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

        {/* Starting Your Own Discussion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Starting Your Own Discussion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Choose a Good Topic:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Be specific and focused</li>
                  <li>• Ask open-ended questions</li>
                  <li>• Consider what hasn't been discussed recently</li>
                  <li>• Make it accessible to multiple readers</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Write a Strong Opening:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Provide context for your question</li>
                  <li>• Share your own thoughts first</li>
                  <li>• Be clear about spoiler scope</li>
                  <li>• Encourage diverse viewpoints</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Moderation and Community Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Community Moderation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {moderationGuidelines.map((section, index) => (
                <div key={index}>
                  <h4 className="font-medium mb-2">{section.title}:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-1">
                        <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Discussion Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Great Discussion Starters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Character Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  "What did you think of [Character]'s development throughout [Book]? Did their actions in Chapter X change how you viewed them?"
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Theme Discussion</h4>
                <p className="text-sm text-muted-foreground">
                  "How did [Book] handle the theme of [Theme]? Did you find the author's approach effective or did anything feel heavy-handed?"
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Recommendation Request</h4>
                <p className="text-sm text-muted-foreground">
                  "I loved [specific aspects] about [Book]. Can anyone recommend something similar that captures that same [feeling/style/theme]?"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Share Your Thoughts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Ready to contribute to the conversation? Learn how to write detailed reviews and share your opinions about books:
            </p>
            <Button variant="outline" className="gap-2">
              <Edit3 className="h-4 w-4" />
              Learn About Writing Book Reviews
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}