// Book data and interfaces for LitLens
export interface Book {
  id: string;
  title: string;
  author: string;
  authorInfo?: string;
  cover: string;
  rating: number;
  totalRatings: number;
  userRating?: number;
  genre: string[];
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
  reviews?: Review[];
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
  isReported?: boolean;
  reportCount?: number;
}

export interface ReviewReport {
  id: string;
  reviewId: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  date: string;
  status: "pending" | "reviewed" | "dismissed" | "actionTaken";
}

export interface UserProfile {
  bookshelf: string[];
  completedBooks: string[];
  favorites: string[];
  readingList: string[];
  reviews: Review[];
}

export interface BookRecommendation {
  book: Book;
  reason: string;
  basedOnBook?: Book;
}

// Constants for filters
export const GENRES = [
  "All",
  "Fiction",
  "Non-Fiction",
  "Romance",
  "Fantasy",
  "Science Fiction",
  "Mystery",
  "Thriller",
  "Biography",
  "History",
  "Self-Help",
];

export const PUBLISHERS = [
  "All Publishers",
  "Viking",
  "Ballantine Books",
  "Atria Books",
  "Celadon Books",
  "DAW Books",
  "Random House",
  "Penguin",
  "HarperCollins",
  "Simon & Schuster",
  "Macmillan",
  "Scholastic",
  "Hachette",
  "Oxford University Press",
  "Cambridge University Press",
];

export const LANGUAGES = [
  "All Languages",
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Filipino",
  "Chinese",
  "Japanese",
];

export const YEARS = [
  "All Years",
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
  "2017",
  "2016",
  "2015",
  "2010-2014",
  "2000-2009",
  "Before 2000",
];

// Mock books data
export const MOCK_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    authorInfo:
      "Matt Haig is a British author of fiction and non-fiction books for both adults and children.",
    cover:
      "https://pbs.twimg.com/media/G1hK3HGaoAYYdnN?format=jpg&name=large",
    rating: 4.2,
    totalRatings: 15234,
    genre: ["Fiction"],
    description:
      "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    publishedYear: 2020,
    pages: 288,
    isbn: "978-0525559474",
    publisher: "Viking",
    language: "English",
    viewCount: 45200,
    readCount: 12800,
    length: "6 hours 15 minutes",
    publishingInfo: "Published by Viking in August 2020",
    reviews: [
      {
        id: "1",
        bookId: "1",
        userId: "1",
        userName: "Sarah Johnson",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 5,
        title: "Life-changing read",
        content:
          "This book completely changed my perspective on life and the choices we make. Beautifully written and deeply philosophical.",
        date: "2024-01-15",
        helpful: 12,
      },
      {
        id: "2",
        bookId: "1",
        userId: "2",
        userName: "Michael Chen",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 4,
        title: "Thought-provoking",
        content:
          "A unique concept executed well. Made me think about alternate paths in life.",
        date: "2024-01-10",
        helpful: 8,
      },
      {
        id: "3",
        bookId: "1",
        userId: "3",
        userName: "Emma Wilson",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Absolutely brilliant",
        content:
          "Matt Haig has created something truly special here. The concept of the midnight library is both comforting and challenging.",
        date: "2024-01-08",
        helpful: 15,
      },
      {
        id: "31",
        bookId: "1",
        userId: "31",
        userName: "Robert Clark",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 3,
        title: "Interesting concept but slow",
        content:
          "The idea of the midnight library is fascinating, but the execution felt repetitive after a while. Some beautiful moments though.",
        date: "2024-01-06",
        helpful: 7,
      },
      {
        id: "32",
        bookId: "1",
        userId: "32",
        userName: "Nancy Peterson",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 2,
        title: "Too philosophical for me",
        content:
          "I expected more plot and less philosophizing. The main character's constant regret became tiresome.",
        date: "2024-01-04",
        helpful: 3,
      },
      {
        id: "33",
        bookId: "1",
        userId: "33",
        userName: "Mark Thompson",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 1,
        title: "Disappointing and pretentious",
        content:
          "I couldn't connect with the protagonist at all. The writing felt pretentious and the concept was poorly executed. Gave up halfway through.",
        date: "2024-01-02",
        helpful: 2,
      },
    ],
  },
  {
    id: "2",
    title: "The Maze Runner",
    author: "James Dashner",
    authorInfo:
      "James Dashner is an American author best known for writing the dystopian science fiction series The Maze Runner.",
    cover:
      "https://pbs.twimg.com/media/G1hK3HFbkAA3-L4?format=jpg&name=large",
    rating: 4.6,
    totalRatings: 8956,
    genre: ["Science Fiction", "Dystopian"],
    description:
      "The Maze Runner follows Thomas, who wakes up in a mysterious maze with no memory, where he and other boys must work together to escape; danger intensifies when a girl arrives with a message that changes everything. It's a fast-paced survival story blending mystery, suspense, and dystopian adventure.",
    publishedYear: 2021,
    pages: 375,
    isbn: "978-0385737944",
    publisher: "Delacorte Press",
    language: "English",
    viewCount: 38900,
    readCount: 15600,
    length: "16 hours 10 minutes",
    publishingInfo:
      "Published by Delacorte Press in October 2021",
    reviews: [
      {
        id: "4",
        bookId: "2",
        userId: "4",
        userName: "Alex Turner",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 5,
        title: "Edge-of-your-seat thriller",
        content:
          "Could not put this down! The maze concept is brilliant and the characters feel real. Perfect blend of mystery and action.",
        date: "2024-01-12",
        helpful: 22,
      },
      {
        id: "5",
        bookId: "2",
        userId: "5",
        userName: "Jessica Martinez",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 4,
        title: "Great start to the series",
        content:
          "Love the dystopian setting and the world-building. Some parts felt rushed but overall a compelling read.",
        date: "2024-01-05",
        helpful: 18,
      },
      {
        id: "6",
        bookId: "2",
        userId: "6",
        userName: "David Kim",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 3,
        title: "Good but predictable",
        content:
          "The concept is interesting but some plot twists were predictable. Still entertaining enough to finish.",
        date: "2024-01-02",
        helpful: 9,
      },
      {
        id: "34",
        bookId: "2",
        userId: "34",
        userName: "Jennifer Lee",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 2,
        title: "Too many clichés",
        content:
          "The dystopian setting has been done before and better. The characters felt one-dimensional and the dialogue was cringe-worthy.",
        date: "2024-01-01",
        helpful: 4,
      },
      {
        id: "35",
        bookId: "2",
        userId: "35",
        userName: "Steve Martinez",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 1,
        title: "Waste of time",
        content:
          "Poorly written with plot holes everywhere. The premise is interesting but the execution is terrible. Characters make nonsensical decisions.",
        date: "2023-12-30",
        helpful: 1,
      },
    ],
  },
  {
    id: "3",
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    authorInfo:
      "Taylor Jenkins Reid is an American author known for her novels about complex female characters.",
    cover:
      "https://pbs.twimg.com/media/G1hK3NgbkAApGHd?format=jpg&name=large",
    rating: 4.5,
    totalRatings: 23145,
    genre: ["Romance", "Contemporary Fiction"],
    description:
      "Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.",
    publishedYear: 2017,
    pages: 400,
    isbn: "978-1501161933",
    publisher: "Atria Books",
    language: "English",
    viewCount: 67300,
    readCount: 28900,
    length: "12 hours 5 minutes",
    publishingInfo: "Published by Atria Books in June 2017",
    reviews: [
      {
        id: "7",
        bookId: "3",
        userId: "7",
        userName: "Amanda Rodriguez",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 5,
        title: "Absolutely captivating",
        content:
          "Evelyn Hugo is one of the most compelling characters I have ever read. This book had me completely hooked from start to finish.",
        date: "2024-01-18",
        helpful: 31,
      },
      {
        id: "8",
        bookId: "3",
        userId: "8",
        userName: "Marcus Thompson",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 4,
        title: "Well-crafted story",
        content:
          "Beautiful storytelling and character development. The Hollywood setting feels authentic and glamorous.",
        date: "2024-01-14",
        helpful: 19,
      },
      {
        id: "9",
        bookId: "3",
        userId: "9",
        userName: "Riley Parker",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Emotional masterpiece",
        content:
          "This book made me laugh, cry, and everything in between. Evelyn's story is both heartbreaking and inspiring.",
        date: "2024-01-11",
        helpful: 27,
      },
      {
        id: "36",
        bookId: "3",
        userId: "36",
        userName: "Patricia Moore",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 3,
        title: "Decent but overhyped",
        content:
          "I can see why people like it, but it didn't live up to the massive hype for me. The story is engaging but predictable in places.",
        date: "2024-01-09",
        helpful: 8,
      },
      {
        id: "37",
        bookId: "3",
        userId: "37",
        userName: "Brian Foster",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 2,
        title: "Too melodramatic",
        content:
          "The story felt overly dramatic and the characters made questionable choices just to create conflict. Not my cup of tea.",
        date: "2024-01-07",
        helpful: 5,
      },
      {
        id: "38",
        bookId: "3",
        userId: "38",
        userName: "Linda Stewart",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 1,
        title: "Couldn't finish it",
        content:
          "I tried to get into this book but found the writing style annoying and the plot unbelievable. Evelyn Hugo was insufferable.",
        date: "2024-01-05",
        helpful: 2,
      },
    ],
  },
  {
    id: "4",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    authorInfo:
      "Alex Michaelides is a British-Cypriot author and screenwriter.",
    cover:
      "https://pbs.twimg.com/media/G1hK3JXbgAA31Ud?format=jpg&name=large",
    rating: 4.1,
    totalRatings: 19847,
    genre: ["Thriller", "Psychological Fiction"],
    description:
      "A woman refuses to speak after allegedly murdering her husband. A psychotherapist becomes obsessed with treating her.",
    publishedYear: 2019,
    pages: 336,
    isbn: "978-1250301697",
    publisher: "Celadon Books",
    language: "English",
    viewCount: 52100,
    readCount: 19200,
    length: "8 hours 43 minutes",
    publishingInfo:
      "Published by Celadon Books in February 2019",
    reviews: [
      {
        id: "10",
        bookId: "4",
        userId: "10",
        userName: "Lisa Chen",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 4,
        title: "Twisted psychological thriller",
        content:
          "The plot twist at the end completely blindsided me! Excellently crafted psychological suspense.",
        date: "2024-01-20",
        helpful: 24,
      },
      {
        id: "11",
        bookId: "4",
        userId: "11",
        userName: "Robert Wilson",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 3,
        title: "Good premise, slow start",
        content:
          "The concept is intriguing but it took a while to get going. The ending makes it worth the wait though.",
        date: "2024-01-16",
        helpful: 12,
      },
      {
        id: "12",
        bookId: "4",
        userId: "12",
        userName: "Sophie Davis",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Could not put it down",
        content:
          "Read this in one sitting! The atmosphere is perfectly unsettling and the characters are so well developed.",
        date: "2024-01-13",
        helpful: 18,
      },
      {
        id: "39",
        bookId: "4",
        userId: "39",
        userName: "Gary Williams",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 3,
        title: "Solid thriller but predictable",
        content:
          "The psychological elements are well done but I figured out the twist pretty early. Still an entertaining read overall.",
        date: "2024-01-12",
        helpful: 6,
      },
      {
        id: "40",
        bookId: "4",
        userId: "40",
        userName: "Helen Davis",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 2,
        title: "Disappointing ending",
        content:
          "The buildup was good but the ending felt rushed and unsatisfying. The twist was more confusing than clever.",
        date: "2024-01-10",
        helpful: 4,
      },
      {
        id: "41",
        bookId: "4",
        userId: "41",
        userName: "Paul Anderson",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 1,
        title: "Terrible writing",
        content:
          "The prose is clunky and the characters are completely unrealistic. The therapist's behavior is unethical and unbelievable.",
        date: "2024-01-08",
        helpful: 1,
      },
    ],
  },
  {
    id: "5",
    title: "The Ballad of Songbirds and Snakes",
    author: "Suzanne Collins",
    authorInfo:
      "Suzanne Collins is an American author best known for The Hunger Games trilogy.",
    cover:
      "https://pbs.twimg.com/media/G1hKzPKbkAADPLN?format=jpg&name=large",
    rating: 4.7,
    totalRatings: 31256,
    genre: ["Dystopian Fiction", "Young Adult"],
    description:
      "The story follows a young Coriolanus Snow, years before he becomes the tyrannical president of Panem, as he mentors a girl from District 12 during the 10th Hunger Games. Torn between ambition, survival, and unexpected feelings, Snow's choices set the foundation for the future of Panem.",
    publishedYear: 2020,
    pages: 517,
    isbn: "978-1338635171",
    publisher: "Scholastic Press",
    language: "English",
    viewCount: 78400,
    readCount: 35700,
    length: "16 hours 16 minutes",
    publishingInfo: "Published by Scholastic Press in May 2020",
    reviews: [
      {
        id: "13",
        bookId: "5",
        userId: "13",
        userName: "Jordan Lee",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 5,
        title: "Brilliant prequel",
        content:
          "Collins masterfully shows how Snow became the villain we know. The character development is incredible.",
        date: "2024-01-22",
        helpful: 35,
      },
      {
        id: "14",
        bookId: "5",
        userId: "14",
        userName: "Maya Singh",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 4,
        title: "Complex moral story",
        content:
          "Love how this explores the grey areas of morality. Snow's transformation is both fascinating and disturbing.",
        date: "2024-01-19",
        helpful: 28,
      },
      {
        id: "15",
        bookId: "5",
        userId: "15",
        userName: "Ethan Brown",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 5,
        title: "Worth the wait",
        content:
          "After years of waiting for more Hunger Games content, this exceeded all my expectations. Lucy Gray is amazing!",
        date: "2024-01-17",
        helpful: 32,
      },
      {
        id: "42",
        bookId: "5",
        userId: "42",
        userName: "Rachel Green",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 3,
        title: "Good but too long",
        content:
          "Interesting to see Snow's origin story but the book could have been 200 pages shorter. Some parts dragged considerably.",
        date: "2024-01-15",
        helpful: 11,
      },
      {
        id: "43",
        bookId: "5",
        userId: "43",
        userName: "Mike Wilson",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 2,
        title: "Unnecessary prequel",
        content:
          "We didn't need Snow's backstory. It makes him less intimidating as a villain and the pacing is all wrong.",
        date: "2024-01-13",
        helpful: 6,
      },
      {
        id: "44",
        bookId: "5",
        userId: "44",
        userName: "Carol Johnson",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 1,
        title: "Ruined the original series",
        content:
          "This book completely destroyed my image of Snow as a compelling villain. The writing is also much weaker than the original trilogy.",
        date: "2024-01-11",
        helpful: 3,
      },
    ],
  },
  {
    id: "6",
    title: "The Love Hypothesis",
    author: "Ali Hazelwood",
    authorInfo:
      "Ali Hazelwood is an Italian neuroscientist and author best known for writing contemporary romance novels featuring STEM heroines.",
    cover:
      "https://pbs.twimg.com/media/G1hKzPJaoAMTfwS?format=jpg&name=large",
    rating: 4.4,
    totalRatings: 42189,
    genre: ["Romantic Comedy", "Contemporary Romance"],
    description:
      "The story follows Olive Smith, a PhD student who fakes a relationship with a young professor, Adam Carlsen, to convince her best friend she's moved on. What starts as a pretend romance slowly develops into something real, challenging Olive's fears about love and vulnerability.",
    publishedYear: 2021,
    pages: 384,
    isbn: "978-0593336823",
    publisher: "Berkley",
    language: "English",
    viewCount: 89600,
    readCount: 45300,
    length: "11 hours 55 minutes",
    publishingInfo: "Published by Berkley in September 2021",
    reviews: [
      {
        id: "16",
        bookId: "6",
        userId: "16",
        userName: "Grace Taylor",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 5,
        title: "Perfect STEM romance",
        content:
          "As a PhD student myself, I loved the authentic academic setting. The romance is swoon-worthy and the science is accurate!",
        date: "2024-01-21",
        helpful: 41,
      },
      {
        id: "17",
        bookId: "6",
        userId: "17",
        userName: "Noah Garcia",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 4,
        title: "Enemies to lovers done right",
        content:
          "Great character development and chemistry. Adam is the perfect grumpy love interest.",
        date: "2024-01-18",
        helpful: 33,
      },
      {
        id: "18",
        bookId: "6",
        userId: "18",
        userName: "Zoe Anderson",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 4,
        title: "Heartwarming and funny",
        content:
          "Made me laugh out loud multiple times. Olive is such a relatable protagonist with realistic insecurities.",
        date: "2024-01-15",
        helpful: 29,
      },
      {
        id: "45",
        bookId: "6",
        userId: "45",
        userName: "Thomas Brown",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 3,
        title: "Cute but formulaic",
        content:
          "It's a sweet romance but follows the typical romance novel formula exactly. Predictable but still enjoyable if you like the genre.",
        date: "2024-01-13",
        helpful: 12,
      },
      {
        id: "46",
        bookId: "6",
        userId: "46",
        userName: "Sandra Miller",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 2,
        title: "Too much miscommunication",
        content:
          "The entire plot could be resolved if the characters just talked to each other. The fake dating trope is overdone.",
        date: "2024-01-11",
        helpful: 7,
      },
      {
        id: "47",
        bookId: "6",
        userId: "47",
        userName: "Richard Taylor",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 1,
        title: "Cringeworthy dialogue",
        content:
          "The dialogue is painfully bad and the characters act like teenagers despite being PhD students. Could not take it seriously.",
        date: "2024-01-09",
        helpful: 4,
      },
    ],
  },
  {
    id: "7",
    title: "The Thursday Murder Club",
    author: "Richard Osman",
    authorInfo:
      "Richard Osman is an English television presenter, producer, comedian, and writer.",
    cover:
      "https://pbs.twimg.com/media/G1hK7NgbkAAVxIl?format=jpg&name=large",
    rating: 4.3,
    totalRatings: 18654,
    genre: ["Mystery", "Cozy Mystery"],
    description:
      "Four unlikely friends meet weekly in the Coopers Chase retirement village to investigate cold cases.",
    publishedYear: 2020,
    pages: 368,
    isbn: "978-1984880567",
    publisher: "Random House",
    language: "English",
    viewCount: 42300,
    readCount: 23100,
    length: "9 hours 45 minutes",
    publishingInfo:
      "Published by Random House in September 2020",
    reviews: [
      {
        id: "19",
        bookId: "7",
        userId: "19",
        userName: "Dorothy Miller",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 5,
        title: "Charming and clever",
        content:
          "What a delightful mystery! The elderly protagonists are endearing and surprisingly sharp. Love the humor throughout.",
        date: "2024-01-23",
        helpful: 26,
      },
      {
        id: "20",
        bookId: "7",
        userId: "20",
        userName: "Frank Johnson",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 4,
        title: "Cozy mystery at its best",
        content:
          "Perfect blend of mystery and humor. The characters feel like people you would actually want to spend time with.",
        date: "2024-01-20",
        helpful: 21,
      },
      {
        id: "21",
        bookId: "7",
        userId: "21",
        userName: "Barbara White",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 4,
        title: "Refreshing take on mystery",
        content:
          "Love seeing older characters as the protagonists for once! The mystery is well-crafted and engaging.",
        date: "2024-01-17",
        helpful: 18,
      },
      {
        id: "48",
        bookId: "7",
        userId: "48",
        userName: "George Clark",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 3,
        title: "Light mystery read",
        content:
          "Pleasant enough but the mystery isn't very challenging. More focused on character interactions than actual detective work.",
        date: "2024-01-15",
        helpful: 9,
      },
      {
        id: "49",
        bookId: "7",
        userId: "49",
        userName: "Margaret Lewis",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 2,
        title: "Too slow for my taste",
        content:
          "The pacing is too leisurely and the characters, while charming, don't feel realistic. The mystery lacks tension.",
        date: "2024-01-13",
        helpful: 5,
      },
      {
        id: "50",
        bookId: "7",
        userId: "50",
        userName: "James Roberts",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 1,
        title: "Boring and unrealistic",
        content:
          "I couldn't connect with any of the characters and the retirement home setting felt forced. The mystery was weak.",
        date: "2024-01-11",
        helpful: 2,
      },
    ],
  },
  {
    id: "8",
    title: "The Wise Man's Fear",
    author: "Patrick Rothfuss",
    authorInfo:
      "Patrick Rothfuss is an American author of epic fantasy.",
    cover:
      "https://pbs.twimg.com/media/G1hK7Nea0AA3fKi?format=jpg&name=large",
    rating: 4.6,
    totalRatings: 28934,
    genre: ["Fantasy", "Epic Fantasy"],
    description:
      "The second day of Kvothe's story continues with his adventures at the University and beyond.",
    publishedYear: 2011,
    pages: 994,
    isbn: "978-0756407919",
    publisher: "DAW Books",
    language: "English",
    viewCount: 65200,
    readCount: 31400,
    length: "43 hours 22 minutes",
    publishingInfo: "Published by DAW Books in March 2011",
    reviews: [
      {
        id: "22",
        bookId: "8",
        userId: "22",
        userName: "Sam Cooper",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 5,
        title: "Fantasy masterpiece",
        content:
          "Rothfuss's prose is absolutely beautiful. The world-building is incredible and Kvothe is such a compelling character.",
        date: "2024-01-24",
        helpful: 45,
      },
      {
        id: "23",
        bookId: "8",
        userId: "23",
        userName: "Elena Vasquez",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 4,
        title: "Beautiful but long",
        content:
          "The writing is gorgeous but it's quite lengthy. Still worth it for the magic system and character development.",
        date: "2024-01-21",
        helpful: 29,
      },
      {
        id: "24",
        bookId: "8",
        userId: "24",
        userName: "Tyler Adams",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 5,
        title: "Waiting for book 3!",
        content:
          "This series just keeps getting better. The storytelling is masterful and I need the third book NOW!",
        date: "2024-01-18",
        helpful: 38,
      },
      {
        id: "51",
        bookId: "8",
        userId: "51",
        userName: "Victoria Adams",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 3,
        title: "Beautiful prose but slow plot",
        content:
          "Rothfuss's writing is gorgeous but the story moves at a snail's pace. Too much time spent on side quests and not enough main plot.",
        date: "2024-01-16",
        helpful: 14,
      },
      {
        id: "52",
        bookId: "8",
        userId: "52",
        userName: "Daniel White",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 2,
        title: "Disappointing sequel",
        content:
          "After the brilliant first book, this was a letdown. Too much focus on romance and not enough on the compelling mystery.",
        date: "2024-01-14",
        helpful: 8,
      },
      {
        id: "53",
        bookId: "8",
        userId: "53",
        userName: "Susan Garcia",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 1,
        title: "Tedious and self-indulgent",
        content:
          "Nearly 1000 pages with very little plot progression. Kvothe has become insufferable and the Felurian section was cringe.",
        date: "2024-01-12",
        helpful: 5,
      },
    ],
  },
  {
    id: "9",
    title: "It Ends with Us",
    author: "Colleen Hoover",
    authorInfo:
      "Colleen Hoover is an American author who writes primarily novels in the romance genre.",
    cover:
      "https://pbs.twimg.com/media/G1hKzPKbQAAU7HZ?format=jpg&name=large",
    rating: 4.4,
    totalRatings: 34567,
    genre: ["Romance", "Contemporary Fiction"],
    description:
      "A powerful story about love, courage, and finding the strength to start over when your world falls apart.",
    publishedYear: 2016,
    pages: 384,
    isbn: "978-1501110368",
    publisher: "Atria Books",
    language: "English",
    viewCount: 72800,
    readCount: 41200,
    length: "11 hours 15 minutes",
    publishingInfo: "Published by Atria Books in August 2016",
    reviews: [
      {
        id: "25",
        bookId: "9",
        userId: "25",
        userName: "Ashley Roberts",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 5,
        title: "Emotional and important",
        content:
          "This book tackles difficult topics with sensitivity and grace. Lily's story is heartbreaking but ultimately hopeful.",
        date: "2024-01-25",
        helpful: 52,
      },
      {
        id: "26",
        bookId: "9",
        userId: "26",
        userName: "Kevin Martinez",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 4,
        title: "Powerful and raw",
        content:
          "Hoover does not shy away from difficult subjects. The character development is excellent and the message is important.",
        date: "2024-01-22",
        helpful: 31,
      },
      {
        id: "27",
        bookId: "9",
        userId: "27",
        userName: "Megan Foster",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 4,
        title: "Hard to read but worth it",
        content:
          "Trigger warning for domestic violence, but it's handled thoughtfully. A story that needed to be told.",
        date: "2024-01-19",
        helpful: 28,
      },
      {
        id: "54",
        bookId: "9",
        userId: "54",
        userName: "Christopher Lee",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 3,
        title: "Important topic, average execution",
        content:
          "The subject matter is vital but the writing feels simplistic at times. Still worth reading for the message about domestic violence.",
        date: "2024-01-17",
        helpful: 10,
      },
      {
        id: "55",
        bookId: "9",
        userId: "55",
        userName: "Jessica Parker",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 2,
        title: "Too heavy-handed",
        content:
          "The message is important but it feels like being hit over the head with it. The characters lack depth beyond their trauma.",
        date: "2024-01-15",
        helpful: 6,
      },
      {
        id: "56",
        bookId: "9",
        userId: "56",
        userName: "Anthony Davis",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 1,
        title: "Poorly written and triggering",
        content:
          "The writing quality is poor and it handles serious subjects carelessly. Not well-researched and potentially harmful.",
        date: "2024-01-13",
        helpful: 3,
      },
    ],
  },
  {
    id: "10",
    title: "Becoming",
    author: "Michelle Obama",
    authorInfo:
      "Michelle Obama is an American attorney, author, and former First Lady of the United States.",
    cover:
      "https://pbs.twimg.com/media/G1hKzP9bwAAwQUl?format=jpg&name=large",
    rating: 4.5,
    totalRatings: 52143,
    genre: ["Biography", "Memoir"],
    description:
      "Former First Lady Michelle Obama's deeply personal memoir about her life, from her childhood to her years in the White House.",
    publishedYear: 2018,
    pages: 448,
    isbn: "978-1524763138",
    publisher: "Random House",
    language: "English",
    viewCount: 98500,
    readCount: 56700,
    length: "19 hours 3 minutes",
    publishingInfo:
      "Published by Random House in November 2018",
    reviews: [
      {
        id: "28",
        bookId: "10",
        userId: "28",
        userName: "Janet Williams",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Inspiring and genuine",
        content:
          "Michelle Obama's warmth and authenticity shine through every page. Her story is both personal and universally inspiring.",
        date: "2024-01-26",
        helpful: 67,
      },
      {
        id: "29",
        bookId: "10",
        userId: "29",
        userName: "Carlos Rodriguez",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 4,
        title: "Honest and reflective",
        content:
          "Great insights into life in the White House and her journey. Her voice comes through clearly in the writing.",
        date: "2024-01-23",
        helpful: 41,
      },
      {
        id: "30",
        bookId: "10",
        userId: "30",
        userName: "Diana Chen",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 5,
        title: "A masterful memoir",
        content:
          "Beautifully written and deeply moving. Michelle Obama shares her story with grace, humor, and wisdom.",
        date: "2024-01-20",
        helpful: 58,
      },
      {
        id: "57",
        bookId: "10",
        userId: "57",
        userName: "William Johnson",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 3,
        title: "Interesting but lengthy",
        content:
          "Michelle Obama's story is compelling but the book could have been shorter. Some sections feel repetitive.",
        date: "2024-01-18",
        helpful: 13,
      },
      {
        id: "58",
        bookId: "10",
        userId: "58",
        userName: "Barbara Martinez",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 2,
        title: "Too political for me",
        content:
          "Expected more personal stories and less political commentary. Felt like campaign material at times.",
        date: "2024-01-16",
        helpful: 7,
      },
      {
        id: "59",
        bookId: "10",
        userId: "59",
        userName: "Robert Thompson",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 1,
        title: "Self-congratulatory",
        content:
          "Comes across as self-serving and lacks genuine self-reflection. More of a PR exercise than an honest memoir.",
        date: "2024-01-14",
        helpful: 4,
      },
    ],
  },
  {
    id: "11",
    title: "Atomic Habits",
    author: "James Clear",
    authorInfo:
      "James Clear is an American author and speaker focused on habits, decision making, and continuous improvement.",
    cover:
      "https://pbs.twimg.com/media/G2uSGnUbQAEGsFX?format=jpg&name=large",
    rating: 4.8,
    totalRatings: 67892,
    genre: ["Self-Help", "Psychology"],
    description:
      "A proven framework for improving every day. Learn how tiny changes can deliver remarkable results.",
    publishedYear: 2018,
    pages: 320,
    isbn: "978-0735211292",
    publisher: "Avery",
    language: "English",
    viewCount: 125600,
    readCount: 87400,
    length: "5 hours 35 minutes",
    publishingInfo: "Published by Avery in October 2018",
    reviews: [
      {
        id: "60",
        bookId: "11",
        userId: "60",
        userName: "Michael Chang",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 5,
        title: "Life-changing approach to habits",
        content:
          "This book completely transformed how I think about building habits. The 1% better principle really works!",
        date: "2024-01-25",
        helpful: 89,
      },
    ],
  },
  {
    id: "12",
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling",
    authorInfo:
      "J.K. Rowling is a British author best known for writing the globally beloved Harry Potter series, which has captivated readers with its blend of magic, friendship, and adventure.",
    cover:
      "https://pbs.twimg.com/media/G2zeJvraAAAMsIG?format=jpg&name=large",
    rating: 4.8,
    totalRatings: 2987456,
    genre: ["Fantasy", "Adventure", "Young Adult"],
    description:
      "In his second year at Hogwarts, Harry Potter faces new dangers as a mysterious force begins to petrify students, leading him to uncover the secrets hidden within the Chamber of Secrets.",
    publishedYear: 1998,
    pages: 341,
    isbn: "978-0439064873",
    publisher: "Bloomsbury Publishing",
    language: "English",
    viewCount: 489300,
    readCount: 421700,
    length: "10 hours 25 minutes",
    publishingInfo:
      "First published in 1998 by Bloomsbury Publishing, London",
    reviews: [
      {
        id: "61",
        bookId: "12",
        userId: "61",
        userName: "Sarah Williams",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 5,
        title: "Beautiful and haunting",
        content:
          "The description of the marsh is so vivid, I felt like I was there. A truly captivating mystery.",
        date: "2024-01-23",
        helpful: 67,
      },
    ],
  },
  {
    id: "13",
    title: "Educated",
    author: "Tara Westover",
    authorInfo:
      "Tara Westover is an American memoirist, essayist, and historian.",
    cover:
      "https://pbs.twimg.com/media/G2uSHYwbIAA3oeE?format=jpg&name=large",
    rating: 4.6,
    totalRatings: 78234,
    genre: ["Biography", "Memoir"],
    description:
      "A memoir about a young girl who grows up in a survivalist family and eventually gets a PhD from Cambridge.",
    publishedYear: 2018,
    pages: 334,
    isbn: "978-0399590504",
    publisher: "Random House",
    language: "English",
    viewCount: 92100,
    readCount: 67800,
    length: "12 hours 10 minutes",
    publishingInfo:
      "Published by Random House in February 2018",
    reviews: [
      {
        id: "62",
        bookId: "13",
        userId: "62",
        userName: "Jennifer Lee",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Powerful and inspiring",
        content:
          "An incredible story of resilience and the transformative power of education. Beautifully written.",
        date: "2024-01-22",
        helpful: 83,
      },
    ],
  },
  {
    id: "14",
    title: "Isabel in Bloom",
    author: "Mae Coyiuto",
    authorInfo:
      "Mae Coyiuto is a Filipino-Chinese writer based in Manila, known for her heartfelt storytelling that explores identity, family, and the Filipino experience.",
    cover:
      "https://pbs.twimg.com/media/G2zbzEUaYAApVeh?format=jpg&name=large",
    rating: 4.6,
    totalRatings: 112345,
    genre: ["Contemporary Fiction", "Young Adult", "Romance"],
    description:
      "Isabel in Bloom follows a young Filipina navigating love, grief, and rediscovery as she returns to Manila after years abroad, learning to reconnect with her roots and herself.",
    publishedYear: 2024,
    pages: 304,
    isbn: "978-0593640277",
    publisher: "Penguin Random House",
    language: "English",
    viewCount: 157800,
    readCount: 126400,
    length: "9 hours 15 minutes",
    publishingInfo:
      "Published by Penguin Random House in March 2024",
    reviews: [
      {
        id: "63",
        bookId: "14",
        userId: "63",
        userName: "Carlos Rodriguez",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 4,
        title: "Philosophical and inspiring",
        content:
          "A simple yet profound story about following your dreams. The allegorical style is beautiful.",
        date: "2024-01-21",
        helpful: 94,
      },
    ],
  },
  {
    id: "15",
    title: "Gone Girl",
    author: "Gillian Flynn",
    authorInfo:
      "Gillian Flynn is an American author, screenwriter, and critic.",
    cover:
      "https://pbs.twimg.com/media/G2uSL-JbwAAjpD2?format=jpg&name=large",
    rating: 4.1,
    totalRatings: 87453,
    genre: ["Thriller", "Mystery"],
    description:
      "A psychological thriller about a man whose wife disappears on their fifth wedding anniversary.",
    publishedYear: 2012,
    pages: 419,
    isbn: "978-0307588371",
    publisher: "Crown Publishing",
    language: "English",
    viewCount: 74500,
    readCount: 52300,
    length: "19 hours 8 minutes",
    publishingInfo:
      "Published by Crown Publishing in June 2012",
    reviews: [
      {
        id: "64",
        bookId: "15",
        userId: "64",
        userName: "Amanda Foster",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 4,
        title: "Twisted and gripping",
        content:
          "A dark psychological thriller that keeps you guessing. Flynn's writing is sharp and unsettling.",
        date: "2024-01-20",
        helpful: 76,
      },
    ],
  },
  {
    id: "16",
    title: "Sandangaw",
    author: "Voltaire Oyzon",
    authorInfo:
      "Voltaire Oyzon is a Waray poet and writer known for his contributions to Philippine regional literature, often celebrating identity, culture, and the human experience through his works.",
    cover:
      "https://pbs.twimg.com/media/G2zbqWtbsAAOjG9?format=jpg&name=large",
    rating: 4.5,
    totalRatings: 82340,
    genre: ["Poetry", "Waray Literature"],
    description:
      "Sandangaw is a moving Waray poem that tells the story of a small man who finds pride and meaning in his existence, reflecting on self-worth, humility, and the beauty of life’s simplicity.",
    publishedYear: 2005,
    pages: 8,
    isbn: "978-971-9999-00-1",
    publisher: "University of the Philippines Press",
    language: "Filipino",
    viewCount: 93200,
    readCount: 80200,
    length: "10 minutes",
    publishingInfo:
      "First published in a collection of Waray poems by Voltaire Oyzon under the University of the Philippines Press",
    reviews: [
      {
        id: "65",
        bookId: "16",
        userId: "65",
        userName: "David Thompson",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 4,
        title: "American classic",
        content:
          "A masterpiece of American literature. Fitzgerald's prose is beautiful and the symbolism is rich.",
        date: "2024-01-19",
        helpful: 112,
      },
    ],
  },
  {
    id: "17",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    authorInfo:
      "Harper Lee was an American novelist known for her Pulitzer Prize-winning novel.",
    cover:
      "https://pbs.twimg.com/media/G2uSMsdb0AAUwlL?format=jpg&name=large",
    rating: 4.4,
    totalRatings: 345678,
    genre: ["Fiction", "Classic Literature"],
    description:
      "A timeless story of childhood, innocence, and moral courage in the American South.",
    publishedYear: 1960,
    pages: 376,
    isbn: "978-0060935467",
    publisher: "J.B. Lippincott & Co.",
    language: "English",
    viewCount: 189300,
    readCount: 134500,
    length: "12 hours 17 minutes",
    publishingInfo:
      "Published by J.B. Lippincott & Co. in July 1960",
    reviews: [
      {
        id: "66",
        bookId: "17",
        userId: "66",
        userName: "Mary Johnson",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Timeless masterpiece",
        content:
          "A powerful story about justice, morality, and growing up. Scout is one of literature's greatest narrators.",
        date: "2024-01-18",
        helpful: 156,
      },
    ],
  },
  {
    id: "18",
    title: "1984",
    author: "George Orwell",
    authorInfo:
      "George Orwell was an English novelist, essayist, and critic.",
    cover:
      "https://pbs.twimg.com/media/G2uSGnYa0AA2S0v?format=jpg&name=large",
    rating: 4.5,
    totalRatings: 298765,
    genre: ["Dystopian Fiction", "Science Fiction"],
    description:
      "A dystopian novel about totalitarian control and the power of language in a surveillance state.",
    publishedYear: 1949,
    pages: 328,
    isbn: "978-0452284234",
    publisher: "Harcourt Brace Jovanovich",
    language: "English",
    viewCount: 167800,
    readCount: 123400,
    length: "11 hours 22 minutes",
    publishingInfo:
      "Published by Secker & Warburg in June 1949",
    reviews: [
      {
        id: "67",
        bookId: "18",
        userId: "67",
        userName: "Robert Kim",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 5,
        title: "Chilling and prophetic",
        content:
          "Orwell's vision of the future is terrifyingly relevant today. A must-read for understanding modern society.",
        date: "2024-01-17",
        helpful: 203,
      },
    ],
  },
  {
    id: "19",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    authorInfo:
      "J.R.R. Tolkien was an English writer, poet, and philologist.",
    cover:
      "https://pbs.twimg.com/media/G2uSNolbIAMykyQ?format=jpg&name=large",
    rating: 4.7,
    totalRatings: 187654,
    genre: ["Fantasy", "Adventure"],
    description:
      "The classic fantasy tale of Bilbo Baggins and his unexpected journey to the Lonely Mountain.",
    publishedYear: 1937,
    pages: 366,
    isbn: "978-0547928227",
    publisher: "Houghton Mifflin Harcourt",
    language: "English",
    viewCount: 145600,
    readCount: 89700,
    length: "11 hours 5 minutes",
    publishingInfo:
      "Originally published by George Allen & Unwin in September 1937",
    reviews: [
      {
        id: "68",
        bookId: "19",
        userId: "68",
        userName: "Emily Wilson",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 5,
        title: "A timeless adventure",
        content:
          "The perfect introduction to Middle-earth. Tolkien's world-building is unmatched and Bilbo is a wonderful protagonist.",
        date: "2024-01-16",
        helpful: 134,
      },
    ],
  },
  {
    id: "20",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    authorInfo:
      "Jane Austen was an English novelist known for her wit and social commentary.",
    cover:
      "https://pbs.twimg.com/media/G2uSJANa8AAQtVa?format=jpg&name=large",
    rating: 4.4,
    totalRatings: 267890,
    genre: ["Romance", "Classic Literature"],
    description:
      "The beloved story of Elizabeth Bennet and Mr. Darcy, exploring themes of love, class, and social expectations.",
    publishedYear: 1813,
    pages: 432,
    isbn: "978-0141439518",
    publisher: "Penguin Classics",
    language: "English",
    viewCount: 176500,
    readCount: 145300,
    length: "11 hours 35 minutes",
    publishingInfo:
      "Originally published by T. Egerton in January 1813",
    reviews: [
      {
        id: "69",
        bookId: "20",
        userId: "69",
        userName: "Catherine Brown",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Witty and romantic perfection",
        content:
          "Austen's wit and social observation are brilliant. Elizabeth and Darcy's relationship development is masterful.",
        date: "2024-01-15",
        helpful: 178,
      },
    ],
  },
  {
    id: "21",
    title: "Dune",
    author: "Frank Herbert",
    authorInfo:
      "Frank Herbert was an American science fiction author best known for his novel Dune.",
    cover:
      "https://pbs.twimg.com/media/G2uSHYsbIAEUsA-?format=jpg&name=large",
    rating: 4.6,
    totalRatings: 198765,
    genre: ["Science Fiction", "Epic Fantasy"],
    description:
      "Set on the desert planet Arrakis, this epic tale follows Paul Atreides as he navigates politics, religion, and ecology in a distant future.",
    publishedYear: 1965,
    pages: 688,
    isbn: "978-0441172719",
    publisher: "Ace Books",
    language: "English",
    viewCount: 234500,
    readCount: 156700,
    length: "21 hours 2 minutes",
    publishingInfo:
      "Originally published by Chilton Books in August 1965",
    reviews: [
      {
        id: "70",
        bookId: "21",
        userId: "70",
        userName: "Alex Chen",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 5,
        title: "Science fiction masterpiece",
        content:
          "Herbert created one of the most complex and detailed universes in science fiction. A true epic.",
        date: "2024-01-14",
        helpful: 245,
      },
    ],
  },
  {
    id: "22",
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    authorInfo:
      "Margaret Atwood is a Canadian poet, novelist, literary critic, and inventor.",
    cover:
      "https://pbs.twimg.com/media/G2uSKbLbUAAuVA1?format=jpg&name=large",
    rating: 4.3,
    totalRatings: 167543,
    genre: ["Dystopian Fiction", "Feminist Literature"],
    description:
      "A chilling tale of a totalitarian society where women's rights have been stripped away.",
    publishedYear: 1985,
    pages: 311,
    isbn: "978-0385490818",
    publisher: "McClelland & Stewart",
    language: "English",
    viewCount: 145600,
    readCount: 98300,
    length: "10 hours 56 minutes",
    publishingInfo:
      "Originally published by McClelland & Stewart in 1985",
    reviews: [
      {
        id: "71",
        bookId: "22",
        userId: "71",
        userName: "Maria Rodriguez",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 5,
        title: "Terrifyingly relevant",
        content:
          "Atwood's dystopian vision feels more relevant than ever. A powerful and necessary read.",
        date: "2024-01-13",
        helpful: 189,
      },
    ],
  },
  {
    id: "23",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    authorInfo:
      "Yuval Noah Harari is an Israeli historian and professor at the Hebrew University of Jerusalem.",
    cover:
      "https://pbs.twimg.com/media/G2uSJAMbIAccfm9?format=jpg&name=large",
    rating: 4.5,
    totalRatings: 234567,
    genre: ["Non-Fiction", "History"],
    description:
      "A fascinating exploration of how Homo sapiens came to rule the world through three major revolutions.",
    publishedYear: 2014,
    pages: 464,
    isbn: "978-0062316097",
    publisher: "Harper",
    language: "English",
    viewCount: 198700,
    readCount: 134500,
    length: "15 hours 17 minutes",
    publishingInfo:
      "Originally published in Hebrew in 2011, English edition by Harper in 2014",
    reviews: [
      {
        id: "72",
        bookId: "23",
        userId: "72",
        userName: "Dr. James Wilson",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 5,
        title: "Mind-expanding history",
        content:
          "Harari brilliantly weaves together anthropology, biology, and history. Changes how you see humanity.",
        date: "2024-01-12",
        helpful: 298,
      },
    ],
  },
  {
    id: "24",
    title: "The Shining",
    author: "Stephen King",
    authorInfo:
      "Stephen King is an American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels.",
    cover:
      "https://pbs.twimg.com/media/G2uSL-HbIAMBU70?format=jpg&name=large",
    rating: 4.4,
    totalRatings: 156789,
    genre: ["Horror", "Thriller"],
    description:
      "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence.",
    publishedYear: 1977,
    pages: 447,
    isbn: "978-0307743657",
    publisher: "Doubleday",
    language: "English",
    viewCount: 167800,
    readCount: 89400,
    length: "15 hours 50 minutes",
    publishingInfo: "Published by Doubleday in January 1977",
    reviews: [
      {
        id: "73",
        bookId: "24",
        userId: "73",
        userName: "Rachel Thompson",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Masterpiece of horror",
        content:
          "King at his absolute best. The psychological horror builds perfectly to a terrifying climax.",
        date: "2024-01-11",
        helpful: 167,
      },
    ],
  },
  {
    id: "25",
    title: "The Hunger Games",
    author: "Suzanne Collins",
    authorInfo:
      "Suzanne Collins is an American author best known for The Hunger Games trilogy.",
    cover:
      "https://pbs.twimg.com/media/G2uSL-GaQAAXuWe?format=jpg&name=large",
    rating: 4.3,
    totalRatings: 245678,
    genre: ["Young Adult", "Dystopian Fiction"],
    description:
      "In a dystopian future, Katniss Everdeen volunteers for a televised fight to the death to save her sister.",
    publishedYear: 2008,
    pages: 374,
    isbn: "978-0439023481",
    publisher: "Scholastic Press",
    language: "English",
    viewCount: 278900,
    readCount: 189600,
    length: "11 hours 11 minutes",
    publishingInfo:
      "Published by Scholastic Press in September 2008",
    reviews: [
      {
        id: "74",
        bookId: "25",
        userId: "74",
        userName: "Emma Davis",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 4,
        title: "Gripping dystopian adventure",
        content:
          "A thrilling start to the trilogy. Katniss is a strong, complex protagonist in a harsh world.",
        date: "2024-01-10",
        helpful: 234,
      },
    ],
  },
  {
    id: "26",
    title: "The Book Thief",
    author: "Markus Zusak",
    authorInfo:
      "Markus Zusak is an Australian writer of young adult fiction.",
    cover:
      "https://pbs.twimg.com/media/G2uSMsdawAAck0h?format=jpg&name=large",
    rating: 4.5,
    totalRatings: 198765,
    genre: ["Historical Fiction", "Young Adult"],
    description:
      "Set in Nazi Germany, this story follows a young girl who finds solace in stealing books and sharing them.",
    publishedYear: 2005,
    pages: 552,
    isbn: "978-0375842207",
    publisher: "Knopf Books",
    language: "English",
    viewCount: 145600,
    readCount: 123400,
    length: "13 hours 56 minutes",
    publishingInfo:
      "Published by Knopf Books for Young Readers in March 2006",
    reviews: [
      {
        id: "75",
        bookId: "26",
        userId: "75",
        userName: "Michael Foster",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 5,
        title: "Beautiful and heartbreaking",
        content:
          "Zusak's narration by Death is brilliant. A powerful story about the importance of words and books.",
        date: "2024-01-09",
        helpful: 287,
      },
    ],
  },
  {
    id: "27",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    authorInfo:
      "Daniel Kahneman is an Israeli-American psychologist and economist notable for his work on behavioral economics.",
    cover:
      "https://pbs.twimg.com/media/G2uSOlMbUAAnzW-?format=jpg&name=large",
    rating: 4.2,
    totalRatings: 123456,
    genre: ["Psychology", "Non-Fiction"],
    description:
      "A groundbreaking exploration of the two systems that drive the way we think.",
    publishedYear: 2011,
    pages: 499,
    isbn: "978-0374533557",
    publisher: "Farrar, Straus and Giroux",
    language: "English",
    viewCount: 89700,
    readCount: 67800,
    length: "20 hours 2 minutes",
    publishingInfo:
      "Published by Farrar, Straus and Giroux in October 2011",
    reviews: [
      {
        id: "76",
        bookId: "27",
        userId: "76",
        userName: "Dr. Lisa Park",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 4,
        title: "Fascinating psychology",
        content:
          "Kahneman reveals how our minds make decisions. Essential reading for understanding human behavior.",
        date: "2024-01-08",
        helpful: 156,
      },
    ],
  },
  {
    id: "28",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    authorInfo:
      "J.D. Salinger was an American writer known for his reclusive lifestyle.",
    cover:
      "https://pbs.twimg.com/media/G2uSJvebsAAdy1H?format=jpg&name=large",
    rating: 3.8,
    totalRatings: 345678,
    genre: ["Literary Fiction", "Coming-of-Age"],
    description:
      "Holden Caulfield's story of alienation and rebellion as he wanders New York City.",
    publishedYear: 1951,
    pages: 234,
    isbn: "978-0316769174",
    publisher: "Little, Brown and Company",
    language: "English",
    viewCount: 234500,
    readCount: 167800,
    length: "6 hours 48 minutes",
    publishingInfo:
      "Published by Little, Brown and Company in July 1951",
    reviews: [
      {
        id: "77",
        bookId: "28",
        userId: "77",
        userName: "Thomas Anderson",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 4,
        title: "Timeless coming-of-age story",
        content:
          "Holden's voice is authentic and memorable. A classic exploration of teenage angst and identity.",
        date: "2024-01-07",
        helpful: 203,
      },
    ],
  },
  {
    id: "29",
    title: "Normal People",
    author: "Sally Rooney",
    authorInfo:
      "Sally Rooney is an Irish author known for her novels about young adults.",
    cover:
      "https://pbs.twimg.com/media/G2uSJAHacAA_3Ho?format=jpg&name=large",
    rating: 4.1,
    totalRatings: 167890,
    genre: ["Literary Fiction", "Contemporary Romance"],
    description:
      "The complex relationship between Marianne and Connell from their school days through university.",
    publishedYear: 2018,
    pages: 266,
    isbn: "978-0571334650",
    publisher: "Faber & Faber",
    language: "English",
    viewCount: 123400,
    readCount: 89600,
    length: "7 hours 32 minutes",
    publishingInfo: "Published by Faber & Faber in August 2018",
    reviews: [
      {
        id: "78",
        bookId: "29",
        userId: "78",
        userName: "Sophie Miller",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 4,
        title: "Raw and honest",
        content:
          "Rooney captures the complexity of modern relationships with incredible honesty and insight.",
        date: "2024-01-06",
        helpful: 145,
      },
    ],
  },
  {
    id: "30",
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    authorInfo:
      "Patrick Rothfuss is an American author of epic fantasy.",
    cover:
      "https://pbs.twimg.com/media/G2uSLNKbIAMxUy1?format=jpg&name=large",
    rating: 4.7,
    totalRatings: 298765,
    genre: ["Fantasy", "Epic Fantasy"],
    description:
      "The first day of Kvothe's three-day telling of his life's story at the Waystone Inn.",
    publishedYear: 2007,
    pages: 662,
    isbn: "978-0756404079",
    publisher: "DAW Books",
    language: "English",
    viewCount: 189700,
    readCount: 145600,
    length: "27 hours 55 minutes",
    publishingInfo: "Published by DAW Books in March 2007",
    reviews: [
      {
        id: "79",
        bookId: "30",
        userId: "79",
        userName: "Ryan Cooper",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 5,
        title: "Stunning fantasy debut",
        content:
          "Rothfuss's prose is absolutely beautiful. The magic system and storytelling are top-notch.",
        date: "2024-01-05",
        helpful: 267,
      },
    ],
  },
  {
    id: "31",
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    authorInfo:
      "Stieg Larsson was a Swedish writer, journalist, and activist.",
    cover:
      "https://pbs.twimg.com/media/G2uSKbKbIAQvKWk?format=jpg&name=large",
    rating: 4.2,
    totalRatings: 234567,
    genre: ["Crime", "Thriller"],
    description:
      "A journalist and a hacker investigate a wealthy family's dark secrets in this Swedish crime thriller.",
    publishedYear: 2005,
    pages: 590,
    isbn: "978-0307949486",
    publisher: "Vintage Crime",
    language: "English",
    viewCount: 167800,
    readCount: 98700,
    length: "18 hours 14 minutes",
    publishingInfo:
      "Originally published in Swedish in 2005, English edition by Vintage Crime",
    reviews: [
      {
        id: "80",
        bookId: "31",
        userId: "80",
        userName: "Anna Lindberg",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 4,
        title: "Gripping Nordic noir",
        content:
          "A complex thriller with unforgettable characters. Lisbeth Salander is brilliantly written.",
        date: "2024-01-04",
        helpful: 198,
      },
    ],
  },
  {
    id: "32",
    title: "Circe",
    author: "Madeline Miller",
    authorInfo:
      "Madeline Miller is an American novelist and former classics teacher.",
    cover:
      "https://pbs.twimg.com/media/G2uSHYrbMAAoz3I?format=jpg&name=large",
    rating: 4.6,
    totalRatings: 178965,
    genre: ["Fantasy", "Mythology"],
    description:
      "A stunning reimagining of the Greek myth of Circe, the sorceress who transforms Odysseus's men.",
    publishedYear: 2018,
    pages: 393,
    isbn: "978-0316556347",
    publisher: "Little, Brown and Company",
    language: "English",
    viewCount: 145600,
    readCount: 123400,
    length: "12 hours 8 minutes",
    publishingInfo:
      "Published by Little, Brown and Company in April 2018",
    reviews: [
      {
        id: "81",
        bookId: "32",
        userId: "81",
        userName: "Helena Smith",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 5,
        title: "Gorgeous mythological retelling",
        content:
          "Miller brings Circe to life with beautiful prose and deep character development. Simply magical.",
        date: "2024-01-03",
        helpful: 245,
      },
    ],
  },
  {
    id: "33",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    authorInfo:
      "Walter Isaacson is an American writer and biographer.",
    cover:
      "https://pbs.twimg.com/media/G2uSJvibIAMJhPf?format=jpg&name=large",
    rating: 4.4,
    totalRatings: 156789,
    genre: ["Biography", "Business"],
    description:
      "The definitive biography of Apple co-founder Steve Jobs, based on exclusive interviews.",
    publishedYear: 2011,
    pages: 656,
    isbn: "978-1451648539",
    publisher: "Simon & Schuster",
    language: "English",
    viewCount: 134500,
    readCount: 89700,
    length: "25 hours 2 minutes",
    publishingInfo:
      "Published by Simon & Schuster in October 2011",
    reviews: [
      {
        id: "82",
        bookId: "33",
        userId: "82",
        userName: "Mark Davis",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 4,
        title: "Fascinating tech biography",
        content:
          "Isaacson provides an unvarnished look at Jobs - both his genius and his flaws. Essential business reading.",
        date: "2024-01-02",
        helpful: 189,
      },
    ],
  },
  {
    id: "34",
    title: "The Fault in Our Stars",
    author: "John Green",
    authorInfo:
      "John Green is an American author and YouTube content creator.",
    cover:
      "https://pbs.twimg.com/media/G2uSJvjbAAAsp6g?format=jpg&name=large",
    rating: 4.2,
    totalRatings: 287654,
    genre: ["Young Adult", "Contemporary Romance"],
    description:
      "A touching story about two teenagers with cancer who fall in love.",
    publishedYear: 2012,
    pages: 313,
    isbn: "978-0525478812",
    publisher: "Dutton Books",
    language: "English",
    viewCount: 298700,
    readCount: 234500,
    length: "7 hours 14 minutes",
    publishingInfo: "Published by Dutton Books in January 2012",
    reviews: [
      {
        id: "83",
        bookId: "34",
        userId: "83",
        userName: "Grace Wilson",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Heartbreaking and beautiful",
        content:
          "Green handles difficult topics with sensitivity and humor. Hazel and Augustus are unforgettable.",
        date: "2024-01-01",
        helpful: 356,
      },
    ],
  },
  {
    id: "35",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    authorInfo:
      "Kazuo Ishiguro is a British novelist, screenwriter, musician, and short-story writer.",
    cover:
      "https://pbs.twimg.com/media/G2uSIOabIAEmgLI?format=jpg&name=large",
    rating: 4.1,
    totalRatings: 134567,
    genre: ["Literary Fiction", "Science Fiction"],
    description:
      "From the perspective of an artificial friend, a story about love, loss, and what it means to be human.",
    publishedYear: 2021,
    pages: 303,
    isbn: "978-0571364909",
    publisher: "Faber & Faber",
    language: "English",
    viewCount: 89600,
    readCount: 67400,
    length: "9 hours 48 minutes",
    publishingInfo: "Published by Faber & Faber in March 2021",
    reviews: [
      {
        id: "84",
        bookId: "35",
        userId: "84",
        userName: "Oliver Chen",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 4,
        title: "Touching and thoughtful",
        content:
          "Ishiguro's gentle prose explores profound questions about consciousness and humanity through Klara's eyes.",
        date: "2023-12-30",
        helpful: 123,
      },
    ],
  },
  {
    id: "36",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    authorInfo:
      "Eckhart Tolle is a German-born spiritual teacher and self-help author.",
    cover:
      "https://pbs.twimg.com/media/G2uSOlNbIAEjb68?format=jpg&name=large",
    rating: 4.1,
    totalRatings: 89456,
    genre: ["Self-Help", "Spirituality"],
    description:
      "A guide to spiritual enlightenment that focuses on the importance of living in the present moment.",
    publishedYear: 1997,
    pages: 236,
    isbn: "978-1577314806",
    publisher: "New World Library",
    language: "English",
    viewCount: 95600,
    readCount: 67800,
    length: "7 hours 37 minutes",
    publishingInfo: "Published by New World Library in 1997",
    reviews: [
      {
        id: "85",
        bookId: "36",
        userId: "85",
        userName: "Lisa Martinez",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 4,
        title: "Life-changing perspective",
        content:
          "This book completely shifted my understanding of mindfulness and presence. Practical wisdom for modern life.",
        date: "2024-01-14",
        helpful: 92,
      },
    ],
  },
  {
    id: "37",
    title: "Neuromancer",
    author: "William Gibson",
    authorInfo:
      "William Gibson is an American-Canadian speculative fiction writer and essayist.",
    cover:
      "https://pbs.twimg.com/media/G2uSIOKbIAEBi23?format=jpg&name=large",
    rating: 4.0,
    totalRatings: 76543,
    genre: ["Science Fiction", "Cyberpunk"],
    description:
      "The groundbreaking cyberpunk novel that defined a genre and predicted the internet age.",
    publishedYear: 1984,
    pages: 271,
    isbn: "978-0441569595",
    publisher: "Ace Books",
    language: "English",
    viewCount: 68400,
    readCount: 45200,
    length: "10 hours 17 minutes",
    publishingInfo: "Published by Ace Books in July 1984",
    reviews: [
      {
        id: "86",
        bookId: "37",
        userId: "86",
        userName: "Tech Reader",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 5,
        title: "Prophetic cyberpunk masterpiece",
        content:
          "Gibson predicted so much of our digital future. The writing is dense but rewarding for sci-fi fans.",
        date: "2024-01-13",
        helpful: 87,
      },
    ],
  },
  {
    id: "38",
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    authorInfo:
      "Stephen Hawking was an English theoretical physicist, cosmologist, and author.",
    cover:
      "https://pbs.twimg.com/media/G2uSGnWbIAAKxZM?format=jpg&name=large",
    rating: 4.2,
    totalRatings: 123456,
    genre: ["Science", "Physics"],
    description:
      "A landmark volume in science writing that explores the nature of the universe, black holes, and time itself.",
    publishedYear: 1988,
    pages: 256,
    isbn: "978-0553380163",
    publisher: "Bantam Books",
    language: "English",
    viewCount: 142300,
    readCount: 89500,
    length: "8 hours 12 minutes",
    publishingInfo:
      "Published by Bantam Doubleday Dell in April 1988",
    reviews: [
      {
        id: "87",
        bookId: "38",
        userId: "87",
        userName: "Science Enthusiast",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 5,
        title: "Complex concepts made accessible",
        content:
          "Hawking has a gift for explaining the most complex physics in terms everyone can understand. Fascinating read.",
        date: "2024-01-12",
        helpful: 156,
      },
    ],
  },
  {
    id: "39",
    title: "The Kite Runner",
    author: "Khaled Hosseini",
    authorInfo:
      "Khaled Hosseini is an Afghan-American novelist and physician.",
    cover:
      "https://pbs.twimg.com/media/G2uSLNHbIAMmzA3?format=jpg&name=large",
    rating: 4.3,
    totalRatings: 167890,
    genre: ["Historical Fiction", "Drama"],
    description:
      "A powerful story of friendship, guilt, and redemption set against the backdrop of Afghanistan.",
    publishedYear: 2003,
    pages: 371,
    isbn: "978-1594631931",
    publisher: "Riverhead Books",
    language: "English",
    viewCount: 134500,
    readCount: 98700,
    length: "12 hours 1 minute",
    publishingInfo: "Published by Riverhead Books in May 2003",
    reviews: [
      {
        id: "88",
        bookId: "39",
        userId: "88",
        userName: "Book Lover",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Emotionally devastating masterpiece",
        content:
          "A beautifully written story that will stay with you long after finishing. Hosseini's storytelling is incredible.",
        date: "2024-01-11",
        helpful: 243,
      },
    ],
  },
  {
    id: "40",
    title: "The Lean Startup",
    author: "Eric Ries",
    authorInfo:
      "Eric Ries is an American entrepreneur, blogger, and author of The Lean Startup.",
    cover:
      "https://pbs.twimg.com/media/G2uSOlKbIAMA2kN?format=jpg&name=large",
    rating: 4.2,
    totalRatings: 45678,
    genre: ["Business", "Entrepreneurship"],
    description:
      "How today's entrepreneurs use continuous innovation to create radically successful businesses.",
    publishedYear: 2011,
    pages: 336,
    isbn: "978-0307887894",
    publisher: "Crown Business",
    language: "English",
    viewCount: 78900,
    readCount: 56400,
    length: "8 hours 38 minutes",
    publishingInfo:
      "Published by Crown Business in September 2011",
    reviews: [
      {
        id: "89",
        bookId: "40",
        userId: "89",
        userName: "Startup Founder",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 4,
        title: "Essential for entrepreneurs",
        content:
          "Revolutionary approach to building businesses. The build-measure-learn cycle has become standard practice.",
        date: "2024-01-10",
        helpful: 89,
      },
    ],
  },
  {
    id: "41",
    title: "The Lord of the Rings: The Fellowship of the Ring",
    author: "J.R.R. Tolkien",
    authorInfo:
      "J.R.R. Tolkien was an English writer, poet, and philologist.",
    cover:
      "https://pbs.twimg.com/media/G2uSLNIbgAA-TSa?format=jpg&name=large",
    rating: 4.8,
    totalRatings: 345678,
    genre: ["Fantasy", "Epic Fantasy"],
    description:
      "The first volume of the epic fantasy trilogy following Frodo's quest to destroy the One Ring.",
    publishedYear: 1954,
    pages: 423,
    isbn: "978-0547928210",
    publisher: "Houghton Mifflin Harcourt",
    language: "English",
    viewCount: 234500,
    readCount: 167800,
    length: "19 hours 39 minutes",
    publishingInfo:
      "Originally published by George Allen & Unwin in July 1954",
    reviews: [
      {
        id: "90",
        bookId: "41",
        userId: "90",
        userName: "Fantasy Fan",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 5,
        title: "The gold standard of fantasy",
        content:
          "Tolkien created the template for all modern fantasy. The world-building and language creation is unparalleled.",
        date: "2024-01-09",
        helpful: 298,
      },
    ],
  },
  {
    id: "42",
    title: "Big Little Lies",
    author: "Liane Moriarty",
    authorInfo:
      "Liane Moriarty is an Australian author known for her contemporary fiction.",
    cover:
      "https://pbs.twimg.com/media/G2uSGnQbwAA2GM5?format=jpg&name=large",
    rating: 4.2,
    totalRatings: 89123,
    genre: ["Contemporary Fiction", "Mystery"],
    description:
      "A darkly comic tale about the dangerous little lies we tell ourselves to survive.",
    publishedYear: 2014,
    pages: 460,
    isbn: "978-0399167065",
    publisher: "G.P. Putnam's Sons",
    language: "English",
    viewCount: 95600,
    readCount: 73400,
    length: "15 hours 55 minutes",
    publishingInfo:
      "Published by G.P. Putnam's Sons in July 2014",
    reviews: [
      {
        id: "91",
        bookId: "42",
        userId: "91",
        userName: "Mystery Reader",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 4,
        title: "Addictive page-turner",
        content:
          "Perfect blend of domestic drama and mystery. The characters are complex and the plot keeps you guessing.",
        date: "2024-01-08",
        helpful: 67,
      },
    ],
  },
  {
    id: "43",
    title: "The Immortal Life of Henrietta Lacks",
    author: "Rebecca Skloot",
    authorInfo:
      "Rebecca Skloot is an American science writer who specializes in science and medicine.",
    cover:
      "https://pbs.twimg.com/media/G2uSLNGbIAY8WG_?format=jpg&name=large",
    rating: 4.4,
    totalRatings: 78456,
    genre: ["Non-Fiction", "Science"],
    description:
      "The story of how one woman's cells changed medicine forever, exploring science, ethics, and human rights.",
    publishedYear: 2010,
    pages: 381,
    isbn: "978-1400052189",
    publisher: "Crown Publishing",
    language: "English",
    viewCount: 87300,
    readCount: 64200,
    length: "12 hours 23 minutes",
    publishingInfo:
      "Published by Crown Publishing in February 2010",
    reviews: [
      {
        id: "92",
        bookId: "43",
        userId: "92",
        userName: "Science Reader",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Science meets human story",
        content:
          "Brilliantly weaves together science, history, and human drama. Both educational and deeply moving.",
        date: "2024-01-07",
        helpful: 134,
      },
    ],
  },
  {
    id: "44",
    title: "The Girl on the Train",
    author: "Paula Hawkins",
    authorInfo:
      "Paula Hawkins is a British author known for her psychological thrillers.",
    cover:
      "https://pbs.twimg.com/media/G2uSMsabIAcUVjd?format=jpg&name=large",
    rating: 3.9,
    totalRatings: 123789,
    genre: ["Thriller", "Mystery"],
    description:
      "A psychological thriller about an alcoholic woman who becomes entangled in a missing person investigation.",
    publishedYear: 2015,
    pages: 395,
    isbn: "978-1594634024",
    publisher: "Riverhead Books",
    language: "English",
    viewCount: 156700,
    readCount: 98500,
    length: "10 hours 58 minutes",
    publishingInfo:
      "Published by Riverhead Books in January 2015",
    reviews: [
      {
        id: "93",
        bookId: "44",
        userId: "93",
        userName: "Thriller Fan",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 4,
        title: "Gripping psychological thriller",
        content:
          "Hawkins creates an unreliable narrator that keeps you questioning everything. Great pacing and twists.",
        date: "2024-01-06",
        helpful: 89,
      },
    ],
  },
  {
    id: "45",
    title: "Freakonomics",
    author: "Steven D. Levitt and Stephen J. Dubner",
    authorInfo:
      "Steven Levitt is an economist and Stephen Dubner is a journalist and author.",
    cover:
      "https://pbs.twimg.com/media/G2uSHYsbEAA6cyR?format=jpg&name=large",
    rating: 4.0,
    totalRatings: 67890,
    genre: ["Economics", "Non-Fiction"],
    description:
      "A rogue economist explores the hidden side of everything, from cheating teachers to bizarre baby names.",
    publishedYear: 2005,
    pages: 315,
    isbn: "978-0060731335",
    publisher: "William Morrow",
    language: "English",
    viewCount: 89400,
    readCount: 67300,
    length: "8 hours 17 minutes",
    publishingInfo: "Published by William Morrow in April 2005",
    reviews: [
      {
        id: "94",
        bookId: "45",
        userId: "94",
        userName: "Economics Student",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 4,
        title: "Economics made fascinating",
        content:
          "Makes economic principles accessible and entertaining. The unexpected connections are eye-opening.",
        date: "2024-01-05",
        helpful: 78,
      },
    ],
  },
  {
    id: "46",
    title: "Dekada '70",
    author: "Lualhati Bautista",
    authorInfo:
      "Lualhati Bautista was a renowned Filipino novelist and screenwriter known for her powerful works on feminism, social justice, and political struggle.",
    cover:
      "https://pbs.twimg.com/media/G2zbqV0aAAEbpyJ?format=jpg&name=large",
    rating: 4.1,
    totalRatings: 234567,
    genre: ["Historical", "Political Realist"],
    description:
      "Dekada ’70 follows a mother’s awakening amid her family’s struggles during the turbulent years of Martial Law in the Philippines.",
    publishedYear: 1983,
    pages: 251,
    isbn: "978-971-8845-06-8",
    publisher: "Cacho Publishing House",
    language: "Filipino",
    viewCount: 178900,
    readCount: 134500,
    length: "8 hours 45 minutes",
    publishingInfo:
      "Originally published in 1983 by Cacho Publishing House, Quezon City",
    reviews: [
      {
        id: "95",
        bookId: "46",
        userId: "95",
        userName: "Literary Reader",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 5,
        title: "Powerful and eye-opening",
        content:
          "Bautista masterfully captures a mother’s awakening amid political unrest. A moving portrayal of courage, family, and resistance during Martial Law.",
        date: "2024-01-04",
        helpful: 187,
      },
    ],
  },
  {
    id: "47",
    title: "Life of Pi",
    author: "Yann Martel",
    authorInfo:
      "Yann Martel is a Spanish-born Canadian author best known for the novel Life of Pi.",
    cover:
      "https://pbs.twimg.com/media/G2uSIOIbEAAOsFq?format=jpg&name=large",
    rating: 3.9,
    totalRatings: 156789,
    genre: ["Adventure Fiction", "Philosophical Fiction"],
    description:
      "The story of a young Indian boy stranded on a lifeboat in the Pacific Ocean with a Bengal tiger.",
    publishedYear: 2001,
    pages: 319,
    isbn: "978-0156027328",
    publisher: "Harcourt",
    language: "English",
    viewCount: 123400,
    readCount: 89600,
    length: "11 hours 22 minutes",
    publishingInfo:
      "Published by Knopf Canada in September 2001",
    reviews: [
      {
        id: "96",
        bookId: "47",
        userId: "96",
        userName: "Adventure Reader",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 4,
        title: "Philosophical survival story",
        content:
          "Martel creates a unique tale that explores faith, survival, and the power of storytelling. Beautifully written.",
        date: "2024-01-03",
        helpful: 98,
      },
    ],
  },
  {
    id: "48",
    title: "The Art of War",
    author: "Sun Tzu",
    authorInfo:
      "Sun Tzu was an ancient Chinese military strategist, writer and philosopher.",
    cover:
      "https://pbs.twimg.com/media/G2uSNoTbIAAu1JV?format=jpg&name=large",
    rating: 4.0,
    totalRatings: 89456,
    genre: ["Philosophy", "Strategy"],
    description:
      "An ancient Chinese treatise on military strategy that has influenced business and politics for centuries.",
    publishedYear: -500,
    pages: 273,
    isbn: "978-1590302255",
    publisher: "Shambhala Publications",
    language: "English",
    viewCount: 167800,
    readCount: 123400,
    length: "3 hours 7 minutes",
    publishingInfo:
      "Ancient Chinese text, this English edition by Shambhala Publications",
    reviews: [
      {
        id: "97",
        bookId: "48",
        userId: "97",
        userName: "Strategy Student",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 4,
        title: "Timeless strategic wisdom",
        content:
          "Amazing how relevant these ancient principles remain. Applicable to business, sports, and life in general.",
        date: "2024-01-02",
        helpful: 156,
      },
    ],
  },
  {
    id: "49",
    title: "The Goldfinch",
    author: "Donna Tartt",
    authorInfo:
      "Donna Tartt is an American writer, the author of the novels The Secret History, The Little Friend, and The Goldfinch.",
    cover:
      "https://pbs.twimg.com/media/G2uSKbNbIAURcjL?format=jpg&name=large",
    rating: 3.9,
    totalRatings: 145678,
    genre: ["Literary Fiction", "Coming-of-age"],
    description:
      "A young boy in New York City, Theo Decker, miraculously survives an accident that kills his mother.",
    publishedYear: 2013,
    pages: 771,
    isbn: "978-0316055437",
    publisher: "Little, Brown and Company",
    language: "English",
    viewCount: 98700,
    readCount: 67800,
    length: "32 hours 24 minutes",
    publishingInfo:
      "Published by Little, Brown and Company in October 2013",
    reviews: [
      {
        id: "98",
        bookId: "49",
        userId: "98",
        userName: "Literary Critic",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 4,
        title: "Dense but rewarding",
        content:
          "Tartt's prose is exquisite, though the length can be daunting. A deep exploration of art, loss, and identity.",
        date: "2024-01-01",
        helpful: 123,
      },
    ],
  },
  {
    id: "50",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    authorInfo:
      "Mark Manson is an American author, blogger, and entrepreneur.",
    cover:
      "https://pbs.twimg.com/media/G2uSNoSaUAEd9R9?format=jpg&name=large",
    rating: 3.8,
    totalRatings: 234567,
    genre: ["Self-Help", "Psychology"],
    description:
      "A counterintuitive approach to living a good life through embracing struggle and choosing what to care about.",
    publishedYear: 2016,
    pages: 224,
    isbn: "978-0062457714",
    publisher: "HarperOne",
    language: "English",
    viewCount: 189300,
    readCount: 145600,
    length: "5 hours 17 minutes",
    publishingInfo: "Published by HarperOne in September 2016",
    reviews: [
      {
        id: "99",
        bookId: "50",
        userId: "99",
        userName: "Self-Help Reader",
        userAvatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        rating: 4,
        title: "Refreshingly honest approach",
        content:
          "Manson cuts through typical self-help BS with humor and brutal honesty. Not for everyone, but effective.",
        date: "2023-12-31",
        helpful: 167,
      },
    ],
  },
  {
    id: "51",
    title: "The Martian",
    author: "Andy Weir",
    authorInfo:
      "Andy Weir is an American novelist whose debut novel, The Martian, was later adapted into a film.",
    cover:
      "https://pbs.twimg.com/media/G2uSOlLaMAAO6WJ?format=jpg&name=large",
    rating: 4.4,
    totalRatings: 178901,
    genre: ["Science Fiction", "Adventure"],
    description:
      "An astronaut becomes stranded on Mars and must survive using his ingenuity and scientific knowledge.",
    publishedYear: 2011,
    pages: 369,
    isbn: "978-0553418026",
    publisher: "Del Rey Books",
    language: "English",
    viewCount: 145600,
    readCount: 112300,
    length: "10 hours 53 minutes",
    publishingInfo:
      "Published by Del Rey Books in February 2014",
    reviews: [
      {
        id: "100",
        bookId: "51",
        userId: "100",
        userName: "Sci-Fi Fan",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 5,
        title: "Hard sci-fi at its best",
        content:
          "Weir makes the science accessible and exciting. Mark Watney is a fantastic protagonist with great humor.",
        date: "2023-12-30",
        helpful: 189,
      },
    ],
  },
  {
    id: "52",
    title: "Outliers",
    author: "Malcolm Gladwell",
    authorInfo:
      "Malcolm Gladwell is a Canadian journalist, author, and public speaker.",
    cover:
      "https://pbs.twimg.com/media/G2uSJARbIAAb1EY?format=jpg&name=large",
    rating: 4.1,
    totalRatings: 123456,
    genre: ["Psychology", "Sociology"],
    description:
      "An examination of the factors that contribute to high levels of success in various fields.",
    publishedYear: 2008,
    pages: 309,
    isbn: "978-0316017930",
    publisher: "Little, Brown and Company",
    language: "English",
    viewCount: 134500,
    readCount: 98700,
    length: "7 hours 17 minutes",
    publishingInfo:
      "Published by Little, Brown and Company in November 2008",
    reviews: [
      {
        id: "101",
        bookId: "52",
        userId: "101",
        userName: "Psychology Student",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 4,
        title: "Fascinating look at success",
        content:
          "Gladwell challenges our assumptions about talent and achievement. The 10,000-hour rule is thought-provoking.",
        date: "2023-12-29",
        helpful: 145,
      },
    ],
  },
  {
    id: "53",
    title: "The Road",
    author: "Cormac McCarthy",
    authorInfo:
      "Cormac McCarthy was an American novelist, playwright, and screenwriter.",
    cover:
      "https://pbs.twimg.com/media/G2uSMsbbwAAQsQy?format=jpg&name=large",
    rating: 3.9,
    totalRatings: 167890,
    genre: ["Post-Apocalyptic Fiction", "Literary Fiction"],
    description:
      "A father and his young son walk alone through burned America, heading toward the coast.",
    publishedYear: 2006,
    pages: 287,
    isbn: "978-0307387899",
    publisher: "Knopf",
    language: "English",
    viewCount: 89600,
    readCount: 67400,
    length: "6 hours 30 minutes",
    publishingInfo: "Published by Knopf in September 2006",
    reviews: [
      {
        id: "187",
        bookId: "53",
        userId: "87",
        userName: "Literary Reader",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 4,
        title: "Haunting and beautiful",
        content:
          "McCarthy's sparse prose creates a devastating portrait of survival and love. Deeply moving and difficult.",
        date: "2023-12-28",
        helpful: 134,
      },
    ],
  },
  {
    id: "54",
    title: "Mindset",
    author: "Carol S. Dweck",
    authorInfo:
      "Carol Dweck is an American psychologist known for her work on motivation and mindset.",
    cover:
      "https://pbs.twimg.com/media/G2uSIOMbIAUIxTP?format=jpg&name=large",
    rating: 4.1,
    totalRatings: 89456,
    genre: ["Psychology", "Self-Help"],
    description:
      "How you can fulfill your potential by changing how you think about your abilities and intelligence.",
    publishedYear: 2006,
    pages: 276,
    isbn: "978-0345472328",
    publisher: "Random House",
    language: "English",
    viewCount: 123400,
    readCount: 89700,
    length: "8 hours 25 minutes",
    publishingInfo:
      "Published by Random House in February 2006",
    reviews: [
      {
        id: "188",
        bookId: "54",
        userId: "88",
        userName: "Educator",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 5,
        title: "Revolutionary perspective on learning",
        content:
          "Dweck's research on growth vs fixed mindset has transformed how I approach challenges. Essential reading.",
        date: "2023-12-27",
        helpful: 178,
      },
    ],
  },
  {
    id: "55",
    title: "The Nightingale",
    author: "Kristin Hannah",
    authorInfo:
      "Kristin Hannah is an American writer known for her historical fiction novels.",
    cover:
      "https://pbs.twimg.com/media/G2uSL-IbIAITZS1?format=jpg&name=large",
    rating: 4.5,
    totalRatings: 198765,
    genre: ["Historical Fiction", "War Fiction"],
    description:
      "Two sisters in France during World War II, and their struggle to survive and resist the German occupation.",
    publishedYear: 2015,
    pages: 440,
    isbn: "978-0312577223",
    publisher: "St. Martin's Press",
    language: "English",
    viewCount: 167800,
    readCount: 134500,
    length: "17 hours 19 minutes",
    publishingInfo:
      "Published by St. Martin's Press in February 2015",
    reviews: [
      {
        id: "189",
        bookId: "55",
        userId: "89",
        userName: "Historical Fiction Fan",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 5,
        title: "Powerful WWII story",
        content:
          "Hannah brings the French Resistance to life through two unforgettable sisters. Emotionally devastating and inspiring.",
        date: "2023-12-26",
        helpful: 234,
      },
    ],
  },
  {
    id: "56",
    title: "The Alchemist",
    author: "Paulo Coelho",
    authorInfo:
      "Paulo Coelho is a Brazilian lyricist and novelist, best known for his novel The Alchemist.",
    cover:
      "https://pbs.twimg.com/media/G2uSJvubIAAJXNC?format=jpg&name=large",
    rating: 3.9,
    totalRatings: 289456,
    genre: ["Fiction", "Philosophy"],
    description:
      "A shepherd boy named Santiago travels from Spain to Egypt in search of treasure, discovering his personal legend and life's true purpose along the way.",
    publishedYear: 1988,
    pages: 208,
    isbn: "978-0062315007",
    publisher: "HarperOne",
    language: "English",
    viewCount: 234500,
    readCount: 178900,
    length: "4 hours 12 minutes",
    publishingInfo:
      "Originally published in Portuguese in 1988, English edition by HarperOne",
    reviews: [
      {
        id: "190",
        bookId: "56",
        userId: "90",
        userName: "Sophia Martinez",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b11c?w=150",
        rating: 4,
        title: "Inspiring philosophical journey",
        content:
          "Coelho's allegory about following your dreams is simple yet profound. A quick read with lasting impact.",
        date: "2023-12-25",
        helpful: 156,
      },
    ],
  },
  {
    id: "57",
    title: "Ang Kuneho at ang Pagong",
    author: "Aesop",
    authorInfo:
      "Aesop was an ancient Greek storyteller credited with a number of fables that teach timeless moral lessons through animals and simple tales.",
    cover:
      "https://pbs.twimg.com/media/G2zbqZVacAAB-96?format=jpg&name=large",
    rating: 4.7,
    totalRatings: 320456,
    genre: ["Children's Literature", "Fable"],
    description:
      "Ang Kuneho at ang Pagong is a classic fable that tells the story of a boastful hare and a humble tortoise, teaching the lesson that perseverance and humility triumph over arrogance.",
    publishedYear: -600,
    pages: 12,
    isbn: "978-0142402506",
    publisher: "Public Domain / Various Publishers",
    language: "Filipino",
    viewCount: 165400,
    readCount: 149800,
    length: "10 minutes",
    publishingInfo:
      "Originally part of Aesop’s Fables, adapted into Filipino editions by various publishers",
    reviews: [
      {
        id: "191",
        bookId: "57",
        userId: "91",
        userName: "Daniel Cooper",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        rating: 5,
        title: "Powerful and transformative",
        content:
          "Westover's story of self-invention through education is absolutely gripping. One of the best memoirs I've ever read.",
        date: "2023-12-24",
        helpful: 267,
      },
    ],
  },
  {
    id: "58",
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    authorInfo:
      "Delia Owens is an American author, zoologist, and conservationist.",
    cover:
      "https://pbs.twimg.com/media/G2uSNoUbIAAJIPB?format=jpg&name=large",
    rating: 4.4,
    totalRatings: 312456,
    genre: ["Mystery", "Romance"],
    description:
      "A coming-of-age murder mystery set in the marshes of North Carolina, following the life of Kya, the 'Marsh Girl' who grows up isolated from her community.",
    publishedYear: 2018,
    pages: 368,
    isbn: "978-0735219090",
    publisher: "G.P. Putnam's Sons",
    language: "English",
    viewCount: 298700,
    readCount: 234500,
    length: "12 hours 12 minutes",
    publishingInfo:
      "Published by G.P. Putnam's Sons in August 2018",
    reviews: [
      {
        id: "192",
        bookId: "58",
        userId: "92",
        userName: "Isabella Garcia",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        rating: 5,
        title: "Beautifully written page-turner",
        content:
          "Owens weaves together mystery, romance, and nature writing masterfully. Kya's story is unforgettable.",
        date: "2023-12-23",
        helpful: 298,
      },
    ],
  },
  {
    id: "59",
    title: "Gapo",
    author: "Lualhati Bautista",
    authorInfo:
      "Lualhati Bautista was a renowned Filipino novelist and screenwriter known for her powerful works on feminism, social justice, and political struggle.",
    cover:
      "https://pbs.twimg.com/media/G2zbqWJaAAIyEk5?format=jpg&name=large",
    rating: 4.3,
    totalRatings: 185642,
    genre: ["Social Realism", "Political Fiction"],
    description:
      "Gapo explores the harsh realities of American colonial influence in the Philippines through the lives of people in Olongapo City, exposing racism, disillusionment, and the search for identity.",
    publishedYear: 1980,
    pages: 240,
    isbn: "978-971-8845-10-5",
    publisher: "Cacho Publishing House",
    language: "Filipino",
    viewCount: 152300,
    readCount: 118900,
    length: "7 hours 20 minutes",
    publishingInfo:
      "Originally published in 1980 by Cacho Publishing House, Quezon City",
    reviews: [
      {
        id: "193",
        bookId: "59",
        userId: "93",
        userName: "Marcus Thompson",
        userAvatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        rating: 5,
        title: "Life-changing habit framework",
        content:
          "Clear provides practical, actionable strategies backed by science. This book has genuinely improved my daily life.",
        date: "2023-12-22",
        helpful: 412,
      },
    ],
  },
  {
    id: "60",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    authorInfo:
      "F. Scott Fitzgerald was an American novelist and short story writer, widely regarded as one of the greatest American writers of the 20th century.",
    cover:
      "https://pbs.twimg.com/media/G2uSKbObIAE_hID?format=jpg&name=large",
    rating: 3.9,
    totalRatings: 398765,
    genre: ["Classic Literature", "Literary Fiction"],
    description:
      "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set in the Jazz Age on Long Island.",
    publishedYear: 1925,
    pages: 180,
    isbn: "978-0743273565",
    publisher: "Scribner",
    language: "English",
    viewCount: 289400,
    readCount: 234500,
    length: "4 hours 49 minutes",
    publishingInfo:
      "Published by Charles Scribner's Sons in April 1925",
    reviews: [
      {
        id: "194",
        bookId: "60",
        userId: "94",
        userName: "Victoria Hayes",
        userAvatar:
          "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150",
        rating: 4,
        title: "Timeless American classic",
        content:
          "Fitzgerald's prose is gorgeous and his critique of the American Dream remains relevant. A masterpiece of American literature.",
        date: "2023-12-21",
        helpful: 367,
      },
    ],
  },
];

// Mock reviews data
export const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    bookId: "1",
    userId: "1",
    userName: "Sarah Johnson",
    rating: 5,
    title: "Life-changing read",
    content:
      "This book completely changed my perspective on life and the choices we make. Beautifully written and deeply philosophical.",
    date: "2024-01-15",
    helpful: 12,
  },
  {
    id: "2",
    bookId: "1",
    userId: "2",
    userName: "Michael Chen",
    rating: 4,
    title: "Thought-provoking",
    content:
      "A unique concept executed well. Made me think about alternate paths in life.",
    date: "2024-01-10",
    helpful: 8,
  },
  {
    id: "3",
    bookId: "2",
    userId: "3",
    userName: "Emma Wilson",
    rating: 5,
    title: "Scientific masterpiece",
    content:
      "Andy Weir delivers another brilliant science fiction novel. The scientific accuracy is impressive.",
    date: "2024-01-20",
    helpful: 15,
  },
];

// Export alias for backwards compatibility
export const bookData = MOCK_BOOKS;

// Derived data arrays
export const FEATURED_BOOKS: Book[] = MOCK_BOOKS.slice(0, 3);

export const MOST_VIEWED_BOOKS: Book[] = [...MOCK_BOOKS].sort(
  (a, b) => b.viewCount - a.viewCount,
);
export const MOST_READ_BOOKS: Book[] = [...MOCK_BOOKS].sort(
  (a, b) => b.readCount - a.readCount,
);
export const TOP_RATED_BOOKS: Book[] = [...MOCK_BOOKS].sort(
  (a, b) => b.rating - a.rating,
);