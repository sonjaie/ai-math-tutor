import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MathProblemSession = {
  id: string;
  problem_text: string;
  final_answer: number;
  created_at: string;
};

export type MathProblemSubmission = {
  id: string;
  session_id: string;
  user_answer: number;
  is_correct: boolean;
  feedback: string | null;
  created_at: string;
};
