import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Settings, 
  Shield,
  ChevronDown,
  MessageSquare,
  Mail,
  Phone,
  ExternalLink,
  Send,
  Bug,
  Lightbulb
} from "lucide-react";

interface HelpCenterPageProps {
  onPageChange: (page: "contact" | "help-getting-started-account" | "help-getting-started-profile" | "help-getting-started-library" | "help-getting-started-recommendations" | "help-reading-lists-creating" | "help-reading-lists-organizing" | "help-reading-lists-sharing" | "help-reading-lists-tags" | "help-community-discussions" | "help-community-reviews" | "help-community-following" | "help-account-managing-profile" | "help-account-privacy-settings" | "help-account-notifications" | "help-account-deletion" | "help-privacy-data-policy" | "help-privacy-account-security" | "help-privacy-data-sharing" | "help-privacy-reporting") => void;
}

export function HelpCenterPage({ onPageChange }: HelpCenterPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  // Mapping of article titles to page routes
  const articleRoutes: Record<string, string> = {
    "How to create an account": "help-getting-started-account",
    "Setting up your reading profile": "help-getting-started-profile", 
    "Adding books to your library": "help-getting-started-library",
    "Understanding recommendations": "help-getting-started-recommendations",
    "Creating custom reading lists": "help-reading-lists-creating",
    "Organizing your books": "help-reading-lists-organizing",
    "Sharing lists with friends": "help-reading-lists-sharing",
    "Using tags and categories": "help-reading-lists-tags",
    "Participating in discussions": "help-community-discussions",
    "Writing book reviews": "help-community-reviews",
    "Following other readers": "help-community-following",
    "Managing your profile": "help-account-managing-profile",
    "Privacy settings": "help-account-privacy-settings",
    "Notification preferences": "help-account-notifications",
    "Deleting your account": "help-account-deletion",
    "Data privacy policy": "help-privacy-data-policy",
    "Account security": "help-privacy-account-security",
    "Managing data sharing": "help-privacy-data-sharing",
    "Reporting content": "help-privacy-reporting"
  };

  const handleArticleClick = (article: string) => {
    const route = articleRoutes[article];
    if (route) {
      onPageChange(route as any);
    }
  };
  
  // Idea form state
  const [ideaForm, setIdeaForm] = useState({
    title: "",
    description: "",
    category: "",
    impact: "medium"
  });
  
  // Bug form state
  const [bugForm, setBugForm] = useState({
    title: "",
    description: "",
    steps: "",
    expected: "",
    actual: "",
    severity: "medium",
    browser: ""
  });

  const helpCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      articles: [
        "How to create an account",
        "Setting up your reading profile",
        "Adding books to your library",
        "Understanding recommendations"
      ]
    },
    {
      id: "reading-lists",
      title: "Reading Lists & Organization",
      icon: BookOpen,
      color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      articles: [
        "Creating custom reading lists",
        "Organizing your books",
        "Sharing lists with friends",
        "Using tags and categories"
      ]
    },
    {
      id: "community",
      title: "Community Features",
      icon: Users,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
      articles: [
        "Participating in discussions",
        "Writing book reviews",
        "Following other readers"
      ]
    },
    {
      id: "account",
      title: "Account & Settings",
      icon: Settings,
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
      articles: [
        "Managing your profile",
        "Privacy settings",
        "Notification preferences",
        "Deleting your account"
      ]
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      articles: [
        "Data privacy policy",
        "Account security",
        "Managing data sharing",
        "Reporting content"
      ]
    }
  ];

  const faqItems = [
    {
      question: "How does LitLens recommend books to me?",
      answer: "LitLens uses advanced AI algorithms to analyze your reading history, ratings, and preferences. We look at books you've enjoyed, genres you prefer, and similar readers' choices to suggest books you're likely to love. The more you use the platform, the better our recommendations become."
    },
    {
      question: "Can I use LitLens for free?",
      answer: "Yes! LitLens offers a free tier that includes basic book discovery, reading lists, and community features. We also offer premium features for enhanced personalization and advanced organization tools."
    },

    {
      question: "Can I import my reading data from other platforms?",
      answer: "Yes, we support importing from popular platforms like Goodreads, StoryGraph, and others. Go to Settings &gt; Import Data to get started. This helps us provide better recommendations from day one."
    },
    {
      question: "How do I make my reading lists private?",
      answer: "When creating or editing a reading list, toggle the 'Private' option. Private lists are only visible to you and won't appear in search results or on your public profile."
    },
    {
      question: "What should I do if I encounter inappropriate content?",
      answer: "Use the report button on any content that violates our community guidelines. Our moderation team reviews all reports within 24 hours. You can also block users whose content you don't want to see."
    }
  ];

  // Form handlers
  
  const handleIdeaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaForm.title || !ideaForm.description || !ideaForm.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Simulate submission
    toast.success("Thank you for your suggestion! Our team will review it and consider it for future updates.");
    setIdeaForm({ title: "", description: "", category: "", impact: "medium" });
    setIsIdeaModalOpen(false);
  };
  
  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bugForm.title || !bugForm.description || !bugForm.steps) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Simulate submission
    toast.success("Bug report submitted successfully! Our development team will investigate the issue.");
    setBugForm({ title: "", description: "", steps: "", expected: "", actual: "", severity: "medium", browser: "" });
    setIsBugModalOpen(false);
  };

  const quickActions = [
    {
      title: "Contact Support",
      description: "Get help from our support team",
      icon: MessageSquare,
      action: "Contact Us",
      onClick: () => onPageChange("contact")
    },
    {
      title: "Feature Request",
      description: "Suggest new features",
      icon: Lightbulb,
      action: "Submit Idea",
      onClick: () => setIsIdeaModalOpen(true)
    },
    {
      title: "Bug Report",
      description: "Report technical issues",
      icon: Bug,
      action: "Report Bug",
      onClick: () => setIsBugModalOpen(true)
    }
  ];

  const filteredCategories = helpCategories.filter(category =>
    searchQuery === "" || 
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredFAQs = faqItems.filter(item =>
    searchQuery === "" ||
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Help Center</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to your questions and learn how to make the most of LitLens
        </p>
        
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" aria-hidden="true" />
          <Input
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus-visible-ring"
            aria-label="Search help articles and frequently asked questions"
            role="searchbox"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <action.icon className="h-8 w-8 text-primary mx-auto mb-3" aria-hidden="true" />
              <h3 className="font-semibold mb-2">{action.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={action.onClick}
                className="focus-visible-ring"
                aria-label={`${action.action} - ${action.description}`}
              >
                {action.action}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Categories */}
      {(!searchQuery || filteredCategories.length > 0) && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, index) => (
                      <li key={index}>
                        <button 
                          className={`text-sm transition-colors text-left w-full focus-visible-ring p-2 rounded-md ${
                            articleRoutes[article] 
                              ? "text-muted-foreground hover:text-primary cursor-pointer hover:bg-primary/5"
                              : "text-muted-foreground/60 cursor-default"
                          }`}
                          onClick={() => handleArticleClick(article)}
                          disabled={!articleRoutes[article]}
                          aria-label={articleRoutes[article] ? `Read help article: ${article}` : `${article} (article not available yet)`}
                          role={articleRoutes[article] ? "link" : "text"}
                        >
                          {article}
                          {articleRoutes[article] && (
                            <span className="ml-1 text-primary" aria-hidden="true">→</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {(!searchQuery || filteredFAQs.length > 0) && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <Card>
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full" role="region" aria-label="Frequently asked questions">
                {filteredFAQs.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="px-6">
                    <AccordionTrigger 
                      className="text-left focus-visible-ring"
                      aria-label={`Expand answer for: ${item.question}`}
                    >
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}

      {/* No Results */}
      {searchQuery && filteredCategories.length === 0 && filteredFAQs.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground mb-4">
            Try searching with different keywords or browse our categories above
          </p>
          <Button 
            onClick={() => setSearchQuery("")}
            className="focus-visible-ring"
            aria-label="Clear search and show all help articles"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Contact Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Still need help?</h3>
            <p className="text-muted-foreground">
              Our support team is here to help you with any questions or issues
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="gap-2 focus-visible-ring" aria-label="Contact support via email">
                <Mail className="h-4 w-4" aria-hidden="true" />
                Email Support
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring" aria-label="Start live chat with support">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Live Chat
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Average response time: 2-4 hours
            </p>
          </div>
        </CardContent>
      </Card>



      {/* Submit Idea Modal */}
      <Dialog open={isIdeaModalOpen} onOpenChange={setIsIdeaModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Submit Feature Idea
            </DialogTitle>
            <DialogDescription>
              Share your ideas for new features and improvements to LitLens.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleIdeaSubmit} className="space-y-4" aria-labelledby="idea-form-title">
            <div className="space-y-2">
              <Label htmlFor="idea-title">Feature Title *</Label>
              <Input
                id="idea-title"
                value={ideaForm.title}
                onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                placeholder="Short, descriptive title for your feature idea"
                className="focus-visible-ring"
                required
                aria-describedby="idea-title-help"
              />
              <p id="idea-title-help" className="sr-only">Enter a brief, descriptive title for your feature suggestion</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea-category">Category *</Label>
              <Select value={ideaForm.category} onValueChange={(value) => setIdeaForm({ ...ideaForm, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ui-ux">User Interface & Experience</SelectItem>
                  <SelectItem value="recommendations">Recommendations</SelectItem>
                  <SelectItem value="social">Social & Community</SelectItem>
                  <SelectItem value="reading-lists">Reading Lists</SelectItem>
                  <SelectItem value="search">Search & Discovery</SelectItem>
                  <SelectItem value="mobile">Mobile Experience</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea-impact">Expected Impact</Label>
              <Select value={ideaForm.impact} onValueChange={(value) => setIdeaForm({ ...ideaForm, impact: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Nice to have</SelectItem>
                  <SelectItem value="medium">Medium - Would improve experience</SelectItem>
                  <SelectItem value="high">High - Significant improvement</SelectItem>
                  <SelectItem value="critical">Critical - Essential feature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idea-description">Detailed Description *</Label>
              <Textarea
                id="idea-description"
                value={ideaForm.description}
                onChange={(e) => setIdeaForm({ ...ideaForm, description: e.target.value })}
                placeholder="Describe your feature idea in detail. What problem would it solve? How would it work?"
                rows={5}
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsIdeaModalOpen(false)}
                className="focus-visible-ring"
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2 focus-visible-ring">
                <Send className="h-4 w-4" aria-hidden="true" />
                Submit Idea
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Report Bug Modal */}
      <Dialog open={isBugModalOpen} onOpenChange={setIsBugModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-primary" />
              Report a Bug
            </DialogTitle>
            <DialogDescription>
              Help us improve LitLens by reporting any bugs or technical issues you encounter.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBugSubmit} className="space-y-4" aria-labelledby="bug-form-title">
            <div className="space-y-2">
              <Label htmlFor="bug-title">Bug Title *</Label>
              <Input
                id="bug-title"
                value={bugForm.title}
                onChange={(e) => setBugForm({ ...bugForm, title: e.target.value })}
                placeholder="Short description of the bug"
                className="focus-visible-ring"
                required
                aria-describedby="bug-title-help"
              />
              <p id="bug-title-help" className="sr-only">Enter a brief description of the bug or issue you encountered</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bug-severity">Severity</Label>
                <Select value={bugForm.severity} onValueChange={(value) => setBugForm({ ...bugForm, severity: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Minor issue</SelectItem>
                    <SelectItem value="medium">Medium - Affects functionality</SelectItem>
                    <SelectItem value="high">High - Blocks major features</SelectItem>
                    <SelectItem value="critical">Critical - App unusable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bug-browser">Browser/Device</Label>
                <Input
                  id="bug-browser"
                  value={bugForm.browser}
                  onChange={(e) => setBugForm({ ...bugForm, browser: e.target.value })}
                  placeholder="e.g., Chrome 118, Safari iOS 17"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bug-description">Bug Description *</Label>
              <Textarea
                id="bug-description"
                value={bugForm.description}
                onChange={(e) => setBugForm({ ...bugForm, description: e.target.value })}
                placeholder="Describe what went wrong..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bug-steps">Steps to Reproduce *</Label>
              <Textarea
                id="bug-steps"
                value={bugForm.steps}
                onChange={(e) => setBugForm({ ...bugForm, steps: e.target.value })}
                placeholder="1. Go to...&#10;2. Click on...&#10;3. Notice that..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bug-expected">Expected Behavior</Label>
              <Textarea
                id="bug-expected"
                value={bugForm.expected}
                onChange={(e) => setBugForm({ ...bugForm, expected: e.target.value })}
                placeholder="What did you expect to happen?"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bug-actual">Actual Behavior</Label>
              <Textarea
                id="bug-actual"
                value={bugForm.actual}
                onChange={(e) => setBugForm({ ...bugForm, actual: e.target.value })}
                placeholder="What actually happened?"
                rows={2}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsBugModalOpen(false)}
                className="focus-visible-ring"
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2 focus-visible-ring">
                <Send className="h-4 w-4" aria-hidden="true" />
                Submit Bug Report
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}