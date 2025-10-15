import { ArrowLeft, Tag, Hash, Folder, Filter, Search, Palette, Zap, Target, BookOpen, Star, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpReadingListsTagsProps {
  onBack: () => void;
}

export function HelpReadingListsTags({ onBack }: HelpReadingListsTagsProps) {
  const tagTypes = [
    {
      icon: BookOpen,
      title: "Genre Tags",
      description: "Classify books by their literary genre and subgenre",
      examples: ["Mystery", "Romance", "Sci-Fi", "Historical Fiction", "Urban Fantasy", "Cozy Mystery"],
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      tips: "Use both broad genres and specific subgenres for better filtering"
    },
    {
      icon: Palette,
      title: "Mood Tags",
      description: "Tag books based on the emotional experience they provide",
      examples: ["Uplifting", "Dark", "Cozy", "Intense", "Heartwarming", "Thought-provoking"],
      color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
      tips: "Consider how books made you feel, not just their plot"
    },
    {
      icon: Target,
      title: "Theme Tags",
      description: "Identify recurring themes and subjects in your books",
      examples: ["Coming-of-age", "Family drama", "Time travel", "Friendship", "Self-discovery", "Social justice"],
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      tips: "Focus on deeper meaning and messages rather than surface plot"
    },
    {
      icon: Clock,
      title: "Context Tags",
      description: "Tag books based on when, where, or how you read them",
      examples: ["Beach read", "Commute book", "Bedtime story", "Book club pick", "Reread", "Gift from friend"],
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      tips: "These help you remember the circumstances and find similar experiences"
    },
    {
      icon: Star,
      title: "Quality Tags",
      description: "Mark books based on your personal assessment",
      examples: ["Life-changing", "Hidden gem", "Overrated", "Quick read", "Page-turner", "Couldn't finish"],
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      tips: "Be honest about your reactions - it helps with future book selection"
    }
  ];

  const bestPractices = [
    {
      title: "Keep tags consistent",
      description: "Use the same spelling and format for tags across your library",
      example: "Use 'sci-fi' consistently rather than mixing 'sci-fi', 'science fiction', and 'SF'"
    },
    {
      title: "Don't over-tag",
      description: "3-7 tags per book is usually sufficient for effective organization",
      example: "Instead of 15 tags, focus on the most important genres, moods, and themes"
    },
    {
      title: "Use a mix of tag types",
      description: "Combine different tag categories for comprehensive organization",
      example: "A book might have: 'mystery', 'cozy', 'small-town', 'series', 'comfort-read'"
    },
    {
      title: "Review and update regularly",
      description: "Clean up your tag system periodically to maintain organization",
      example: "Monthly, check for duplicate tags and merge similar ones"
    },
    {
      title: "Create tag hierarchies",
      description: "Use general and specific tags together for flexible filtering",
      example: "Tag with both 'fantasy' and 'urban fantasy' for broad and narrow searches"
    }
  ];

  const tagStrategies = [
    {
      title: "The Minimalist System",
      description: "Focus on essential tags only",
      tags: ["Genre", "Rating", "Status", "Mood"],
      pros: ["Simple to maintain", "Quick to apply", "Easy to remember"],
      cons: ["Less detailed filtering", "Harder to find specific books"]
    },
    {
      title: "The Comprehensive System",
      description: "Detailed tagging for every aspect",
      tags: ["Genre", "Subgenre", "Mood", "Theme", "Setting", "Length", "Series", "Awards"],
      pros: ["Extremely searchable", "Great for large collections", "Detailed organization"],
      cons: ["Time-intensive", "Can be overwhelming", "Easy to inconsistently apply"]
    },
    {
      title: "The Flexible System",
      description: "Adapt tags based on individual books",
      tags: ["Core genres + custom tags per book"],
      pros: ["Adapts to your reading", "Captures unique aspects", "Grows with your library"],
      cons: ["Can become inconsistent", "Requires regular cleanup", "May create too many unique tags"]
    }
  ];

  const advancedFeatures = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Use tags in powerful search combinations",
      examples: ["Find all 'cozy mystery' books rated 4+ stars", "Show 'romance' books tagged 'comfort-read'"]
    },
    {
      icon: Filter,
      title: "Multi-Tag Filtering",
      description: "Combine multiple tags for precise filtering",
      examples: ["Books tagged 'historical' AND 'strong-female-lead'", "'Fantasy' OR 'sci-fi' books under 300 pages"]
    },
    {
      icon: Zap,
      title: "Auto-Suggestions",
      description: "Get tag recommendations based on book metadata",
      examples: ["Suggest genre tags from book descriptions", "Recommend mood tags from similar books"]
    },
    {
      icon: Hash,
      title: "Tag Analytics",
      description: "See patterns in your reading through tag analysis",
      examples: ["Most-used tags", "Reading trends over time", "Tag combinations you prefer"]
    }
  ];

  const commonTags = {
    "Genre": ["Fiction", "Non-fiction", "Mystery", "Romance", "Fantasy", "Sci-Fi", "Historical", "Biography"],
    "Mood": ["Light", "Dark", "Cozy", "Intense", "Uplifting", "Emotional", "Funny", "Serious"],
    "Length": ["Quick read", "Short", "Medium", "Long", "Epic", "Novella", "Series"],
    "Setting": ["Contemporary", "Historical", "Futuristic", "Urban", "Rural", "International", "Small town"],
    "Character": ["Strong female lead", "Unreliable narrator", "Ensemble cast", "Coming of age", "Anti-hero"],
    "Style": ["Literary", "Commercial", "Experimental", "Traditional", "Epistolary", "Multiple POV"]
  };

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
          <h1 className="text-3xl font-bold mb-4">Using Tags and Categories</h1>
          <p className="text-muted-foreground text-lg">
            Tags are the secret to finding exactly the right book at the right time. Master the art of tagging to create a searchable, organized library that adapts to your reading moods and needs.
          </p>
        </div>

        {/* Tag Types */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Types of Tags</h2>
          <div className="space-y-4">
            {tagTypes.map((type, index) => (
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
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {type.examples.map((example, exampleIndex) => (
                      <Badge key={exampleIndex} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> {type.tips}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Add Tags */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">How to Add and Manage Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Adding Tags:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>Open a book's detail page</li>
                  <li>Find the "Tags" section</li>
                  <li>Type new tags or select from suggestions</li>
                  <li>Press Enter or click "Add" to save</li>
                  <li>Tags are automatically saved</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Bulk Tagging:</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Select multiple books in your library</li>
                  <li>• Use "Bulk Actions" menu</li>
                  <li>• Add tags to all selected books at once</li>
                  <li>• Great for organizing book series</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tagging Strategies */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Tagging Strategies</h2>
          <div className="grid gap-4">
            {tagStrategies.map((strategy, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{strategy.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <div>
                      <h5 className="text-xs font-medium mb-1">Tag Types:</h5>
                      <div className="flex flex-wrap gap-1">
                        {strategy.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium mb-1 text-green-700 dark:text-green-300">Pros:</h5>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {strategy.pros.map((pro, proIndex) => (
                          <li key={proIndex}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium mb-1 text-orange-700 dark:text-orange-300">Cons:</h5>
                      <ul className="text-xs text-muted-foreground space-y-0.5">
                        {strategy.cons.map((con, conIndex) => (
                          <li key={conIndex}>• {con}</li>
                        ))}
                      </ul>
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
              <Tag className="h-5 w-5" />
              Tagging Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {bestPractices.map((practice, index) => (
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
                  <div className="ml-9 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
                    <strong>Example:</strong> {practice.example}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Advanced Tag Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advancedFeatures.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
                      <div className="space-y-1">
                        {feature.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Common Tag Library */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Tag Examples</CardTitle>
            <p className="text-sm text-muted-foreground">
              Use these common tags as inspiration for your own tagging system:
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(commonTags).map(([category, tags]) => (
              <div key={category}>
                <h4 className="font-medium mb-2">{category}</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tag Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Managing Your Tag System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Regular Maintenance:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Review and merge duplicate tags</li>
                  <li>• Fix spelling inconsistencies</li>
                  <li>• Remove unused or outdated tags</li>
                  <li>• Standardize tag naming conventions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tag Analytics:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• See which tags you use most often</li>
                  <li>• Identify reading patterns and preferences</li>
                  <li>• Find gaps in your tagging system</li>
                  <li>• Discover books with similar tags</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Common Tagging Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">I have too many similar tags</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Use the tag management tools to merge similar tags (e.g., combine "sci-fi", "science fiction", and "SF" into one consistent tag).
              </p>
            </div>
            <div>
              <h4 className="font-medium">I can't find books with my tags</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Check your search and filter settings. Make sure you're searching in the right scope (all books vs. specific lists) and using the correct tag spelling.
              </p>
            </div>
            <div>
              <h4 className="font-medium">My tags are inconsistent</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Set up a personal tagging guide with your preferred spellings and categories. Review your library monthly to maintain consistency.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Success Story */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Master Your Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              With a well-organized tagging system, you'll never struggle to find the perfect book for your mood again. Your reading journey becomes more intentional and satisfying.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Explore Your Tagged Books
              </Button>
              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Try Advanced Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}