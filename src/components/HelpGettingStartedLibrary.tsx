import { ArrowLeft, Search, BookPlus, List, Star, BookOpen, Heart, Clock, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpGettingStartedLibraryProps {
  onBack: () => void;
}

export function HelpGettingStartedLibrary({ onBack }: HelpGettingStartedLibraryProps) {
  const methods = [
    {
      icon: Search,
      title: "Search for Books",
      description: "Use the search function to find specific books by title, author, or genre.",
      steps: [
        "Click the search icon in the navigation bar",
        "Enter the book title, author name, or keywords",
        "Browse through the search results",
        "Click on a book to view details and add it to your library"
      ]
    },
    {
      icon: BookOpen,
      title: "Browse by Category",
      description: "Explore books by genre, popularity, or release date.",
      steps: [
        "Go to the 'Browse' section from the main menu",
        "Select a genre or category that interests you",
        "Use filters to narrow down results",
        "Add books that catch your eye to your library"
      ]
    },
    {
      icon: Star,
      title: "From Recommendations",
      description: "Add books from your personalized recommendation feed.",
      steps: [
        "Visit the 'Recommendations' page",
        "Browse through AI-curated suggestions",
        "Click 'Add to Library' on books you want to read",
        "Rate books you've read to improve future recommendations"
      ]
    }
  ];

  const readingStates = [
    {
      icon: List,
      title: "Want to Read",
      description: "Books you plan to read in the future",
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      icon: BookOpen,
      title: "Currently Reading",
      description: "Books you're actively reading right now",
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    },
    {
      icon: CheckCircle,
      title: "Read",
      description: "Books you've finished reading",
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
    },
    {
      icon: Heart,
      title: "Favorites",
      description: "Books you absolutely loved and want to remember",
      color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
    }
  ];

  const tips = [
    {
      title: "Start with books you've already read",
      description: "Add familiar titles to help the recommendation system understand your preferences."
    },
    {
      title: "Rate books honestly",
      description: "Your ratings help improve recommendations for both you and other users."
    },
    {
      title: "Use reading lists",
      description: "Organize books into custom lists like 'Summer Reading' or 'Mystery Novels'."
    },
    {
      title: "Import from other platforms",
      description: "If you use Goodreads or other platforms, you can import your existing library."
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
          <h1 className="text-3xl font-bold mb-4">Adding Books to Your Library</h1>
          <p className="text-muted-foreground text-lg">
            Building your personal library is the foundation of getting great recommendations. Here's how to add books and organize them effectively.
          </p>
        </div>

        {/* Methods to Add Books */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Ways to Add Books</h2>
          <div className="grid gap-6">
            {methods.map((method, index) => (
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
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    {method.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="text-muted-foreground">
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reading States */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Understanding Reading States</h2>
          <p className="text-muted-foreground">
            When you add a book to your library, you can categorize it based on your reading progress:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readingStates.map((state, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${state.color}`}>
                      <state.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{state.title}</h3>
                      <p className="text-sm text-muted-foreground">{state.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-900 dark:text-green-100">Quick Library Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">From Book Details:</h4>
                <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
                  <li>• Click "Add to Library" button</li>
                  <li>• Select reading state</li>
                  <li>• Rate and review (optional)</li>
                  <li>• Add to custom reading lists</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Bulk Actions:</h4>
                <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
                  <li>• Import from other platforms</li>
                  <li>• Add multiple books at once</li>
                  <li>• Update reading progress</li>
                  <li>• Organize into collections</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Rating Your Books
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Rating books helps improve recommendations for you and the community:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="p-4 border rounded-lg">
                  <div className="flex justify-center mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm font-medium">{rating} Star{rating !== 1 ? 's' : ''}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {rating === 1 && "Didn't like"}
                    {rating === 2 && "It was okay"}
                    {rating === 3 && "Liked it"}
                    {rating === 4 && "Really liked"}
                    {rating === 5 && "Absolutely loved"}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Pro Tips for Building Your Library</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {tips.map((tip, index) => (
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

        {/* Managing Your Library */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              Managing Your Library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Organizing Books</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Create custom reading lists to organize books by theme, genre, or any category you choose. You can have multiple lists and books can appear in several lists.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Updating Reading Progress</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Easily move books between reading states as you progress. Mark books as "Currently Reading" when you start, and "Read" when you finish.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Privacy Settings</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Control who can see your library and reading activity. You can make your entire library private or choose to share only certain lists.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              With books in your library, you're ready to explore personalized recommendations:
            </p>
            <Button variant="outline" className="gap-2">
              <Star className="h-4 w-4" />
              Learn About Recommendations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}