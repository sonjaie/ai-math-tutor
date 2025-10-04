# Database Setup Instructions

Since the automated migration is causing issues, here's how to set up your database manually:

## Step 1: Run Initial Migration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the contents from `supabase/migrations/20251004025524_create_math_problem_tables.sql`
5. Click **"Run"**

This will create:
- `math_problem_sessions` table
- `math_problem_submissions` table  
- Row Level Security policies
- Proper indexes and constraints

## Step 2: Run User Tracking Migration (Optional)

If you want to add user tracking:

1. In the same SQL Editor
2. Copy and paste the contents from `supabase/migrations/20251004130000_add_user_tracking.sql`
3. Click **"Run"**

This will add:
- `user_id` and `user_name` columns to sessions
- `user_id` column to submissions
- Performance indexes

## Step 3: Verify Setup

Run this query to verify your tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'math_problem%';
```

You should see:
- `math_problem_sessions`
- `math_problem_submissions`

## Step 4: Test Your API

Your API endpoints should now work:
- `POST /api/generate-problem` - Generate new math problems
- `POST /api/submit-answer` - Submit answers

The CI/CD pipeline will now:
1. ✅ Build your app
2. ✅ Generate TypeScript types from your database schema
3. ✅ Deploy to Vercel via webhook

No more migration errors!
