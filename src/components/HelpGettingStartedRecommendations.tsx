import { ArrowLeft, Brain, Star, Users, BookOpen, TrendingUp, Target, Lightbulb, Heart, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpGettingStartedRecommendationsProps {
  onBack: () => void;
}

export function HelpGettingStartedRecommendations({ onBack }: HelpGettingStartedRecommendationsProps) {
  const howItWorks = [
    {
      icon: Star,
      title: "Your Ratings & Reviews",
      description: "Every book you rate helps our AI understand your preferences and taste patterns.",
      details: [
        "5-star ratings indicate books you absolutely love",
        "Lower ratings help us avoid similar recommendations",
        "Written reviews provide context about what you liked/disliked",
        "The more you rate, the better recommendations become"
      ]
    },
    {
      icon: BookOpen,
      title: "Reading History",
      description: "Your library and reading patterns reveal genres, themes, and styles you prefer.",
      details: [
        "Genres you read most often get higher priority",
        "Book length preferences are factored in",
        "Publication years help determine if you prefer classics or contemporary",
        "Author patterns help find similar writing styles"
      ]
    },
    {
      icon: Users,
      title: "Collaborative Filtering",
      description: "We analyze readers with similar tastes to find books you might have missed.",
      details: [
        "Readers who rated books similarly to you",
        "Books loved by your 'taste twins'",
        "Community trends among similar readers",
        "Hidden gems discovered by like-minded users"
      ]
    },
    {
      icon: Brain,
      title: "AI Content Analysis",
      description: "Our AI analyzes book content, themes, and writing styles to find matches.",
      details: [
        "Thematic similarities between books",
        "Writing style and narrative structure",
        "Character types and story elements",
        "Emotional tone and pacing patterns"
      ]
    }
  ];

  const recommendationTypes = [
    {
      title: "For You",
      description: "Highly personalized picks based on your unique reading profile",
      icon: Target,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      title: "Because You Read",
      description: "Books similar to ones you've rated highly or recently finished",
      icon: BookOpen,
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    },
    {
      title: "Trending",
      description: "Popular books among readers with similar tastes to yours",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    },
    {
      title: "Hidden Gems",
      description: "Lesser-known books that match your preferences perfectly",
      icon: Lightbulb,
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
    }
  ];

  const improvingTips = [
    {
      title: "Rate More Books",
      description: "Add ratings to books you've read, even older ones. More data = better recommendations."
    },
    {
      title: "Be Honest",
      description: "Rate books based on your true feelings, not what you think you should like."
    },
    {
      title: "Use the Full Scale",
      description: "Don't hesitate to give 1-2 star ratings to books you didn't enjoy."
    },
    {
      title: "Update Your Profile",
      description: "Keep your reading preferences current as your tastes evolve."
    },
    {
      title: "Engage with Recommendations",
      description: "Like, dismiss, or add recommended books to help the system learn."
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
          <Badge variant="secondary" className="mb-4">Getting Started</Badge>
          <h1 className="text-3xl font-bold mb-4">Understanding Recommendations</h1>
          <p className="text-muted-foreground text-lg">
            LitLens uses advanced AI and community data to suggest books you'll love. Here's how our recommendation system works and how to get the best results.
          </p>
        </div>

        {/* How It Works */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">How Our AI Finds Your Perfect Books</h2>
          <div className="grid gap-6">
            {howItWorks.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{item.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {item.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Types of Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Types of Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendationTypes.map((type, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${type.color}`}>
                      <type.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{type.title}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Accessing Recommendations */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Where to Find Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Main Locations:</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Home page recommendation carousel</li>
                  <li>• Dedicated Recommendations page</li>
                  <li>• "You might also like" on book pages</li>
                  <li>• Personalized email newsletters</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Interactive Features:</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Like/dismiss recommendations</li>
                  <li>• Filter by genre or length</li>
                  <li>• Save for later reading</li>
                  <li>• Get explanations for why books were suggested</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendation Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Taking Action on Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <h4 className="font-medium">Like</h4>
                <p className="text-xs text-muted-foreground">Tell us you're interested - we'll suggest more like this</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-medium">Add to Library</h4>
                <p className="text-xs text-muted-foreground">Save to your reading list and help improve future suggestions</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Filter className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium">Not Interested</h4>
                <p className="text-xs text-muted-foreground">Dismiss and help us learn what you don't want</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Improving Recommendations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Getting Better Recommendations</h2>
          <div className="grid gap-4">
            {improvingTips.map((tip, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Common Questions */}
        <Card>
          <CardHeader>
            <CardTitle>Common Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Why am I seeing books I've already read?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Make sure to mark books as "Read" in your library. Our system only shows books that aren't already in your collection.
              </p>
            </div>
            <div>
              <h4 className="font-medium">How often do recommendations update?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Recommendations refresh daily, with major updates when you rate new books or update your preferences.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Can I get recommendations for specific genres?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Yes! Use the genre filters on the Recommendations page, or update your profile to emphasize certain genres.
              </p>
            </div>
            <div>
              <h4 className="font-medium">What if I don't like any recommendations?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Try rating more books, especially ones you didn't like. The system needs both positive and negative feedback to understand your taste.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Privacy */}
        <Card className="bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Your Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">
              Your reading data is used exclusively to improve your experience:
            </p>
            <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>• Recommendations are generated on our secure servers</li>
              <li>• Your specific reading data is never shared with other users</li>
              <li>• You can opt out of data collection while keeping your account</li>
              <li>• All data processing follows strict privacy guidelines</li>
            </ul>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Start Getting Great Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              You're all set! The more you use LitLens, the smarter your recommendations become.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2">
                <Star className="h-4 w-4" />
                View My Recommendations
              </Button>
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Browse Books to Rate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}