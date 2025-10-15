import { GENRES } from '../lib/data';
import { Badge } from './ui/badge';

interface GenreFilterProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

export function GenreFilter({ selectedGenre, onGenreChange }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((genre) => (
        <Badge
          key={genre}
          variant={selectedGenre === genre ? "default" : "outline"}
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors touch-manipulation min-h-[44px] flex items-center px-3 py-2 text-sm"
          onClick={() => onGenreChange(genre)}
        >
          {genre}
        </Badge>
      ))}
    </div>
  );
}