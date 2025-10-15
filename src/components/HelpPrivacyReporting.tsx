import { ArrowLeft, Flag, Shield, AlertTriangle, MessageSquare, User, Book, Search, Clock, CheckCircle, X, Eye, Ban } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface HelpPrivacyReportingProps {
  onBack: () => void;
}

export function HelpPrivacyReporting({ onBack }: HelpPrivacyReportingProps) {
  const reportTypes = [
    {
      icon: MessageSquare,
      title: "Inappropriate Content",
      description: "Offensive, spam, or irrelevant content in reviews, discussions, or comments",
      examples: ["Hate speech", "Spam content", "Off-topic discussions", "Misleading reviews"],
      severity: "Medium",
      responseTime: "24 hours"
    },
    {
      icon: User,
      title: "User Behavior",
      description: "Harassment, impersonation, or other harmful behavior by community members",
      examples: ["Harassment or bullying", "Impersonation", "Fake accounts", "Coordinated attacks"],
      severity: "High",
      responseTime: "12 hours"
    },
    {
      icon: Book,
      title: "Copyright Issues",
      description: "Unauthorized sharing of copyrighted book content or piracy links",
      examples: ["Pirated book links", "Unauthorized excerpts", "Copyright infringement", "Illegal downloads"],
      severity: "High",
      responseTime: "6 hours"
    },
    {
      icon: Shield,
      title: "Privacy Violations",
      description: "Sharing personal information without consent or doxxing",
      examples: ["Personal information sharing", "Doxxing", "Privacy breaches", "Unauthorized photos"],
      severity: "Critical",
      responseTime: "2 hours"
    }
  ];

  const reportingSteps = [
    {
      step: 1,
      title: "Identify the Issue",
      description: "Determine what type of content or behavior you're reporting",
      details: "Take a moment to review our community guidelines to confirm the violation"
    },
    {
      step: 2,
      title: "Use the Report Button",
      description: "Click the report flag icon next to the content or user",
      details: "Available on reviews, discussions, comments, and user profiles"
    },
    {
      step: 3,
      title: "Select Report Type",
      description: "Choose the most appropriate category for your report",
      details: "This helps our moderation team prioritize and handle your report correctly"
    },
    {
      step: 4,
      title: "Provide Details",
      description: "Add context and specific information about the violation",
      details: "Include screenshots or additional evidence if helpful"
    },
    {
      step: 5,
      title: "Submit and Track",
      description: "Submit your report and receive a confirmation with tracking ID",
      details: "You'll get updates on the status and outcome of your report"
    }
  ];

  const moderationActions = [
    {
      action: "Content Warning",
      description: "Content is flagged with a warning but remains visible",
      when: "Minor violations or borderline content",
      impact: "Users see a warning before viewing the content"
    },
    {
      action: "Content Removal",
      description: "Content is deleted from the platform",
      when: "Clear policy violations or harmful content",
      impact: "Content is permanently removed"
    },
    {
      action: "User Warning",
      description: "User receives a formal warning about their behavior",
      when: "First-time or minor violations",
      impact: "User is notified and educated about community standards"
    },
    {
      action: "Temporary Restriction",
      description: "User's ability to post or interact is temporarily limited",
      when: "Repeated violations or more serious infractions",
      impact: "User cannot post, comment, or participate for a set period"
    },
    {
      action: "Account Suspension",
      description: "User account is temporarily suspended",
      when: "Serious or repeated violations",
      impact: "User cannot access their account for a specified time"
    },
    {
      action: "Permanent Ban",
      description: "User account is permanently banned from the platform",
      when: "Severe violations, criminal activity, or repeated serious offenses",
      impact: "User is permanently removed from LitLens"
    }
  ];

  const appealProcess = [
    {
      stage: "Automatic Review",
      timeframe: "Within 24 hours",
      description: "Our system automatically reviews the moderation decision for obvious errors"
    },
    {
      stage: "User Appeal",
      timeframe: "14 days to submit",
      description: "Users can submit an appeal through their account or email"
    },
    {
      stage: "Human Review",
      timeframe: "3-5 business days",
      description: "A human moderator reviews the original decision and appeal"
    },
    {
      stage: "Final Decision",
      timeframe: "Within 7 days",
      description: "Final decision is communicated with detailed explanation"
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
          <h1 className="text-3xl font-bold mb-4">Reporting Content</h1>
          <p className="text-muted-foreground text-lg">
            Help keep LitLens safe and welcoming for everyone. Learn how to report inappropriate content, understand our moderation process, and know what to expect when you submit a report.
          </p>
        </div>

        {/* Community Standards Alert */}
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Community First:</strong> Our community guidelines ensure LitLens remains a positive space for book lovers. Thank you for helping us maintain these standards.
          </AlertDescription>
        </Alert>

        {/* What to Report */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">What You Can Report</h2>
          <div className="space-y-4">
            {reportTypes.map((type, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <type.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{type.title}</h3>
                        <Badge variant={type.severity === 'Critical' ? 'destructive' : type.severity === 'High' ? 'default' : 'secondary'}>
                          {type.severity} Priority
                        </Badge>
                        <div className="ml-auto text-sm text-muted-foreground">
                          Response: {type.responseTime}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-normal">{type.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium mb-2">Common Examples:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {type.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                          {example}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How to Report */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">How to Submit a Report</h2>
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">Step-by-Step Reporting Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportingSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium text-sm flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">{step.title}</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200 mb-1">{step.description}</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">{step.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sample Report Form */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Report Form Preview</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" aria-hidden="true" />
                Report Content or User
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type *</Label>
                <Select disabled>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select the type of violation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                    <SelectItem value="harassment">User Behavior</SelectItem>
                    <SelectItem value="copyright">Copyright Issues</SelectItem>
                    <SelectItem value="privacy">Privacy Violations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="report-details">Additional Details</Label>
                <Textarea
                  id="report-details"
                  placeholder="Please provide specific details about the violation. Include any relevant context that would help our moderation team understand the issue."
                  className="min-h-[100px]"
                  disabled
                />
              </div>
              <div className="text-xs text-muted-foreground">
                * This is a preview of the report form. The actual form appears when you click the report button next to content or users.
              </div>
              <div className="flex gap-2">
                <Button disabled className="gap-2">
                  <Flag className="h-4 w-4" aria-hidden="true" />
                  Submit Report
                </Button>
                <Button variant="outline" disabled>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Process */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Our Moderation Process</h2>
          <Card>
            <CardHeader>
              <CardTitle>What Happens After You Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Report Received</h4>
                    <p className="text-sm text-muted-foreground">Your report is logged and assigned a unique tracking ID</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Initial Assessment</h4>
                    <p className="text-sm text-muted-foreground">Our AI systems perform an initial assessment for obvious violations</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Human Review</h4>
                    <p className="text-sm text-muted-foreground">Trained moderators review the content and make a decision</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Action Taken</h4>
                    <p className="text-sm text-muted-foreground">Appropriate action is taken and you're notified of the outcome</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Possible Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Possible Moderation Actions</h2>
          <div className="space-y-3">
            {moderationActions.map((action, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900 flex-shrink-0">
                      {index === 0 && <Eye className="h-4 w-4 text-orange-600" />}
                      {index === 1 && <X className="h-4 w-4 text-orange-600" />}
                      {index === 2 && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                      {index === 3 && <Clock className="h-4 w-4 text-orange-600" />}
                      {index === 4 && <Ban className="h-4 w-4 text-orange-600" />}
                      {index === 5 && <Shield className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{action.action}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{action.description}</p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">When Used:</span>
                          <span className="text-right">{action.when}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Impact:</span>
                          <span className="text-right">{action.impact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Appeal Process */}
        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader>
            <CardTitle className="text-yellow-900 dark:text-yellow-100 flex items-center gap-2">
              <Shield className="h-5 w-5" aria-hidden="true" />
              Appeal Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-yellow-800 dark:text-yellow-200">
              If you believe a moderation decision was made in error, you can appeal:
            </p>
            <div className="space-y-3">
              {appealProcess.map((stage, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 font-medium text-xs flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-100">{stage.stage}</h4>
                      <Badge variant="outline" className="text-xs">{stage.timeframe}</Badge>
                    </div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* False Reports Warning */}
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              False or Malicious Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800 dark:text-red-200 mb-3">
              Making false reports or using the reporting system to harass other users is a violation of our community guidelines. This can result in:
            </p>
            <ul className="text-sm text-red-800 dark:text-red-200 space-y-1">
              <li>• Restrictions on your ability to submit future reports</li>
              <li>• Warnings or temporary restrictions on your account</li>
              <li>• Account suspension for repeated false reporting</li>
              <li>• Permanent ban for malicious use of the reporting system</li>
            </ul>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Need Immediate Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              For urgent safety concerns or legal issues that require immediate attention:
            </p>
            <div className="space-y-2 text-sm mb-4">
              <p><strong>Safety Team:</strong> safety@litlens.com</p>
              <p><strong>Legal Issues:</strong> legal@litlens.com</p>
              <p><strong>Emergency Hotline:</strong> Available 24/7 for critical safety issues</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Flag className="h-4 w-4" aria-hidden="true" />
                Submit Report
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Search className="h-4 w-4" aria-hidden="true" />
                Track Existing Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}