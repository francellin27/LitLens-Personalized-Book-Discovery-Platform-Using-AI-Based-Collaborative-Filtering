// Simple data file with all exports needed
export interface Book {
  id: string;
  title: string;
  author: string;
  authorInfo?: string;
  cover: string;
  rating: number;
  totalRatings: number;
  userRating?: number;
  genre: string;
  description: string;
  publishedYear: number;
  pages: number;
  isbn: string;
  publisher: string;
  language: string;
  viewCount: number;
  readCount: number;
  publishingInfo?: string;
  length: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
}

export interface UserProfile {
  bookshelf: string[];
  completedBooks: string[];
  favorites: string[];
  readingList: string[];
  reviews: Review[];
}

// Simple exports first
export const GENRES = [
  'All',
  'Fiction',
  'Non-Fiction',
  'Romance',
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Biography',
  'History',
  'Self-Help'
];

export const PUBLISHERS = [
  'All Publishers',
  'Viking',
  'Ballantine Books',
  'Atria Books',
  'Celadon Books',
  'DAW Books',
  'Random House',
  'Penguin',
  'HarperCollins',
  'Simon & Schuster'
];

export const LANGUAGES = [
  'All Languages',
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Chinese',
  'Japanese'
];

export const YEARS = [
  'All Years',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015'
];

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    authorInfo: 'Matt Haig is a British author of fiction and non-fiction books for both adults and children.',
    cover: 'https://images.unsplash.com/photo-1535269414141-739bf0054cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjB2aW50YWdlJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTg1OTMzODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.2,
    totalRatings: 15234,
    genre: 'Fiction',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    publishedYear: 2020,
    pages: 288,
    isbn: '978-0525559474',
    publisher: 'Viking',
    language: 'English',
    viewCount: 45200,
    readCount: 12800,
    length: '6 hours 15 minutes',
    publishingInfo: 'Published by Viking in August 2020'
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    authorInfo: 'Andy Weir is an American novelist whose debut novel The Martian was later adapted into a film.',
    cover: 'https://images.unsplash.com/uploads/1413498852637ad9a7e80/1569fece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2slMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1ODU5MzM4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    totalRatings: 8956,
    genre: 'Science Fiction',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
    publishedYear: 2021,
    pages: 496,
    isbn: '978-0593135204',
    publisher: 'Ballantine Books',
    language: 'English',
    viewCount: 38900,
    readCount: 15600,
    length: '16 hours 10 minutes',
    publishingInfo: 'Published by Ballantine Books in May 2021'
  },
  {
    id: '3',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    authorInfo: 'Taylor Jenkins Reid is an American author known for her novels about complex female characters.',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwYm9va3xlbnwwfHx8fDE2OTAyMTI4Mzh8MA&ixlib=rb-4.1.0&q=80&w=400',
    rating: 4.5,
    totalRatings: 23145,
    genre: 'Romance',
    description: 'Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.',
    publishedYear: 2017,
    pages: 400,
    isbn: '978-1501161933',
    publisher: 'Atria Books',
    language: 'English',
    viewCount: 67300,
    readCount: 28900,
    length: '12 hours 5 minutes',
    publishingInfo: 'Published by Atria Books in June 2017'
  },
  {
    id: '4',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    authorInfo: 'Alex Michaelides is a British-Cypriot author and screenwriter.',
    cover: 'https://images.unsplash.com/photo-1636124953900-85565194dc7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBib29rJTIwZGFya3xlbnwxfHx8fDE3NTg1OTMzODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.1,
    totalRatings: 19847,
    genre: 'Thriller',
    description: 'A woman refuses to speak after allegedly murdering her husband. A psychotherapist becomes obsessed with treating her.',
    publishedYear: 2019,
    pages: 336,
    isbn: '978-1250301697',
    publisher: 'Celadon Books',
    language: 'English',
    viewCount: 52100,
    readCount: 19200,
    length: '8 hours 43 minutes',
    publishingInfo: 'Published by Celadon Books in February 2019'
  },
  {
    id: '5',
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    authorInfo: 'Patrick Rothfuss is an American author of epic fantasy.',
    cover: 'https://images.unsplash.com/photo-1685478237148-aaf613b2e8ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYm9vayUyMGNvdmVyJTIwbWFnaWNhbHxlbnwxfHx8fDE3NTg1OTMzODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    totalRatings: 31256,
    genre: 'Fantasy',
    description: 'Told in Kvothe\'s own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen.',
    publishedYear: 2007,
    pages: 662,
    isbn: '978-0756404079',
    publisher: 'DAW Books',
    language: 'English',
    viewCount: 78400,
    readCount: 35700,
    length: '27 hours 55 minutes',
    publishingInfo: 'Published by DAW Books in March 2007'
  },
  {
    id: '6',
    title: 'Educated',
    author: 'Tara Westover',
    authorInfo: 'Tara Westover is an American memoirist, essayist, and historian.',
    cover: 'https://images.unsplash.com/photo-1674653760708-f521366e5cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rJTIwc3RhY2slMjBsaWJyYXJ5fGVufDF8fHx8MTc1ODU5MzM4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.4,
    totalRatings: 42189,
    genre: 'Biography',
    description: 'A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    publishedYear: 2018,
    pages: 334,
    isbn: '978-0399590504',
    publisher: 'Random House',
    language: 'English',
    viewCount: 89600,
    readCount: 45300,
    length: '12 hours 10 minutes',
    publishingInfo: 'Published by Random House in February 2018'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    bookId: '1',
    userId: '1',
    userName: 'Sarah Johnson',
    rating: 5,
    title: 'Life-changing read',
    content: 'This book completely changed my perspective on life and the choices we make. Beautifully written and deeply philosophical.',
    date: '2024-01-15',
    helpful: 12
  },
  {
    id: '2',
    bookId: '1',
    userId: '2',
    userName: 'Michael Chen',
    rating: 4,
    title: 'Thought-provoking',
    content: 'A unique concept executed well. Made me think about alternate paths in life.',
    date: '2024-01-10',
    helpful: 8
  },
  {
    id: '3',
    bookId: '2',
    userId: '3',
    userName: 'Emma Wilson',
    rating: 5,
    title: 'Scientific masterpiece',
    content: 'Andy Weir delivers another brilliant science fiction novel. The scientific accuracy is impressive.',
    date: '2024-01-20',
    helpful: 15
  }
];

export const FEATURED_BOOKS: Book[] = MOCK_BOOKS.slice(0, 3);

export const MOST_VIEWED_BOOKS: Book[] = [...MOCK_BOOKS].sort((a, b) => b.viewCount - a.viewCount);
export const MOST_READ_BOOKS: Book[] = [...MOCK_BOOKS].sort((a, b) => b.readCount - a.readCount);
export const TOP_RATED_BOOKS: Book[] = [...MOCK_BOOKS].sort((a, b) => b.rating - a.rating);