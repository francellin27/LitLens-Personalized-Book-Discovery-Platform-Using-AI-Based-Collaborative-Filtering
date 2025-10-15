import { ArrowLeft, Plus, BookOpen, List, Star, Heart, Calendar, Target, Edit3, Trash2, Eye, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpReadingListsCreatingProps {
  onBack: () => void;
}

export function HelpReadingListsCreating({ onBack }: HelpReadingListsCreatingProps) {
  const creationMethods = [
    {
      icon: Plus,
      title: "From Your Library",
      description: "Create lists directly from books you've already added to your library.",
      steps: [
        "Go to your Reading Lists page",
        "Click 'Create New List' button",
        "Enter a list name and description",
        "Select books from your library to add",
        "Choose privacy settings and save"
      ]
    },
    {
      icon: BookOpen,
      title: "While Browsing Books",
      description: "Add books to new lists as you discover them throughout the app.",
      steps: [
        "Find a book you want to add to a list",
        "Click the 'Add to List' button",
        "Select 'Create New List' option",
        "Name your list and add the book",
        "Continue adding books as you browse"
      ]
    },
    {
      icon: List,
      title: "From Templates",
      description: "Use pre-made templates for common list types to get started quickly.",
      steps: [
        "Visit the Reading Lists page",
        "Click 'Browse Templates'",
        "Choose from popular list types",
        "Customize the template name",
        "Add your own books to personalize"
      ]
    }
  ];

  const listTypes = [
    {
      icon: Target,
      title: "Goal-Based Lists",
      description: "Track reading challenges and objectives",
      examples: ["2024 Reading Challenge", "Summer Reading Goals", "Classic Literature Journey"],
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
    },
    {
      icon: Heart,
      title: "Mood & Theme Lists",
      description: "Organize books by feeling or topic",
      examples: ["Cozy Mysteries", "Feel-Good Reads", "Books That Made Me Cry"],
      color: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
    },
    {
      icon: Calendar,
      title: "Time-Based Lists",
      description: "Plan your reading by seasons or occasions",
      examples: ["Beach Reads", "Holiday Stories", "Back to School Books"],
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
    },
    {
      icon: Star,
      title: "Quality & Favorites",
      description: "Curate your best and most recommended books",
      examples: ["5-Star Favorites", "Hidden Gems", "Books to Recommend"],
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
    }
  ];

  const managementFeatures = [
    {
      icon: Edit3,
      title: "Edit List Details",
      description: "Update list names, descriptions, and settings anytime"
    },
    {
      icon: Eye,
      title: "Privacy Controls",
      description: "Make lists public, private, or shared with specific friends"
    },
    {
      icon: Users,
      title: "Collaborative Lists",
      description: "Allow friends to contribute books to shared lists"
    },
    {
      icon: Trash2,
      title: "List Management",
      description: "Archive, delete, or merge lists as your reading evolves"
    }
  ];

  const tips = [
    {
      title: "Start with broad categories",
      description: "Create general lists first, then get more specific as you add more books."
    },
    {
      title: "Use descriptive names",
      description: "Clear, specific names help you find the right list when you need it."
    },
    {
      title: "Add descriptions",
      description: "Include notes about what types of books belong in each list."
    },
    {
      title: "Review and update regularly",
      description: "Clean up lists periodically and remove books you're no longer interested in."
    },
    {
      title: "Don't over-organize",
      description: "A few well-maintained lists are better than many unused ones."
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
          <h1 className="text-3xl font-bold mb-4">Creating Custom Reading Lists</h1>
          <p className="text-muted-foreground text-lg">
            Reading lists help you organize books by theme, mood, goals, or any category that makes sense for your reading journey. Learn how to create and customize lists that work for you.
          </p>
        </div>

        {/* How to Create Lists */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Ways to Create Reading Lists</h2>
          <div className="grid gap-6">
            {creationMethods.map((method, index) => (
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

        {/* List Types and Ideas */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Popular List Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listTypes.map((type, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${type.color}`}>
                      <type.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{type.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Examples:</p>
                        {type.examples.map((example, exampleIndex) => (
                          <Badge key={exampleIndex} variant="outline" className="text-xs mr-1 mb-1">
                            {example}
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

        {/* Quick Setup Guide */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">Quick Setup Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Essential Information:</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Choose a clear, descriptive name</li>
                  <li>• Add a brief description of the list's purpose</li>
                  <li>• Select appropriate privacy settings</li>
                  <li>• Add your first few books to get started</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Optional Settings:</h4>
                <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>• Set a reading goal or deadline</li>
                  <li>• Choose a custom cover image</li>
                  <li>• Enable collaborative editing</li>
                  <li>• Add tags for better organization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Features */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Managing Your Lists</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managementFeatures.map((feature, index) => (
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

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Privacy and Sharing Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Eye className="h-4 w-4" />
                </div>
                <h4 className="font-medium">Public</h4>
                <p className="text-xs text-muted-foreground">Anyone can view and discover your list</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <h4 className="font-medium">Friends Only</h4>
                <p className="text-xs text-muted-foreground">Only your friends can see the list</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Eye className="h-4 w-4 opacity-50" />
                </div>
                <h4 className="font-medium">Private</h4>
                <p className="text-xs text-muted-foreground">Only you can see and access the list</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Pro Tips for Effective Reading Lists</CardTitle>
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

        {/* Common Use Cases */}
        <Card>
          <CardHeader>
            <CardTitle>Common Use Cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Reading Challenges</h4>
                <p className="text-sm text-muted-foreground mb-2">Track progress on specific reading goals:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• "50 Books in 2024"</li>
                  <li>• "Women Authors Only"</li>
                  <li>• "Debut Novels"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Mood-Based Reading</h4>
                <p className="text-sm text-muted-foreground mb-2">Lists for different occasions:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• "When I Need Comfort"</li>
                  <li>• "Rainy Day Reads"</li>
                  <li>• "Quick Weekend Books"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Series Tracking</h4>
                <p className="text-sm text-muted-foreground mb-2">Keep track of book series:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• "Series to Complete"</li>
                  <li>• "Fantasy Epics in Progress"</li>
                  <li>• "Mystery Series Backlog"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <p className="text-sm text-muted-foreground mb-2">Organize suggestions from others:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• "Friend Recommendations"</li>
                  <li>• "Book Club Picks"</li>
                  <li>• "Award Winners to Read"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Ready to Organize?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Now that you know how to create lists, learn how to organize and manage your growing collection:
            </p>
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Learn About Organizing Your Books
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}