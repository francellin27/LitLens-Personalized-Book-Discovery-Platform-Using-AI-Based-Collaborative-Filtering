-- Allow admins to view all user book statuses
-- This is needed for the admin panel to count books read for each user

CREATE POLICY "Admins can view all user book statuses"
    ON user_book_status FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
