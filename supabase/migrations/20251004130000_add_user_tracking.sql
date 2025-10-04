-- Example: Add user tracking to math problems
-- This is an example migration file - not meant to be executed

-- Add migration record
INSERT INTO _migrations (version, description) 
VALUES ('20251004130000', 'Add user tracking to math problems')
ON CONFLICT (version) DO NOTHING;

-- Add user_id column to sessions table
ALTER TABLE math_problem_sessions 
ADD COLUMN IF NOT EXISTS user_id TEXT,
ADD COLUMN IF NOT EXISTS user_name TEXT;

-- Add user_id column to submissions table  
ALTER TABLE math_problem_submissions
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON math_problem_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON math_problem_submissions(user_id);

-- Update RLS policies to include user filtering (example)
-- DROP POLICY IF EXISTS "Allow public read access to sessions" ON math_problem_sessions;
-- CREATE POLICY "Allow user read access to sessions"
--   ON math_problem_sessions
--   FOR SELECT
--   TO anon
--   USING (user_id IS NULL OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');
