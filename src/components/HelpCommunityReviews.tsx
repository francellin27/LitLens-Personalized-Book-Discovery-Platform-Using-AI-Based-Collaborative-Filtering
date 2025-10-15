import { ArrowLeft, Star, Edit3, Eye, BookOpen, Users, ThumbsUp, MessageCircle, Share2, Award } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpCommunityReviewsProps {
  onBack: () => void;
}

export function HelpCommunityReviews({ onBack }: HelpCommunityReviewsProps) {
  const reviewTypes = [
    {
      icon: Star,
      title: "Star Rating Only",
      description: "Quick rating without detailed commentary",
      length: "Instant",
      bestFor: "Books you want to rate but don't have much to say about",
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
    },
    {
      icon: MessageCircle,
      title: "Brief Review",
      description: "Short thoughts and overall impression",
      length: "1-3 sentences",
      bestFor: "Quick recommendations or warnings to friends",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      icon: Edit3,
      title: "Detailed Review",
      description: "Comprehensive analysis covering multiple aspects",
      length: "1-3 paragraphs",
      bestFor: "Books that made a strong impression or complex works",
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    },
    {
      icon: Award,
      title: "In-Depth Analysis",
      description: "Thorough examination of themes, style, and impact",
      length: "Multiple paragraphs",
      bestFor: "Literary works, book club discussions, or personal favorites",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    }
  ];

  const reviewElements = [
    {
      element: "Opening Hook",
      description: "Start with what grabbed you most about the book",
      examples: ["A powerful quote", "Your emotional reaction", "What surprised you"],
      importance: "High"
    },
    {
      element: "Plot Summary",
      description: "Brief, spoiler-free overview of the story",
      examples: ["Genre and setting", "Main character's journey", "Central conflict"],
      importance: "Medium"
    },
    {
      element: "What Worked",
      description: "Specific elements you enjoyed",
      examples: ["Character development", "Writing style", "Unique concepts"],
      importance: "High"
    },
    {
      element: "What Didn't Work",
      description: "Areas where the book fell short for you",
      examples: ["Pacing issues", "Weak characters", "Confusing plot"],
      importance: "Medium"
    },
    {
      element: "Who Should Read It",
      description: "Audience recommendations",
      examples: ["Fans of specific authors/genres", "Readers seeking certain themes", "Experience level needed"],
      importance: "High"
    },
    {
      element: "Overall Impression",
      description: "Final thoughts and rating justification",
      examples: ["Lasting impact", "Recommendation strength", "Personal significance"],
      importance: "High"
    }
  ];

  const writingTips = [
    {
      title: "Be honest but fair",
      description: "Share your genuine opinion while recognizing that taste is subjective.",
      example: "Instead of 'This book is terrible,' try 'This didn't work for me because...'"
    },
    {
      title: "Support your opinions",
      description: "Give specific examples from the book to back up your points.",
      example: "Rather than 'The characters were flat,' explain what made them feel one-dimensional to you."
    },
    {
      title: "Consider your audience",
      description: "Think about who will read your review and what they want to know.",
      example: "Include content warnings for sensitive topics that might affect readers."
    },
    {
      title: "Avoid major spoilers",
      description: "Keep plot details vague or use spoiler tags for major reveals.",
      example: "Focus on emotions and themes rather than specific plot points."
    },
    {
      title: "Write for yourself too",
      description: "Reviews help you remember and process your reading experience.",
      example: "Include personal connections and how the book affected you."
    }
  ];

  const ratingGuidelines = [
    {
      stars: 5,
      title: "Outstanding",
      description: "Books that exceed expectations and leave a lasting impact",
      criteria: ["Exceptional in multiple areas", "Would enthusiastically recommend", "Likely to reread"],
      color: "text-yellow-600"
    },
    {
      stars: 4,
      title: "Very Good",
      description: "Solid books with minor flaws that you'd recommend",
      criteria: ["Strong in most areas", "Would recommend to right audience", "Enjoyable read"],
      color: "text-yellow-600"
    },
    {
      stars: 3,
      title: "Good",
      description: "Decent books with both strengths and weaknesses",
      criteria: ["Mixed feelings", "Some good elements", "Okay but not memorable"],
      color: "text-yellow-600"
    },
    {
      stars: 2,
      title: "Fair",
      description: "Books with significant issues but some redeeming qualities",
      criteria: ["More problems than positives", "Wouldn't generally recommend", "Had potential but missed"],
      color: "text-gray-600"
    },
    {
      stars: 1,
      title: "Poor",
      description: "Books that didn't work for you in most ways",
      criteria: ["Major issues throughout", "Would actively discourage reading", "Failed to engage"],
      color: "text-gray-600"
    }
  ];

  const reviewStructure = [
    {
      section: "Opening",
      content: "Hook the reader with your strongest impression or most interesting observation",
      wordCount: "1-2 sentences"
    },
    {
      section: "Context",
      content: "Brief setup - genre, author, what drew you to the book",
      wordCount: "1-2 sentences"
    },
    {
      section: "Summary",
      content: "Spoiler-free overview of plot/premise",
      wordCount: "2-3 sentences"
    },
    {
      section: "Analysis",
      content: "What worked, what didn't, specific examples",
      wordCount: "1-2 paragraphs"
    },
    {
      section: "Recommendation",
      content: "Who should read it, rating justification",
      wordCount: "1-2 sentences"
    }
  ];

  const commonMistakes = [
    {
      mistake: "Spoiling major plot points",
      solution: "Keep plot details vague and use spoiler tags when necessary"
    },
    {
      mistake: "Being overly harsh or mean",
      solution: "Critique the work, not the author, and acknowledge that others may disagree"
    },
    {
      mistake: "Not explaining your rating",
      solution: "Connect your star rating to specific aspects of the book"
    },
    {
      mistake: "Writing only plot summary",
      solution: "Focus more on your thoughts and reactions than retelling the story"
    },
    {
      mistake: "Comparing everything to other books",
      solution: "Judge the book on its own merits, with minimal comparisons"
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
          <h1 className="text-3xl font-bold mb-4">Writing Book Reviews</h1>
          <p className="text-muted-foreground text-lg">
            Book reviews help other readers discover great books and make informed choices. Learn how to write thoughtful, helpful reviews that contribute meaningfully to the reading community.
          </p>
        </div>

        {/* Types of Reviews */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Types of Reviews</h2>
          <div className="grid gap-4">
            {reviewTypes.map((type, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${type.color}`}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{type.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {type.length}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-normal">{type.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Best for:</strong> {type.bestFor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Star Rating System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Understanding Star Ratings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ratingGuidelines.map((rating, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex items-center gap-1 flex-shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating.stars 
                          ? `${rating.color} fill-current` 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{rating.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{rating.description}</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {rating.criteria.map((criterion, criterionIndex) => (
                      <li key={criterionIndex} className="flex items-start gap-1">
                        <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 flex-shrink-0" />
                        {criterion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Review Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Key Elements of a Good Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {reviewElements.map((element, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{element.element}</h4>
                      <Badge 
                        variant={element.importance === 'High' ? 'default' : 'secondary'} 
                        className="text-xs"
                      >
                        {element.importance}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{element.description}</p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Examples:</p>
                      <div className="flex flex-wrap gap-1">
                        {element.examples.map((example, exampleIndex) => (
                          <Badge key={exampleIndex} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Writing Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Writing Tips for Better Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {writingTips.map((tip, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                  <div className="ml-9 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                    <strong>Example:</strong> {tip.example}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Review Structure */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Suggested Review Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewStructure.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-medium flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">{item.section}</h4>
                    <Badge variant="outline" className="text-xs text-blue-700 dark:text-blue-300">
                      {item.wordCount}
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200">{item.content}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Review Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Review Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Brief Review Example</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-yellow-600 fill-current" />
                    ))}
                    <Star className="h-3 w-3 text-gray-300" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  "A delightful cozy mystery that kept me guessing until the end. The small-town setting felt authentic and the amateur sleuth was relatable without being annoying. Perfect for fans of Louise Penny who want something a bit lighter."
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Detailed Review Opening</h4>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-yellow-600 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  "I picked up this book expecting a typical fantasy adventure, but what I found was a profound meditation on grief, family, and the stories we tell ourselves. The author's prose is luminous, particularly in the quiet moments between action sequences. While the pacing drags slightly in the middle section, the payoff is absolutely worth it..."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Common Mistakes */}
        <Card>
          <CardHeader>
            <CardTitle>Common Review Mistakes to Avoid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {commonMistakes.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-600 dark:text-red-300 text-sm">✗</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-red-700 dark:text-red-300">{item.mistake}</h4>
                  <p className="text-sm text-muted-foreground">{item.solution}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Review Visibility and Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Review Visibility and Sharing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Who Can See Your Reviews:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• All LitLens users (public reviews)</li>
                  <li>• Your followers automatically</li>
                  <li>• Book club members for shared reads</li>
                  <li>• Anyone searching for that book</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Review Features:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Others can like and comment on reviews</li>
                  <li>• Share reviews on social media</li>
                  <li>• Edit or delete your reviews anytime</li>
                  <li>• Track views and engagement</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Review Ethics */}
        <Card>
          <CardHeader>
            <CardTitle>Review Ethics and Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2 text-green-700 dark:text-green-300">Good Practice:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Only review books you've actually read</li>
                  <li>• Be honest about your reading experience</li>
                  <li>• Consider the book's intended audience</li>
                  <li>• Respect authors as real people</li>
                  <li>• Update reviews if your opinion changes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-red-700 dark:text-red-300">Avoid:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Personal attacks on authors</li>
                  <li>• Reviews based on prejudice or bias</li>
                  <li>• Fake reviews for friends or enemies</li>
                  <li>• Excessive criticism without explanation</li>
                  <li>• Spoilers disguised as analysis</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Build Your Reviewing Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Ready to share your reviews with the community? Learn how to connect with other readers and build your network:
            </p>
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Learn About Following Other Readers
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}