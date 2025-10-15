import { ArrowLeft, Shield, Database, Eye, Lock, FileText, Download, Trash2, Clock, UserCheck, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";

interface HelpPrivacyDataPolicyProps {
  onBack: () => void;
}

export function HelpPrivacyDataPolicy({ onBack }: HelpPrivacyDataPolicyProps) {
  const dataTypes = [
    {
      icon: UserCheck,
      title: "Profile Information",
      description: "Name, username, email, profile picture, and bio",
      usage: "Account management and personalization",
      retention: "Until account deletion",
      control: "Full control - edit or delete anytime"
    },
    {
      icon: Database,
      title: "Reading Data",
      description: "Books read, ratings, reviews, reading lists, and progress",
      usage: "Personalized recommendations and community features",
      retention: "3 years after last activity",
      control: "Selective deletion and export available"
    },
    {
      icon: Eye,
      title: "Activity Data",
      description: "Search history, page views, and interaction patterns",
      usage: "Platform improvement and personalized experience",
      retention: "12 months",
      control: "Auto-deletion available in settings"
    },
    {
      icon: Shield,
      title: "Community Data",
      description: "Comments, discussions, follows, and community interactions",
      usage: "Community features and content moderation",
      retention: "Indefinite (public contributions)",
      control: "Individual post deletion available"
    }
  ];

  const dataRights = [
    {
      icon: FileText,
      title: "Access Your Data",
      description: "Request a complete copy of all data we have about you",
      action: "Download in JSON or CSV format",
      timeframe: "Available immediately"
    },
    {
      icon: Download,
      title: "Data Portability",
      description: "Export your data to use with other services",
      action: "Standardized export formats",
      timeframe: "Available immediately"
    },
    {
      icon: Trash2,
      title: "Delete Your Data",
      description: "Request deletion of specific data or your entire account",
      action: "Selective or complete deletion",
      timeframe: "Processed within 30 days"
    },
    {
      icon: UserCheck,
      title: "Correct Your Data",
      description: "Update or correct any inaccurate information",
      action: "Self-service editing available",
      timeframe: "Immediate updates"
    }
  ];

  const privacyPrinciples = [
    {
      title: "Transparency",
      description: "We clearly explain what data we collect and how we use it"
    },
    {
      title: "Purpose Limitation",
      description: "We only collect data necessary for providing our services"
    },
    {
      title: "Data Minimization",
      description: "We collect the minimum amount of data required"
    },
    {
      title: "Security",
      description: "We protect your data with industry-standard security measures"
    },
    {
      title: "User Control",
      description: "You have control over your data and privacy settings"
    },
    {
      title: "Accountability",
      description: "We're responsible for protecting your privacy and rights"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="gap-2 focus-visible-ring"
          aria-label="Return to Help Center main page"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Help Center
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <Badge variant="secondary" className="mb-4">Privacy & Security</Badge>
          <h1 className="text-3xl font-bold mb-4">Data Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Understanding how LitLens collects, uses, and protects your personal data. Learn about your privacy rights and how to control your information.
          </p>
        </div>

        {/* Privacy Alert */}
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            <strong>Your Privacy Matters:</strong> LitLens is committed to protecting your personal information. We follow GDPR, CCPA, and other privacy regulations to ensure your data rights are respected.
          </AlertDescription>
        </Alert>

        {/* Data We Collect */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">What Data We Collect</h2>
          <div className="grid gap-4">
            {dataTypes.map((type, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <type.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{type.title}</h3>
                      <p className="text-sm text-muted-foreground font-normal">{type.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-1">How We Use It</h4>
                      <p className="text-muted-foreground">{type.usage}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Retention Period</h4>
                      <p className="text-muted-foreground">{type.retention}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Your Control</h4>
                      <p className="text-muted-foreground">{type.control}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Your Privacy Rights */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Privacy Rights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataRights.map((right, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <right.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{right.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{right.description}</p>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Action:</span>
                          <span>{right.action}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Timeframe:</span>
                          <span>{right.timeframe}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Principles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" aria-hidden="true" />
              Our Privacy Principles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {privacyPrinciples.map((principle, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{principle.title}</h4>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              When We Share Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              We never sell your personal data. We only share data in these limited circumstances:
            </p>
            <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                <strong>Service Providers:</strong> Trusted third parties who help us operate the platform (cloud hosting, analytics, email services)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                <strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                <strong>Business Transfers:</strong> In the event of a merger or acquisition (with continued privacy protection)
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2 flex-shrink-0" />
                <strong>Your Consent:</strong> When you explicitly agree to share data with specific partners or integrations
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card>
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              LitLens is based in the United States, and your data may be processed in the US or other countries where our service providers operate. We ensure appropriate safeguards are in place:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                Standard Contractual Clauses (SCCs) with all international processors
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                Regular privacy impact assessments for cross-border transfers
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                Compliance with GDPR adequacy decisions where applicable
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" aria-hidden="true" />
              Data Retention & Deletion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Automatic Deletion</h4>
              <p className="text-sm text-muted-foreground mb-2">
                We automatically delete certain types of data after specified periods:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Session data: 30 days after logout</li>
                <li>• Search history: 12 months unless disabled</li>
                <li>• Inactive account data: 3 years of inactivity</li>
                <li>• Temporary files and logs: 90 days</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Manual Deletion</h4>
              <p className="text-sm text-muted-foreground">
                You can delete specific data or your entire account at any time through your settings. Complete account deletion removes all personal data within 30 days, except for anonymized analytics data and content required for legal compliance.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Questions About Your Privacy?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you have questions about this privacy policy or how we handle your data, we're here to help:
            </p>
            <div className="space-y-2 text-sm">
              <p><strong>Privacy Officer:</strong> privacy@litlens.com</p>
              <p><strong>Data Protection Officer:</strong> dpo@litlens.com</p>
              <p><strong>General Support:</strong> support@litlens.com</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Your Data
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Shield className="h-4 w-4" aria-hidden="true" />
                Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>This privacy policy was last updated on October 8, 2025</p>
          <p>Previous versions are available upon request</p>
        </div>
      </div>
    </div>
  );
}