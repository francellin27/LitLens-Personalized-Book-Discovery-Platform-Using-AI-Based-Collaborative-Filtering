import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  HelpCircle,
  Bug,
  Lightbulb,
  Shield,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ContactUsPageProps {
  onPageChange?: (page: "help" | "help-getting-started-account" | "help-getting-started-profile" | "help-getting-started-library" | "help-getting-started-recommendations" | "help-reading-lists-creating" | "help-reading-lists-organizing" | "help-reading-lists-sharing" | "help-reading-lists-tags" | "help-community-discussions" | "help-community-reviews" | "help-community-following") => void;
}

export function ContactUsPage({ onPageChange }: ContactUsPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Message sent successfully! We'll get back to you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: ""
    });
    setIsSubmitting(false);
  };

  const contactCategories = [
    { value: "general", label: "General Question", icon: HelpCircle },
    { value: "technical", label: "Technical Support", icon: Bug },
    { value: "feature", label: "Feature Request", icon: Lightbulb },
    { value: "privacy", label: "Privacy & Security", icon: Shield },
    { value: "feedback", label: "Feedback", icon: MessageSquare }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get comprehensive help via email with detailed responses",
      contact: "support@litlens.com",
      availability: "24/7 - Average response: 4-6 hours",
      color: "text-blue-600",
      benefits: [
        "Detailed technical support",
        "Screen sharing and file attachments",
        "Priority queue for urgent issues",
        "Full conversation history"
      ],
      whenToUse: "Best for complex technical issues, account problems, or when you need detailed documentation"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our expert support team",
      contact: "+63 0912 345 6789",
      availability: "Mon-Fri, 10 AM - 5 PM EST",
      color: "text-purple-600",
      benefits: [
        "Immediate real-time assistance",
        "Personal guidance and walkthrough",
        "Quick resolution for urgent matters",
        "Direct access to senior support staff"
      ],
      whenToUse: "Perfect for urgent issues, quick questions, or when you prefer speaking to someone directly"
    }
  ];

  const faqCategories = [
    {
      title: "Account & Login",
      questions: [
        { text: "How do I reset my password?", link: "help-getting-started-account" },
        { text: "Can I change my email address?", link: "help-getting-started-account" },
        { text: "How do I delete my account?", link: "help-getting-started-account" },
        { text: "Setting up your reading profile", link: "help-getting-started-profile" }
      ]
    },
    {
      title: "Reading Lists",
      questions: [
        { text: "How do I create a reading list?", link: "help-reading-lists-creating" },
        { text: "Can I share my reading lists?", link: "help-reading-lists-sharing" },
        { text: "How do I organize my books?", link: "help-reading-lists-organizing" },
        { text: "Using tags and categories", link: "help-reading-lists-tags" }
      ]
    },
    {
      title: "Community Features",
      questions: [
        { text: "Participating in discussions", link: "help-community-discussions" },
        { text: "Writing book reviews", link: "help-community-reviews" },
        { text: "Following other readers", link: "help-community-following" }
      ]
    },
    {
      title: "Getting Started", 
      questions: [
        { text: "Adding books to your library", link: "help-getting-started-library" },
        { text: "Understanding recommendations", link: "help-getting-started-recommendations" },
        { text: "Setting up your reading profile", link: "help-getting-started-profile" },
        { text: "How to create an account", link: "help-getting-started-account" }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Mail className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Contact Us</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have a question, suggestion, or need help? We're here to help you make the most of your LitLens experience.
        </p>
      </div>

      {/* Support Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-primary">4.9/5</div>
          <p className="text-sm text-muted-foreground">Support Rating</p>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-primary">2,500+</div>
          <p className="text-sm text-muted-foreground">Issues Resolved</p>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-primary">&lt; 4hrs</div>
          <p className="text-sm text-muted-foreground">Avg Response</p>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-primary">98%</div>
          <p className="text-sm text-muted-foreground">Satisfaction</p>
        </Card>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {contactMethods.map((method, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className={`h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center ${index === 0 ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20' : 'bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20'}`}>
                <method.icon className={`h-8 w-8 ${method.color}`} />
              </div>
              <CardTitle className="text-xl mb-2">{method.title}</CardTitle>
              <p className="text-muted-foreground">{method.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div className="text-center space-y-3">
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="font-semibold text-lg">{method.contact}</p>
                  <Badge variant="secondary" className="mt-2">
                    {method.availability}
                  </Badge>
                </div>
              </div>

              {/* When to Use */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">When to Use</h4>
                <p className="text-sm">{method.whenToUse}</p>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">What We Offer</h4>
                <div className="space-y-2">
                  {method.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full gap-2 mt-4" 
                variant={index === 0 ? "default" : "outline"}
              >
                <method.icon className="h-4 w-4" />
                {index === 0 ? "Send Email" : "Call Now"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Before You Contact Us */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
            <Lightbulb className="h-5 w-5" />
            Before You Contact Us - Check Our Help Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-800 dark:text-amber-200 mb-4">
            Many questions can be answered instantly in our comprehensive help center. Save time and get immediate solutions!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              size="sm"
              className="justify-start bg-white/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              onClick={() => onPageChange?.("help-getting-started-account")}
            >
              Getting Started
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="justify-start bg-white/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              onClick={() => onPageChange?.("help-reading-lists-creating")}
            >
              Reading Lists
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="justify-start bg-white/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              onClick={() => onPageChange?.("help-community-discussions")}
            >
              Community
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="justify-start bg-white/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
              onClick={() => onPageChange?.("help")}
            >
              All Help Topics
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <category.icon className="h-4 w-4" />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Brief description of your inquiry"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Please provide as much detail as possible to help us assist you better..."
                  rows={6}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full gap-2" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                * Required fields. We typically respond within 4-6 hours during business hours.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* FAQ & Additional Info */}
        <div className="space-y-6">
          {/* Popular Help Topics */}
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                <Lightbulb className="h-5 w-5" />
                Popular Help Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                Find quick answers to the most common questions our users ask.
              </p>
              <div className="grid gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start h-auto p-2 text-blue-900 dark:text-blue-100 hover:bg-blue-200/50 dark:hover:bg-blue-800/30"
                  onClick={() => onPageChange?.("help-getting-started-account")}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Creating and setting up your account
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start h-auto p-2 text-blue-900 dark:text-blue-100 hover:bg-blue-200/50 dark:hover:bg-blue-800/30"
                  onClick={() => onPageChange?.("help-reading-lists-creating")}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Creating and managing reading lists
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start h-auto p-2 text-blue-900 dark:text-blue-100 hover:bg-blue-200/50 dark:hover:bg-blue-800/30"
                  onClick={() => onPageChange?.("help-community-discussions")}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Participating in community discussions
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start h-auto p-2 text-blue-900 dark:text-blue-100 hover:bg-blue-200/50 dark:hover:bg-blue-800/30"
                  onClick={() => onPageChange?.("help-getting-started-recommendations")}
                >
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                  Understanding personalized recommendations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Help */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Browse Help Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-medium">{category.title}</h4>
                  <div className="space-y-1">
                    {category.questions.map((question, qIndex) => (
                      <button
                        key={qIndex}
                        onClick={() => onPageChange?.(question.link as any)}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors block text-left hover:underline"
                      >
                        • {question.text}
                      </button>
                    ))}
                  </div>
                  {index < faqCategories.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => onPageChange?.("help")}
              >
                <HelpCircle className="h-4 w-4" />
                Visit Help Center
              </Button>
            </CardContent>
          </Card>



          {/* Response Time */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium">Fast Response Guarantee</h4>
                  <p className="text-sm text-muted-foreground">
                    We're committed to providing quick, helpful responses. Most inquiries are 
                    answered within 4-6 hours during business hours, and urgent issues are 
                    prioritized for same-day resolution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}