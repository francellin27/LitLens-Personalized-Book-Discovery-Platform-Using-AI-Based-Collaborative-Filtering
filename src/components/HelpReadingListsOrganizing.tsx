import { ArrowLeft, BookOpen, Tag, FolderOpen, Filter, Star, Clock, Calendar, ArrowUpDown, Grid, List as ListIcon, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpReadingListsOrganizingProps {
  onBack: () => void;
}

export function HelpReadingListsOrganizing({ onBack }: HelpReadingListsOrganizingProps) {
  const organizationMethods = [
    {
      icon: BookOpen,
      title: "Reading Status",
      description: "The foundation of book organization - track where you are with each book.",
      categories: [
        { name: "Want to Read", color: "bg-blue-100 text-blue-700", description: "Books on your wishlist" },
        { name: "Currently Reading", color: "bg-green-100 text-green-700", description: "Books you're actively reading" },
        { name: "Read", color: "bg-purple-100 text-purple-700", description: "Completed books" },
        { name: "Did Not Finish", color: "bg-orange-100 text-orange-700", description: "Books you stopped reading" }
      ]
    },
    {
      icon: Tag,
      title: "Custom Tags",
      description: "Create your own labels to categorize books by any criteria that matters to you.",
      categories: [
        { name: "Genres", color: "bg-pink-100 text-pink-700", description: "Mystery, Romance, Sci-Fi, etc." },
        { name: "Moods", color: "bg-cyan-100 text-cyan-700", description: "Cozy, Dark, Uplifting, etc." },
        { name: "Themes", color: "bg-indigo-100 text-indigo-700", description: "Coming-of-age, Family, Adventure" },
        { name: "Personal", color: "bg-yellow-100 text-yellow-700", description: "Favorites, Comfort reads, Re-read" }
      ]
    },
    {
      icon: Star,
      title: "Ratings & Reviews",
      description: "Use your personal ratings to organize books by quality and preference.",
      categories: [
        { name: "5-Star Favorites", color: "bg-yellow-100 text-yellow-700", description: "Your absolute favorites" },
        { name: "Hidden Gems", color: "bg-emerald-100 text-emerald-700", description: "Great books others might miss" },
        { name: "Disappointing", color: "bg-red-100 text-red-700", description: "Books that didn't meet expectations" },
        { name: "Worth Recommending", color: "bg-blue-100 text-blue-700", description: "Books you'd suggest to others" }
      ]
    }
  ];

  const viewingOptions = [
    {
      icon: Grid,
      title: "Grid View",
      description: "See book covers in a visual grid layout",
      bestFor: "Browsing and visual recognition"
    },
    {
      icon: ListIcon,
      title: "List View",
      description: "Compact list with title, author, and key details",
      bestFor: "Quick scanning and text-based browsing"
    },
    {
      icon: ArrowUpDown,
      title: "Detailed View",
      description: "Full information including descriptions and ratings",
      bestFor: "Comparing books and making decisions"
    }
  ];

  const sortingOptions = [
    {
      option: "Date Added",
      description: "See your most recently added books first",
      icon: Calendar
    },
    {
      option: "Title (A-Z)",
      description: "Alphabetical order by book title",
      icon: ArrowUpDown
    },
    {
      option: "Author",
      description: "Group books by author name",
      icon: ArrowUpDown
    },
    {
      option: "Rating",
      description: "Sort by your personal ratings",
      icon: Star
    },
    {
      option: "Publication Date",
      description: "Chronological by when books were published",
      icon: Calendar
    },
    {
      option: "Page Count",
      description: "Sort by book length",
      icon: BookOpen
    }
  ];

  const filteringTips = [
    {
      title: "Use Multiple Filters",
      description: "Combine genre, rating, and reading status filters to find exactly what you want."
    },
    {
      title: "Save Common Searches",
      description: "Bookmark frequently used filter combinations for quick access."
    },
    {
      title: "Filter by Date",
      description: "Find books added in specific time periods or published in certain years."
    },
    {
      title: "Length-Based Filtering",
      description: "Filter by page count when you want something quick or epic."
    }
  ];

  const organizationStrategies = [
    {
      title: "The Minimalist Approach",
      description: "Keep it simple with just reading status and a few key tags",
      tags: ["Status-based", "5-10 custom tags", "Rating system"]
    },
    {
      title: "The Genre Enthusiast",
      description: "Organize primarily by genres and subgenres",
      tags: ["Detailed genre tags", "Mood-based categories", "Theme collections"]
    },
    {
      title: "The Collector",
      description: "Detailed organization with multiple categorization systems",
      tags: ["Comprehensive tagging", "Multiple reading lists", "Series tracking"]
    },
    {
      title: "The Goal-Oriented Reader",
      description: "Focus on reading challenges and objectives",
      tags: ["Challenge-based lists", "Time-bound goals", "Progress tracking"]
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
          <h1 className="text-3xl font-bold mb-4">Organizing Your Books</h1>
          <p className="text-muted-foreground text-lg">
            Transform your book collection from chaos to clarity. Learn effective strategies to organize, sort, and filter your books so you can always find exactly what you're looking for.
          </p>
        </div>

        {/* Organization Methods */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Organization Methods</h2>
          <div className="space-y-6">
            {organizationMethods.map((method, index) => (
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
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {method.categories.map((category, catIndex) => (
                      <div key={catIndex} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Badge variant="secondary" className={`${category.color} text-xs`}>
                          {category.name}
                        </Badge>
                        <p className="text-sm text-muted-foreground flex-1">{category.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Viewing Options */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Viewing Your Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {viewingOptions.map((option, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  <Badge variant="outline" className="text-xs">
                    {option.bestFor}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sorting and Filtering */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Sorting and Filtering Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Sort Your Books By:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sortingOptions.map((sort, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <sort.icon className="h-4 w-4 text-primary" />
                    <div>
                      <h5 className="font-medium text-sm">{sort.option}</h5>
                      <p className="text-xs text-muted-foreground">{sort.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Advanced Filtering Tips:</h4>
              <div className="grid gap-3">
                {filteringTips.map((tip, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">{tip.title}</h5>
                      <p className="text-xs text-muted-foreground">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Functionality */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Smart Search Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Search by Content:</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Book titles and subtitles</li>
                  <li>• Author names</li>
                  <li>• Your personal notes and reviews</li>
                  <li>• Tags and custom labels</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Search Tips:</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Use quotes for exact phrases</li>
                  <li>• Search within specific lists</li>
                  <li>• Combine search with filters</li>
                  <li>• Save frequent searches</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Strategies */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Organization Strategies</h2>
          <p className="text-muted-foreground">
            Choose an approach that matches your reading style and collection size:
          </p>
          <div className="grid gap-4">
            {organizationStrategies.map((strategy, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{strategy.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {strategy.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Organization Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Bulk Operations</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Select multiple books to add tags</li>
                  <li>• Move books between reading lists</li>
                  <li>• Update reading status for several books</li>
                  <li>• Apply ratings to multiple titles</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Smart Suggestions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Auto-suggest tags based on genres</li>
                  <li>• Recommend lists for similar books</li>
                  <li>• Identify duplicate entries</li>
                  <li>• Suggest books to move from wishlist</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Keeping Your Organization Current
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <h4 className="font-medium">Monthly Review</h4>
                <p className="text-sm text-muted-foreground">
                  Spend 15-20 minutes each month cleaning up tags, updating reading progress, and reorganizing lists that have grown too large.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Seasonal Updates</h4>
                <p className="text-sm text-muted-foreground">
                  Quarterly, review your organization system. Remove unused tags, merge similar lists, and adjust your approach based on how your reading habits have evolved.
                </p>
              </div>
              <div>
                <h4 className="font-medium">As You Read</h4>
                <p className="text-sm text-muted-foreground">
                  Make organization part of your reading routine. Update status, add ratings, and apply tags as soon as you finish a book while it's fresh in your mind.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Ready to Share?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Once your books are organized, you might want to share your favorite lists with friends:
            </p>
            <Button variant="outline" className="gap-2">
              <FolderOpen className="h-4 w-4" />
              Learn About Sharing Lists
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}