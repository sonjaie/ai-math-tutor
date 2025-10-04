-- Create Math Problem Generator Tables
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS math_problem_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_text text NOT NULL,
  final_answer numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS math_problem_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES math_problem_sessions(id) ON DELETE CASCADE,
  user_answer numeric NOT NULL,
  is_correct boolean NOT NULL,
  feedback text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE math_problem_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE math_problem_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access to sessions"
  ON math_problem_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to sessions"
  ON math_problem_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read access to submissions"
  ON math_problem_submissions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert access to submissions"
  ON math_problem_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update access to submissions"
  ON math_problem_submissions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
