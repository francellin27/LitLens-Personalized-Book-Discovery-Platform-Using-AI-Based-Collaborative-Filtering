import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { BookGrid } from "./BookGrid";
import { RecommendationCard } from "./RecommendationCard";
import { bookData, Book } from "../lib/bookData";
import { Sparkles, TrendingUp, Heart, Users, RefreshCw } from "lucide-react";

interface RecommendationsPageProps {
  onBookSelect: (book: Book) => void;
  onViewUser: (userId: string) => void;
}

export function RecommendationsPage({ onBookSelect, onViewUser }: RecommendationsPageProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Simulate AI-based recommendations with different categories
  const recommendations = useMemo(() => {
    // Shuffle books to simulate dynamic recommendations
    const shuffled = [...bookData].sort(() => Math.random() - 0.5);
    
    return {
      forYou: shuffled.slice(0, 6).map(book => ({
        book,
        reason: getPersonalizedReason(book),
        confidence: Math.floor(Math.random() * 30) + 70 // 70-99%
      })),
      trending: shuffled.slice(6, 12).map(book => ({
        book,
        reason: "Trending in your genre preferences",
        confidence: Math.floor(Math.random() * 20) + 80 // 80-99%
      })),
      similar: shuffled.slice(12, 18).map(book => ({
        book,
        reason: "Similar to books you've enjoyed",
        confidence: Math.floor(Math.random() * 25) + 75 // 75-99%
      })),
      community: shuffled.slice(18, 24).map(book => ({
        book,
        reason: "Popular in your reading communities",
        confidence: Math.floor(Math.random() * 20) + 70 // 70-89%
      }))
    };
  }, [refreshKey]);

  function getPersonalizedReason(book: Book): string {
    const primaryGenre = Array.isArray(book.genre) ? book.genre[0] : book.genre;
    const reasons = [
      `Because you enjoyed ${primaryGenre.toLowerCase()} books`,
      `Recommended for fans of ${book.author}`,
      `Based on your high ratings for similar titles`,
      `Matches your reading preferences`,
      `Popular among readers like you`,
      `Trending in ${primaryGenre.toLowerCase()}`,
      `Highly rated by users with similar tastes`
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  const refreshRecommendations = () => {
    setRefreshKey(prev => prev + 1);
  };

  const categories = [
    {
      id: "forYou",
      title: "Personalized for You",
      subtitle: "AI-curated picks based on your reading history",
      icon: Sparkles,
      data: recommendations.forYou,
      color: "text-purple-600 dark:text-purple-400"
    },
    {
      id: "trending",
      title: "Trending Now",
      subtitle: "What other readers are discovering",
      icon: TrendingUp,
      data: recommendations.trending,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      id: "similar",
      title: "Because You Liked...",
      subtitle: "Books similar to your favorites",
      icon: Heart,
      data: recommendations.similar,
      color: "text-red-600 dark:text-red-400"
    },
    {
      id: "community",
      title: "Community Favorites",
      subtitle: "Popular in your reading circles",
      icon: Users,
      data: recommendations.community,
      color: "text-green-600 dark:text-green-400"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Recommendations</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover your next favorite book with AI-powered recommendations tailored just for you
        </p>
        
        <div className="flex justify-center">
          <Button onClick={refreshRecommendations} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Recommendations
          </Button>
        </div>
      </div>

      {/* AI Insights Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Your Reading Profile</h3>
              <p className="text-sm text-muted-foreground">
                Based on your reading history, you tend to enjoy {bookData[0]?.genre?.[0]?.toLowerCase() || 'various'} books 
                with complex characters and engaging plots. You've shown a preference for 
                highly-rated titles (4+ stars) and recent publications.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary">Fiction Lover</Badge>
                <Badge variant="secondary">Quality Reader</Badge>
                <Badge variant="secondary">Contemporary Focus</Badge>
                <Badge variant="secondary">Character-Driven</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Categories */}
      {categories.map((category, index) => (
        <div key={category.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <category.icon className={`h-6 w-6 ${category.color}`} />
              <div>
                <h2 className="text-xl font-bold">{category.title}</h2>
                <p className="text-sm text-muted-foreground">{category.subtitle}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {category.data.map((item, itemIndex) => (
              <RecommendationCard
                key={`${category.id}-${itemIndex}-${refreshKey}`}
                book={item.book}
                reason={item.reason}
                confidence={item.confidence}
                onClick={() => onBookSelect(item.book)}
                onViewUser={onViewUser}
              />
            ))}
          </div>

          {index < categories.length - 1 && <Separator className="my-8" />}
        </div>
      ))}
    </div>
  );
}