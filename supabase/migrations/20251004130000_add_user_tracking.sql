-- Add user tracking to math problems

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
