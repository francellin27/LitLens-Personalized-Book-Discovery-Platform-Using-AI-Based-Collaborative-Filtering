import { GENRES, PUBLISHERS, LANGUAGES, YEARS } from '../lib/bookData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

export interface SearchFilters {
  genre: string;
  author: string;
  year: string;
  rating: number[];
  language: string;
  publisher: string;
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card p-6 rounded-lg space-y-6">
      <div>
        <h3 className="text-lg">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Genre Filter */}
        <div className="space-y-2">
          <Label>Genre</Label>
          <Select value={filters.genre} onValueChange={(value) => updateFilter('genre', value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GENRES.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <Label>Publication Year</Label>
          <Select value={filters.year} onValueChange={(value) => updateFilter('year', value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Publisher Filter */}
        <div className="space-y-2">
          <Label>Publisher</Label>
          <Select value={filters.publisher} onValueChange={(value) => updateFilter('publisher', value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PUBLISHERS.map((publisher) => (
                <SelectItem key={publisher} value={publisher}>
                  {publisher}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Language Filter */}
        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={filters.language} onValueChange={(value) => updateFilter('language', value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((language) => (
                <SelectItem key={language} value={language}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label>Min. Rating: {filters.rating?.[0]?.toFixed(1) ?? '0.0'} ⭐</Label>
          <Slider
            value={filters.rating || [0]}
            onValueChange={(value) => updateFilter('rating', value)}
            max={5}
            min={0}
            step={0.5}
            className="w-full pt-2"
          />
        </div>
      </div>
    </div>
  );
}