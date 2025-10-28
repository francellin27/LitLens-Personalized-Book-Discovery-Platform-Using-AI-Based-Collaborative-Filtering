-- ============================================
-- FIX: Books Read Count Shows 0 for All Users
-- ============================================
-- This migration adds an RLS policy to allow
-- admins to view all user book statuses
-- ============================================

-- Add admin policy for viewing user book statuses
CREATE POLICY "Admins can view all user book statuses"
    ON user_book_status FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Verify the policy was created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'user_book_status'
ORDER BY policyname;

-- Test query: Count completed books for each user (run as admin)
SELECT 
    p.name,
    p.email,
    p.role,
    COUNT(ubs.id) FILTER (WHERE ubs.status = 'completed') as books_read
FROM profiles p
LEFT JOIN user_book_status ubs ON p.id = ubs.user_id
GROUP BY p.id, p.name, p.email, p.role
ORDER BY books_read DESC;
