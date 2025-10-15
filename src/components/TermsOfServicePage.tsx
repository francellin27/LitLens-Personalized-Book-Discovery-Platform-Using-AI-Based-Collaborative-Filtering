import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { FileText, Users, Shield, AlertTriangle, Scale, Mail } from "lucide-react";

export function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            By using LitLens, you agree to these terms. Please read them carefully.
          </p>
          <Badge variant="secondary">Last updated: January 7, 2025</Badge>
        </div>
      </div>

      {/* Quick Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Terms Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Your Rights:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Use LitLens for personal purposes</li>
                <li>• Create and share reading lists</li>
                <li>• Participate in community discussions</li>
                <li>• Access your data and delete your account</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Your Responsibilities:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Keep your account secure</li>
                <li>• Follow community guidelines</li>
                <li>• Respect intellectual property</li>
                <li>• Use the service lawfully</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Terms */}
      <div className="space-y-6">
        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              By accessing or using LitLens ("the Service"), you agree to be bound by these Terms of Service 
              ("Terms"). If you disagree with any part of these terms, then you may not access the Service.
            </p>
            <p className="text-sm text-muted-foreground">
              These Terms apply to all visitors, users, and others who access or use the Service. 
              We reserve the right to update these Terms at any time, and your continued use of the Service 
              constitutes acceptance of any changes.
            </p>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              2. User Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Account Creation</h4>
                <p className="text-sm text-muted-foreground">
                  To use certain features of the Service, you must create an account. You agree to provide 
                  accurate, current, and complete information during registration and to update such information 
                  to keep it accurate, current, and complete.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Account Security</h4>
                <p className="text-sm text-muted-foreground">
                  You are responsible for safeguarding your account credentials and for all activities that 
                  occur under your account. You must immediately notify us of any unauthorized access to or 
                  use of your account.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Account Termination</h4>
                <p className="text-sm text-muted-foreground">
                  You may delete your account at any time. We may terminate or suspend your account immediately, 
                  without prior notice, for any reason, including but not limited to violation of these Terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              3. Community Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Acceptable Use</h4>
                <p className="text-sm text-muted-foreground">
                  You agree to use the Service only for lawful purposes and in accordance with these Terms. 
                  You will not use the Service to violate any applicable laws, regulations, or third-party rights.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Prohibited Content</h4>
                <p className="text-sm text-muted-foreground mb-2">You may not post, upload, or share content that:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Is illegal, harmful, threatening, abusive, or offensive</li>
                  <li>• Violates intellectual property rights</li>
                  <li>• Contains spam, viruses, or malicious code</li>
                  <li>• Impersonates another person or entity</li>
                  <li>• Promotes illegal activities or violence</li>
                  <li>• Contains personal information of others without consent</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Content Moderation</h4>
                <p className="text-sm text-muted-foreground">
                  We reserve the right to review, moderate, and remove any content that violates these Terms 
                  or our community guidelines. We may also take action against users who repeatedly violate our policies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              4. Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Our Content</h4>
                <p className="text-sm text-muted-foreground">
                  The Service and its original content, features, and functionality are and will remain the 
                  exclusive property of LitLens and its licensors. The Service is protected by copyright, 
                  trademark, and other laws.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Your Content</h4>
                <p className="text-sm text-muted-foreground">
                  You retain ownership of any content you submit, post, or display on the Service ("Your Content"). 
                  By submitting Your Content, you grant us a worldwide, non-exclusive, royalty-free license to use, 
                  copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute Your Content.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Third-Party Content</h4>
                <p className="text-sm text-muted-foreground">
                  Book covers, descriptions, and metadata are provided by publishers and other third parties. 
                  We respect intellectual property rights and expect our users to do the same.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data */}
        <Card>
          <CardHeader>
            <CardTitle>5. Privacy & Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
              your information when you use our Service. By using our Service, you agree to the collection 
              and use of information in accordance with our Privacy Policy.
            </p>
            <p className="text-sm text-muted-foreground">
              You have the right to access, update, or delete your personal information at any time through 
              your account settings or by contacting our support team.
            </p>
          </CardContent>
        </Card>

        {/* Service Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              6. Service Availability & Modifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Service Availability</h4>
                <p className="text-sm text-muted-foreground">
                  We strive to maintain the Service's availability but cannot guarantee uninterrupted access. 
                  The Service may be temporarily unavailable due to maintenance, updates, or technical issues.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Service Modifications</h4>
                <p className="text-sm text-muted-foreground">
                  We reserve the right to modify, suspend, or discontinue the Service or any part of it at any time, 
                  with or without notice. We will not be liable for any modification, suspension, or discontinuation 
                  of the Service.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Beta Features</h4>
                <p className="text-sm text-muted-foreground">
                  We may offer beta or experimental features that are provided "as is" without any warranties. 
                  These features may be changed or removed at any time without notice.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimers & Liability */}
        <Card>
          <CardHeader>
            <CardTitle>7. Disclaimers & Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Service Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  The Service is provided "as is" and "as available" without any warranties of any kind, either 
                  express or implied. We do not warrant that the Service will be uninterrupted, timely, secure, 
                  or error-free.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Content Disclaimer</h4>
                <p className="text-sm text-muted-foreground">
                  Book recommendations and information are provided for informational purposes only. We do not 
                  guarantee the accuracy, completeness, or usefulness of any content on the Service.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Limitation of Liability</h4>
                <p className="text-sm text-muted-foreground">
                  In no event shall LitLens be liable for any indirect, incidental, special, consequential, or 
                  punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                  intangible losses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>8. Governing Law & Disputes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              These Terms shall be interpreted and governed by the laws of the jurisdiction in which LitLens 
              operates, without regard to its conflict of law provisions.
            </p>
            <p className="text-sm text-muted-foreground">
              Any disputes arising from these Terms or your use of the Service will be resolved through binding 
              arbitration, except that you may assert claims in small claims court if they qualify.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600" />
              9. Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Email: legal@litlens.com</p>
              <p>• Support: support@litlens.com</p>
              <p>• Address: LitLens Legal Department, [Address]</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          These Terms of Service are effective as of January 7, 2025. For previous versions or 
          additional legal information, please contact our legal team.
        </p>
      </div>
    </div>
  );
}