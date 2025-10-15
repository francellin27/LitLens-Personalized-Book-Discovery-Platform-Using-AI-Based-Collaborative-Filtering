import { BookOpen, Github, Twitter, Mail, Heart } from "lucide-react";
import { Separator } from "./ui/separator";
import { PageType } from "./Navigation";

interface FooterProps {
  onPageChange?: (page: PageType) => void;
}

export function Footer({ onPageChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">
                LitLens
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your personalized book discovery platform. Discover your next great read through 
              AI-powered recommendations and connect with a community of passionate readers.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent/10 rounded-lg"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent/10 rounded-lg"
                aria-label="View our GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-accent/10 rounded-lg"
                aria-label="Contact us via email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => onPageChange?.('help')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange?.('privacy')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange?.('terms')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onPageChange?.('contact')} 
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <span>© {currentYear} LitLens. Made with</span>
            <Heart className="h-4 w-4 text-destructive fill-current" />
            <span>for book lovers.</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <span>Powered by AI recommendations</span>
            <span>•</span>
            <span>Version 1.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}