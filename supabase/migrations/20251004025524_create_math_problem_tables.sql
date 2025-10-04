/*
  # Create Math Problem Generator Tables

  1. New Tables
    - `math_problem_sessions`
      - `id` (uuid, primary key)
      - `problem_text` (text) - The generated math word problem
      - `final_answer` (numeric) - The correct numerical answer
      - `created_at` (timestamptz) - When the problem was generated
    
    - `math_problem_submissions`
      - `id` (uuid, primary key)
      - `session_id` (uuid, foreign key to math_problem_sessions)
      - `user_answer` (numeric) - The answer submitted by the user
      - `is_correct` (boolean) - Whether the answer was correct
      - `feedback` (text) - AI-generated personalized feedback
      - `created_at` (timestamptz) - When the answer was submitted

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (since this is a prototype without authentication)
    - Users can insert and read from both tables
*/

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

ALTER TABLE math_problem_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE math_problem_submissions ENABLE ROW LEVEL SECURITY;

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