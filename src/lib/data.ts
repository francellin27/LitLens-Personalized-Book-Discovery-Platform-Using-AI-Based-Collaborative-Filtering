export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number;
  totalRatings: number;
  userRating?: number;
  genre: string;
  description: string;
  publishedYear: number;
  pages: number;
  isbn: string;
  views?: number;
  readers?: number;
  reviews?: Review[];
}

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

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150',
    rating: 5,
    comment: 'Absolutely beautiful and thought-provoking. Made me reflect on the choices I make every day.',
    date: '2024-01-15',
    helpful: 23
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Mark Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4,
    comment: 'Great concept and writing, though it felt a bit slow in the middle sections.',
    date: '2024-01-10',
    helpful: 15
  },
  {
    id: 'r3',
    userId: 'u3',
    userName: 'Emma Davis',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 5,
    comment: 'A masterpiece that explores the infinite possibilities of life. Highly recommend!',
    date: '2024-01-08',
    helpful: 31
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://images.unsplash.com/photo-1535269414141-739bf0054cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rJTIwY292ZXIlMjB2aW50YWdlJTIwbGl0ZXJhdHVyZXxlbnwxfHx8fDE3NTg1OTMzODF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.2,
    totalRatings: 15234,
    genre: 'Fiction',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how different choices would affect your life. Would you have done anything different, if you had the chance to undo your regrets?',
    publishedYear: 2020,
    pages: 288,
    isbn: '978-0525559474',
    views: 45672,
    readers: 12834,
    reviews: MOCK_REVIEWS
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    cover: 'https://images.unsplash.com/uploads/1413498852637ad9a7e80/1569fece?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMGJvb2slMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1ODU5MzM4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    totalRatings: 8956,
    genre: 'Science Fiction',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
    publishedYear: 2021,
    pages: 496,
    isbn: '978-0593135204',
    views: 32145,
    readers: 7823,
    reviews: []
  },
  {
    id: '3',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    cover: 'https://images.unsplash.com/photo-1717261664981-12b23eed3092?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwbm92ZWwlMjBib29rJTIwY292ZXJ8ZW58MXx8fHwxNzU4NTEyODM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.5,
    totalRatings: 23145,
    genre: 'Romance',
    description: 'Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.',
    publishedYear: 2017,
    pages: 400,
    isbn: '978-1501161933',
    views: 67892,
    readers: 18456,
    reviews: []
  },
  {
    id: '4',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    cover: 'https://images.unsplash.com/photo-1636124953900-85565194dc7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxteXN0ZXJ5JTIwdGhyaWxsZXIlMjBib29rJTIwZGFya3xlbnwxfHx8fDE3NTg1OTMzODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.1,
    totalRatings: 19847,
    genre: 'Thriller',
    description: 'A woman refuses to speak after allegedly murdering her husband. A psychotherapist becomes obsessed with treating her.',
    publishedYear: 2019,
    pages: 336,
    isbn: '978-1250301697',
    views: 54321,
    readers: 15674,
    reviews: []
  },
  {
    id: '5',
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    cover: 'https://images.unsplash.com/photo-1685478237148-aaf613b2e8ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW50YXN5JTIwYm9vayUyMGNvdmVyJTIwbWFnaWNhbHxlbnwxfHx8fDE3NTg1OTMzODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    totalRatings: 31256,
    genre: 'Fantasy',
    description: 'Told in Kvothe\'s own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen.',
    publishedYear: 2007,
    pages: 662,
    isbn: '978-0756404079',
    views: 89234,
    readers: 25678,
    reviews: []
  },
  {
    id: '6',
    title: 'Educated',
    author: 'Tara Westover',
    cover: 'https://images.unsplash.com/photo-1674653760708-f521366e5cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBib29rJTIwc3RhY2slMjBsaWJyYXJ5fGVufDF8fHx8MTc1ODU5MzM4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.4,
    totalRatings: 42189,
    genre: 'Biography',
    description: 'A memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    publishedYear: 2018,
    pages: 334,
    isbn: '978-0399590504',
    views: 73456,
    readers: 35892,
    reviews: []
  }
];

export const FEATURED_BOOKS: Book[] = MOCK_BOOKS.slice(0, 3);

export const TRENDING_BOOKS: Book[] = MOCK_BOOKS.sort((a, b) => b.totalRatings - a.totalRatings).slice(0, 4);