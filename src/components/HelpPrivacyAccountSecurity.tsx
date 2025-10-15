import { ArrowLeft, Shield, Lock, Smartphone, Key, AlertTriangle, CheckCircle, Eye, EyeOff, Wifi, Database, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";

interface HelpPrivacyAccountSecurityProps {
  onBack: () => void;
}

export function HelpPrivacyAccountSecurity({ onBack }: HelpPrivacyAccountSecurityProps) {
  const securityFeatures = [
    {
      icon: Lock,
      title: "Strong Password Requirements",
      description: "Minimum 8 characters with uppercase, lowercase, numbers, and symbols",
      status: "Required",
      color: "text-green-600"
    },
    {
      icon: Smartphone,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security with SMS or authenticator app",
      status: "Recommended",
      color: "text-blue-600"
    },
    {
      icon: Key,
      title: "Login Notifications",
      description: "Get notified whenever someone accesses your account",
      status: "Available",
      color: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Account Recovery",
      description: "Secure methods to regain access if you're locked out",
      status: "Available",
      color: "text-orange-600"
    }
  ];

  const twoFactorSteps = [
    {
      step: 1,
      title: "Choose Your Method",
      description: "Select SMS text message or authenticator app (Google Authenticator, Authy, etc.)",
      details: "Authenticator apps are more secure than SMS and work offline"
    },
    {
      step: 2,
      title: "Set Up Your Device",
      description: "Enter your phone number or scan the QR code with your authenticator app",
      details: "Keep your backup codes in a safe place in case you lose your device"
    },
    {
      step: 3,
      title: "Verify and Activate",
      description: "Enter the verification code to confirm your setup",
      details: "You'll need to enter a code from your chosen method each time you log in"
    },
    {
      step: 4,
      title: "Save Backup Codes",
      description: "Download and store your backup codes securely",
      details: "Use these if your primary 2FA method is unavailable"
    }
  ];

  const passwordTips = [
    {
      icon: CheckCircle,
      tip: "Use a unique password that you don't use anywhere else",
      type: "good"
    },
    {
      icon: CheckCircle,
      tip: "Include a mix of uppercase, lowercase, numbers, and symbols",
      type: "good"
    },
    {
      icon: CheckCircle,
      tip: "Consider using a passphrase with 4+ random words",
      type: "good"
    },
    {
      icon: CheckCircle,
      tip: "Use a password manager to generate and store strong passwords",
      type: "good"
    },
    {
      icon: AlertTriangle,
      tip: "Don't use personal information like names, birthdays, or addresses",
      type: "bad"
    },
    {
      icon: AlertTriangle,
      tip: "Avoid common patterns like '123456' or 'password'",
      type: "bad"
    },
    {
      icon: AlertTriangle,
      tip: "Don't reuse passwords from other accounts",
      type: "bad"
    },
    {
      icon: AlertTriangle,
      tip: "Don't share your password with anyone",
      type: "bad"
    }
  ];

  const securityThreats = [
    {
      threat: "Phishing Emails",
      description: "Fake emails that try to steal your login credentials",
      prevention: "Always check the sender and URL before clicking links. LitLens will never ask for your password via email.",
      severity: "High"
    },
    {
      threat: "Weak Passwords",
      description: "Easy-to-guess passwords that can be cracked quickly",
      prevention: "Use strong, unique passwords and enable two-factor authentication.",
      severity: "High"
    },
    {
      threat: "Public WiFi Risks",
      description: "Unsecured networks where your data could be intercepted",
      prevention: "Use a VPN or avoid accessing sensitive accounts on public WiFi.",
      severity: "Medium"
    },
    {
      threat: "Social Engineering",
      description: "Attempts to trick you into revealing personal information",
      prevention: "Be skeptical of unsolicited contact asking for account information.",
      severity: "Medium"
    }
  ];

  const recoveryOptions = [
    {
      method: "Email Recovery",
      description: "Reset your password using your registered email address",
      timeframe: "Immediate",
      requirements: "Access to your email account"
    },
    {
      method: "Security Questions",
      description: "Answer pre-set security questions to verify your identity",
      timeframe: "Immediate",
      requirements: "Remember your security question answers"
    },
    {
      method: "Backup Codes",
      description: "Use one-time backup codes saved during 2FA setup",
      timeframe: "Immediate",
      requirements: "Access to your saved backup codes"
    },
    {
      method: "Support Verification",
      description: "Contact support with identity verification documents",
      timeframe: "2-5 business days",
      requirements: "Government ID and account information"
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
          <h1 className="text-3xl font-bold mb-4">Account Security</h1>
          <p className="text-muted-foreground text-lg">
            Protect your LitLens account with robust security measures. Learn about two-factor authentication, password best practices, and how to keep your reading data safe.
          </p>
        </div>

        {/* Security Status Alert */}
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
          <Shield className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Security Status:</strong> Your account security level is <strong>Good</strong>. Consider enabling two-factor authentication for enhanced protection.
          </AlertDescription>
        </Alert>

        {/* Security Features Overview */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Security Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
                      <feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{feature.title}</h4>
                        <Badge variant="outline" className={feature.color}>{feature.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Two-Factor Authentication Setup */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Setting Up Two-Factor Authentication</h2>
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Smartphone className="h-5 w-5" aria-hidden="true" />
                Recommended Security Enhancement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                Two-factor authentication (2FA) adds an extra layer of security to your account. Even if someone has your password, they won't be able to access your account without the second factor.
              </p>
              <div className="space-y-4">
                {twoFactorSteps.map((step, index) => (
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

        {/* Password Security */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Password Security</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Good Practices */}
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" aria-hidden="true" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {passwordTips.filter(tip => tip.type === 'good').map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm text-green-800 dark:text-green-200">{tip.tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Things to Avoid */}
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  Things to Avoid
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {passwordTips.filter(tip => tip.type === 'bad').map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <p className="text-sm text-red-800 dark:text-red-200">{tip.tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Common Security Threats */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Recognizing Security Threats</h2>
          <div className="space-y-4">
            {securityThreats.map((threat, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" aria-hidden="true" />
                      {threat.threat}
                    </div>
                    <Badge variant={threat.severity === 'High' ? 'destructive' : 'secondary'}>
                      {threat.severity} Risk
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{threat.description}</p>
                  <div className="p-3 bg-muted rounded-lg">
                    <h4 className="font-medium text-sm mb-1">How to Protect Yourself:</h4>
                    <p className="text-sm text-muted-foreground">{threat.prevention}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Account Recovery */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Account Recovery Options</h2>
          <p className="text-muted-foreground">
            If you're locked out of your account, we offer several secure ways to regain access:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recoveryOptions.map((option, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">{option.method}</h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <Separator />
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span>{option.timeframe}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Requirements:</span>
                        <span className="text-right">{option.requirements}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Settings Access */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Access Your Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Manage all your account security settings from your profile:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground mb-4">
              <li>Go to your Profile page</li>
              <li>Click on the "Settings" tab</li>
              <li>Navigate to "Security" section</li>
              <li>Configure your preferences</li>
              <li>Save your changes</li>
            </ol>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Shield className="h-4 w-4" aria-hidden="true" />
                Security Settings
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Key className="h-4 w-4" aria-hidden="true" />
                Change Password
              </Button>
              <Button variant="outline" className="gap-2 focus-visible-ring">
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                Setup 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
              Suspected Security Breach?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800 dark:text-red-200 mb-4">
              If you suspect your account has been compromised or you notice unusual activity:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-red-800 dark:text-red-200 mb-4">
              <li>Change your password immediately</li>
              <li>Review your recent account activity</li>
              <li>Check your reading lists and reviews for unauthorized changes</li>
              <li>Enable two-factor authentication if not already active</li>
              <li>Contact our security team at security@litlens.com</li>
            </ol>
            <Button variant="destructive" className="gap-2">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
              Report Security Issue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}