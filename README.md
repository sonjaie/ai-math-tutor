# AI Math Tutor

A Next.js application that generates AI-powered math word problems for Primary 5 students and provides personalized feedback.

## 🚀 Live Demo

**URL:** [https://ai-math-tutor-three.vercel.app](https://ai-math-tutor-three.vercel.app)

## 🎯 Features

- **AI Problem Generation**: Uses OpenAI GPT-4o-mini to generate Primary 5 level math word problems
- **Interactive Learning**: Students can submit answers and receive immediate feedback
- **Personalized Feedback**: AI generates customized feedback based on student responses
- **Data Persistence**: All problems and submissions are saved to Supabase database
- **Mobile Responsive**: Clean, modern interface built with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **Deployment**: Vercel

## 📊 Database Schema

### Supabase Project Details
- **Project URL**: `https://eouhvfiknjcacmkaxbpx.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdWh2ZmlrbmpjYWNta2F4YnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDM0OTgsImV4cCI6MjA3NTExOTQ5OH0.B9PY2yuWhakH790g7uZh2gTjyaA7xzB5d6TazmyiwMM`

### Tables

#### `math_problem_sessions`
- `id` (uuid, primary key)
- `problem_text` (text) - The generated math word problem
- `final_answer` (numeric) - The correct numerical answer
- `created_at` (timestamptz) - When the problem was generated

#### `math_problem_submissions`
- `id` (uuid, primary key)
- `session_id` (uuid, foreign key to math_problem_sessions)
- `user_answer` (numeric) - The answer submitted by the user
- `is_correct` (boolean) - Whether the answer was correct
- `feedback` (text) - AI-generated personalized feedback
- `created_at` (timestamptz) - When the answer was submitted

## 🔧 Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://eouhvfiknjcacmkaxbpx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdWh2ZmlrbmpjYWNta2F4YnB4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDM0OTgsImV4cCI6MjA3NTExOTQ5OH0.B9PY2yuWhakH790g7uZh2gTjyaA7xzB5d6TazmyiwMM
OPENAI_API_KEY=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
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-math-tutor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase and OpenAI API keys

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 API Endpoints

### `POST /api/generate-problem`
Generates a new math word problem using AI.

**Response:**
```json
{
  "id": "uuid",
  "problem_text": "Emma has 24 apples...",
  "final_answer": 33,
  "created_at": "2025-01-04T..."
}
```

### `POST /api/submit-answer`
Submits a user's answer and generates feedback.

**Request:**
```json
{
  "sessionId": "uuid",
  "userAnswer": 33
}
```

**Response:**
```json
{
  "id": "uuid",
  "session_id": "uuid",
  "user_answer": 33,
  "is_correct": true,
  "feedback": "Great job! 🎉...",
  "correct_answer": 33,
  "created_at": "2025-01-04T..."
}
```

## 🏗️ Project Structure

```
ai-math-tutor/
├── app/
│   ├── api/
│   │   ├── generate-problem/
│   │   └── submit-answer/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── supabase.ts
│   └── utils.ts
├── supabase/
│   └── migrations/
└── package.json
```

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Public access policies for anonymous users
- Environment variables for sensitive data
- Input validation and error handling

## 📱 Usage

1. **Generate Problem**: Click "Generate New Problem" to create a math word problem
2. **Submit Answer**: Enter your numerical answer in the input field
3. **Get Feedback**: Receive personalized AI feedback on your submission
4. **Try Again**: Generate new problems to continue practicing

## 🎨 UI Components

Built with a minimal set of shadcn/ui components:
- `Button` - For all interactive actions
- `Input` - For answer submission
- `Card` - For content layout
- `Alert` - For error messages

## 📈 Performance

- Optimized bundle size (removed 35+ unused components)
- Server-side rendering with Next.js
- Efficient database queries with Supabase
- Mobile-first responsive design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: The Supabase project URL and Anon Key are included above for direct interaction with the live demo.