import { ArrowLeft, CheckCircle, UserPlus, Mail, Lock, Users, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface HelpGettingStartedAccountProps {
  onBack: () => void;
}

export function HelpGettingStartedAccount({ onBack }: HelpGettingStartedAccountProps) {
  const steps = [
    {
      icon: UserPlus,
      title: "Choose Your Sign-Up Method",
      description: "You can create an account using your email address. Simply click the 'Get Started' button on the login page.",
      tips: [
        "Use an email address you check regularly",
        "Consider using a dedicated email for book-related services"
      ]
    },
    {
      icon: Mail,
      title: "Enter Your Information",
      description: "Fill out the registration form with your basic details including name, username, and email address.",
      tips: [
        "Choose a unique username that represents you",
        "Make sure your email is spelled correctly",
        "Your name will be displayed to other readers in the community"
      ]
    },
    {
      icon: Lock,
      title: "Create a Secure Password",
      description: "Choose a strong password to protect your account and reading data.",
      tips: [
        "Use at least 8 characters",
        "Include a mix of letters, numbers, and symbols",
        "Avoid using common words or personal information"
      ]
    },
    {
      icon: CheckCircle,
      title: "Verify Your Email",
      description: "Check your email for a verification link and click it to activate your account.",
      tips: [
        "Check your spam folder if you don't see the email",
        "The verification link expires after 24 hours",
        "You can request a new verification email if needed"
      ]
    }
  ];

  const benefits = [
    {
      icon: Star,
      title: "Personalized Recommendations",
      description: "Get book suggestions tailored to your reading preferences"
    },
    {
      icon: Users,
      title: "Community Features",
      description: "Join discussions, share reviews, and connect with fellow readers"
    },
    {
      icon: UserPlus,
      title: "Reading Lists",
      description: "Create and organize custom reading lists for different moods and genres"
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
          <Badge variant="secondary" className="mb-4">Getting Started</Badge>
          <h1 className="text-3xl font-bold mb-4">How to Create an Account</h1>
          <p className="text-muted-foreground text-lg">
            Creating your LitLens account is quick and easy. Follow these simple steps to join our community of book lovers and start discovering your next favorite read.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Step-by-Step Guide</h2>
          <div className="grid gap-6">
            {steps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10" aria-hidden="true">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Step {index + 1}</span>
                      <h3 className="text-lg font-semibold" id={`step-${index + 1}-heading`}>{step.title}</h3>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4" aria-labelledby={`step-${index + 1}-heading`}>
                  <p className="text-muted-foreground">{step.description}</p>
                  {step.tips && (
                    <div>
                      <h4 className="font-medium mb-2" id={`step-${index + 1}-tips`}>💡 Tips:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1" aria-labelledby={`step-${index + 1}-tips`}>
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">What You'll Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">I didn't receive the verification email</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Check your spam/junk folder first. If it's not there, you can request a new verification email from the login page.
              </p>
            </div>
            <div>
              <h4 className="font-medium">My username is already taken</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Try adding numbers or variations to your preferred username. Usernames must be unique across the platform.
              </p>
            </div>
            <div>
              <h4 className="font-medium">I'm having trouble with the sign-up form</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Make sure all required fields are filled out correctly. If you continue to have issues, contact our support team.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Once you've created your account, here's what to do next:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Set up your reading profile and preferences
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Add your first books to your library
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                Explore personalized recommendations
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}