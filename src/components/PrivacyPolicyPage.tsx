import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Shield, Eye, Lock, Database, Globe, Mail } from "lucide-react";

export function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <Badge variant="secondary">Last updated: January 7, 2025</Badge>
        </div>
      </div>

      {/* Quick Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy at a Glance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">What we collect:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Account information (name, email)</li>
                <li>• Reading preferences and history</li>
                <li>• Reviews and ratings you create</li>
                <li>• Usage analytics for improvements</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Your rights:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Access your data anytime</li>
                <li>• Delete your account and data</li>
                <li>• Control privacy settings</li>
                <li>• Opt out of non-essential emails</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Sections */}
      <div className="space-y-6">
        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Account Information</h4>
                <p className="text-sm text-muted-foreground">
                  When you create an account, we collect your name, email address, and profile information. 
                  This helps us personalize your experience and communicate with you about our services.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Reading Data</h4>
                <p className="text-sm text-muted-foreground">
                  We track the books you read, rate, and review to provide personalized recommendations. 
                  This includes your reading lists, favorite genres, and reading progress.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Usage Analytics</h4>
                <p className="text-sm text-muted-foreground">
                  We collect anonymized data about how you use our platform to improve our services. 
                  This includes page views, search queries, and feature usage patterns.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Community Interactions</h4>
                <p className="text-sm text-muted-foreground">
                  Your reviews, ratings, comments, and interactions with other users are stored to 
                  maintain our community features and help other readers discover great books.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Service Delivery</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Provide personalized book recommendations</li>
                  <li>• Maintain your reading lists and preferences</li>
                  <li>• Enable community features and discussions</li>
                  <li>• Support customer service requests</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Platform Improvement</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Analyze usage patterns to improve features</li>
                  <li>• Develop better recommendation algorithms</li>
                  <li>• Identify and fix technical issues</li>
                  <li>• Research reading trends and preferences</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Communication</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Send important account notifications</li>
                  <li>• Share new book recommendations</li>
                  <li>• Notify about community activity</li>
                  <li>• Provide customer support</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Safety & Security</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Prevent fraud and abuse</li>
                  <li>• Protect against security threats</li>
                  <li>• Moderate community content</li>
                  <li>• Comply with legal requirements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              Data Protection & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Encryption & Storage</h4>
                <p className="text-sm text-muted-foreground">
                  All data is encrypted in transit and at rest using industry-standard encryption protocols. 
                  We use secure cloud infrastructure with regular security audits and monitoring.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Access Controls</h4>
                <p className="text-sm text-muted-foreground">
                  Access to your personal data is strictly limited to authorized personnel who need it 
                  to provide our services. All access is logged and monitored.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Data Retention</h4>
                <p className="text-sm text-muted-foreground">
                  We retain your data for as long as your account is active. When you delete your account, 
                  we remove your personal information within 30 days, except where required by law.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Third-Party Security</h4>
                <p className="text-sm text-muted-foreground">
                  We carefully vet all third-party services and require them to maintain appropriate 
                  security measures. We never sell your personal data to third parties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Privacy Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium">Access & Portability</h4>
                <p className="text-sm text-muted-foreground">
                  You can access all your personal data through your account settings. 
                  You can also request a copy of your data in a portable format.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Correction & Updates</h4>
                <p className="text-sm text-muted-foreground">
                  You can update your profile information, reading preferences, and 
                  privacy settings at any time through your account dashboard.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Deletion Rights</h4>
                <p className="text-sm text-muted-foreground">
                  You can delete specific content or your entire account. Account deletion 
                  removes all personal data except where retention is legally required.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">Privacy Controls</h4>
                <p className="text-sm text-muted-foreground">
                  Control who can see your reading activity, reviews, and reading lists. 
                  You can make your profile public or completely private.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies & Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies & Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Essential Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Required for basic functionality like keeping you logged in and maintaining your session. 
                  These cannot be disabled without affecting core features.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Help us understand how you use our platform to improve performance and user experience. 
                  These are anonymized and can be disabled in your privacy settings.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Personalization Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Store your preferences and reading history to provide personalized recommendations. 
                  You can manage these through your account settings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-600" />
              Contact & Policy Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Privacy Questions</h4>
                <p className="text-sm text-muted-foreground">
                  If you have questions about this privacy policy or how we handle your data, 
                  please contact our privacy team at privacy@litlens.com.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Policy Updates</h4>
                <p className="text-sm text-muted-foreground">
                  We may update this policy to reflect changes in our practices or legal requirements. 
                  We'll notify you of significant changes via email or through our platform.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Data Protection Officer</h4>
                <p className="text-sm text-muted-foreground">
                  For formal privacy complaints or data protection inquiries, contact our 
                  Data Protection Officer at dpo@litlens.com.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          This privacy policy is effective as of January 7, 2025. For previous versions or 
          additional information, please contact our support team.
        </p>
      </div>
    </div>
  );
}