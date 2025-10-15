// Supabase Database Types for LitLens

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          username: string
          role: 'user' | 'admin'
          avatar: string | null
          bio: string | null
          favorite_genres: string[]
          reading_goal: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          username: string
          role?: 'user' | 'admin'
          avatar?: string | null
          bio?: string | null
          favorite_genres?: string[]
          reading_goal?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          username?: string
          role?: 'user' | 'admin'
          avatar?: string | null
          bio?: string | null
          favorite_genres?: string[]
          reading_goal?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          author_info: string | null
          cover: string
          rating: number
          total_ratings: number
          genre: string[]
          description: string
          published_year: number
          pages: number
          isbn: string
          publisher: string
          language: string
          view_count: number
          read_count: number
          publishing_info: string | null
          length: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          author_info?: string | null
          cover: string
          rating?: number
          total_ratings?: number
          genre: string[]
          description: string
          published_year: number
          pages: number
          isbn: string
          publisher: string
          language: string
          view_count?: number
          read_count?: number
          publishing_info?: string | null
          length: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          author_info?: string | null
          cover?: string
          rating?: number
          total_ratings?: number
          genre?: string[]
          description?: string
          published_year?: number
          pages?: number
          isbn?: string
          publisher?: string
          language?: string
          view_count?: number
          read_count?: number
          publishing_info?: string | null
          length?: string
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          book_id: string
          user_id: string
          rating: number
          title: string
          content: string
          helpful: number
          is_reported: boolean
          report_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          user_id: string
          rating: number
          title: string
          content: string
          helpful?: number
          is_reported?: boolean
          report_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          user_id?: string
          rating?: number
          title?: string
          content?: string
          helpful?: number
          is_reported?: boolean
          report_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      review_reports: {
        Row: {
          id: string
          review_id: string
          reporter_id: string
          reason: string
          description: string
          status: 'pending' | 'reviewed' | 'dismissed' | 'actionTaken'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          review_id: string
          reporter_id: string
          reason: string
          description: string
          status?: 'pending' | 'reviewed' | 'dismissed' | 'actionTaken'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          reporter_id?: string
          reason?: string
          description?: string
          status?: 'pending' | 'reviewed' | 'dismissed' | 'actionTaken'
          created_at?: string
          updated_at?: string
        }
      }
      reading_lists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reading_list_books: {
        Row: {
          id: string
          reading_list_id: string
          book_id: string
          added_at: string
        }
        Insert: {
          id?: string
          reading_list_id: string
          book_id: string
          added_at?: string
        }
        Update: {
          id?: string
          reading_list_id?: string
          book_id?: string
          added_at?: string
        }
      }
      user_book_status: {
        Row: {
          id: string
          user_id: string
          book_id: string
          status: 'reading' | 'completed' | 'want_to_read' | 'favorite'
          user_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          status: 'reading' | 'completed' | 'want_to_read' | 'favorite'
          user_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          status?: 'reading' | 'completed' | 'want_to_read' | 'favorite'
          user_rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      discussions: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          category: string
          tags: string[]
          likes: number
          replies_count: number
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          category: string
          tags?: string[]
          likes?: number
          replies_count?: number
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          category?: string
          tags?: string[]
          likes?: number
          replies_count?: number
          views?: number
          created_at?: string
          updated_at?: string
        }
      }
      discussion_replies: {
        Row: {
          id: string
          discussion_id: string
          author_id: string
          content: string
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          discussion_id: string
          author_id: string
          content: string
          likes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          discussion_id?: string
          author_id?: string
          content?: string
          likes?: number
          created_at?: string
          updated_at?: string
        }
      }
      book_requests: {
        Row: {
          id: string
          user_id: string
          title: string
          author: string
          isbn: string | null
          additional_notes: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          author: string
          isbn?: string | null
          additional_notes?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          author?: string
          isbn?: string | null
          additional_notes?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'user' | 'admin'
      book_status: 'reading' | 'completed' | 'want_to_read' | 'favorite'
      report_status: 'pending' | 'reviewed' | 'dismissed' | 'actionTaken'
      request_status: 'pending' | 'approved' | 'rejected'
    }
  }
}
