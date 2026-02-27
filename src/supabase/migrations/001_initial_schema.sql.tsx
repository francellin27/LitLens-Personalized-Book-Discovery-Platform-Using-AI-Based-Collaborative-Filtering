-- LitLens Database Schema Migration
-- This file creates all necessary tables for the LitLens application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE book_status AS ENUM ('reading', 'completed', 'want_to_read', 'favorite');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'dismissed', 'actionTaken');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    role user_role DEFAULT 'user',
    avatar TEXT,
    bio TEXT,
    favorite_genres TEXT[] DEFAULT '{}',
    reading_goal INTEGER DEFAULT 25,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books table
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    author_info TEXT,
    cover TEXT NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_ratings INTEGER DEFAULT 0,
    genre TEXT[] NOT NULL,
    description TEXT NOT NULL,
    published_year INTEGER NOT NULL,
    pages INTEGER NOT NULL,
    isbn TEXT NOT NULL UNIQUE,
    publisher TEXT NOT NULL,
    language TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    read_count INTEGER DEFAULT 0,
    publishing_info TEXT,
    length TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    helpful INTEGER DEFAULT 0,
    is_reported BOOLEAN DEFAULT FALSE,
    report_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(book_id, user_id)
);

-- Review reports table
CREATE TABLE review_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT NOT NULL,
    status report_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading lists table
CREATE TABLE reading_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading list books junction table
CREATE TABLE reading_list_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reading_list_id UUID NOT NULL REFERENCES reading_lists(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(reading_list_id, book_id)
);

-- User book status table (reading, completed, want_to_read, favorite)
CREATE TABLE user_book_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    status book_status NOT NULL,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, book_id, status)
);

-- Discussions table
CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    likes INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Discussion replies table
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book requests table
CREATE TABLE book_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT,
    additional_notes TEXT,
    status request_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books USING GIN(genre);
CREATE INDEX idx_books_published_year ON books(published_year);
CREATE INDEX idx_books_rating ON books(rating DESC);
CREATE INDEX idx_reviews_book_id ON reviews(book_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_review_reports_review_id ON review_reports(review_id);
CREATE INDEX idx_review_reports_status ON review_reports(status);
CREATE INDEX idx_reading_lists_user_id ON reading_lists(user_id);
CREATE INDEX idx_reading_list_books_list_id ON reading_list_books(reading_list_id);
CREATE INDEX idx_user_book_status_user_id ON user_book_status(user_id);
CREATE INDEX idx_user_book_status_book_id ON user_book_status(book_id);
CREATE INDEX idx_discussions_author_id ON discussions(author_id);
CREATE INDEX idx_discussions_category ON discussions(category);
CREATE INDEX idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX idx_book_requests_user_id ON book_requests(user_id);
CREATE INDEX idx_book_requests_status ON book_requests(status);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_reports_updated_at BEFORE UPDATE ON review_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_lists_updated_at BEFORE UPDATE ON reading_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_book_status_updated_at BEFORE UPDATE ON user_book_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussions_updated_at BEFORE UPDATE ON discussions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_discussion_replies_updated_at BEFORE UPDATE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_requests_updated_at BEFORE UPDATE ON book_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, username)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update book rating when review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_book_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE books
    SET 
        rating = (SELECT AVG(rating)::DECIMAL(3,2) FROM reviews WHERE book_id = COALESCE(NEW.book_id, OLD.book_id)),
        total_ratings = (SELECT COUNT(*) FROM reviews WHERE book_id = COALESCE(NEW.book_id, OLD.book_id))
    WHERE id = COALESCE(NEW.book_id, OLD.book_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for book rating updates
CREATE TRIGGER update_book_rating_on_insert
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_book_rating();

CREATE TRIGGER update_book_rating_on_update
    AFTER UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_book_rating();

CREATE TRIGGER update_book_rating_on_delete
    AFTER DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_book_rating();

-- Function to update discussion replies count
CREATE OR REPLACE FUNCTION update_discussion_replies_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE discussions
    SET replies_count = (
        SELECT COUNT(*) FROM discussion_replies 
        WHERE discussion_id = COALESCE(NEW.discussion_id, OLD.discussion_id)
    )
    WHERE id = COALESCE(NEW.discussion_id, OLD.discussion_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for discussion replies count
CREATE TRIGGER update_discussion_replies_count_on_insert
    AFTER INSERT ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_discussion_replies_count();

CREATE TRIGGER update_discussion_replies_count_on_delete
    AFTER DELETE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION update_discussion_replies_count();

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_list_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_book_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_requests ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Books policies (public read, admin write)
CREATE POLICY "Books are viewable by everyone"
    ON books FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert books"
    ON books FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update books"
    ON books FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can delete books"
    ON books FOR DELETE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (true);

CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Review reports policies
CREATE POLICY "Admins can view all review reports"
    ON review_reports FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Users can create review reports"
    ON review_reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can update review reports"
    ON review_reports FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Reading lists policies
CREATE POLICY "Public reading lists are viewable by everyone"
    ON reading_lists FOR SELECT
    USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create own reading lists"
    ON reading_lists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading lists"
    ON reading_lists FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading lists"
    ON reading_lists FOR DELETE
    USING (auth.uid() = user_id);

-- Reading list books policies
CREATE POLICY "Reading list books viewable if list is viewable"
    ON reading_list_books FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM reading_lists 
            WHERE id = reading_list_id 
            AND (is_public = true OR user_id = auth.uid())
        )
    );

CREATE POLICY "Users can add books to own reading lists"
    ON reading_list_books FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM reading_lists 
            WHERE id = reading_list_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can remove books from own reading lists"
    ON reading_list_books FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM reading_lists 
            WHERE id = reading_list_id AND user_id = auth.uid()
        )
    );

-- User book status policies
CREATE POLICY "Users can view own book status"
    ON user_book_status FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own book status"
    ON user_book_status FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own book status"
    ON user_book_status FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own book status"
    ON user_book_status FOR DELETE
    USING (auth.uid() = user_id);

-- Discussions policies
CREATE POLICY "Discussions are viewable by everyone"
    ON discussions FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create discussions"
    ON discussions FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own discussions"
    ON discussions FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own discussions"
    ON discussions FOR DELETE
    USING (auth.uid() = author_id);

-- Discussion replies policies
CREATE POLICY "Discussion replies are viewable by everyone"
    ON discussion_replies FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create replies"
    ON discussion_replies FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own replies"
    ON discussion_replies FOR UPDATE
    USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own replies"
    ON discussion_replies FOR DELETE
    USING (auth.uid() = author_id);

-- Book requests policies
CREATE POLICY "Users can view own book requests"
    ON book_requests FOR SELECT
    USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Authenticated users can create book requests"
    ON book_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update book requests"
    ON book_requests FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
