'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader as Loader2, Brain, CircleCheck as CheckCircle2, Circle as XCircle } from 'lucide-react';

type MathProblemSession = {
  id: string;
  problem_text: string;
  final_answer: number;
  created_at: string;
};

type Submission = {
  id: string;
  session_id: string;
  user_answer: number;
  is_correct: boolean;
  feedback: string | null;
  correct_answer: number;
  created_at: string;
};

export default function Home() {
  const [currentProblem, setCurrentProblem] = useState<MathProblemSession | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateProblem = async () => {
    setIsGenerating(true);
    setError(null);
    setSubmission(null);
    setUserAnswer('');

    try {
      const response = await fetch('/api/generate-problem', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate problem');
      }

      const data = await response.json();
      setCurrentProblem(data);
    } catch (err) {
      setError('Failed to generate a new problem. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentProblem || !userAnswer.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/submit-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: currentProblem.id,
          userAnswer: parseFloat(userAnswer),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      const data = await response.json();
      setSubmission(data);
    } catch (err) {
      setError('Failed to submit your answer. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSubmitting && userAnswer.trim()) {
      submitAnswer();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">AI Math Tutor</h1>
          </div>
          <p className="text-lg text-gray-600">
            Practice your math skills with AI-generated word problems
          </p>
        </div>

        <Card className="shadow-lg border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Math Practice</CardTitle>
            <CardDescription>
              Click the button below to generate a new Primary 5 level math problem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!currentProblem && !isGenerating && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Ready to start practicing?</p>
                <Button
                  onClick={generateProblem}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Generate New Problem
                </Button>
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Generating a new problem...</p>
              </div>
            )}

            {currentProblem && !submission && (
              <div className="space-y-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">Problem:</h3>
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {currentProblem.problem_text}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Answer:
                    </label>
                    <Input
                      id="answer"
                      type="number"
                      step="any"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your answer"
                      disabled={isSubmitting}
                      className="text-lg"
                    />
                  </div>

                  <Button
                    onClick={submitAnswer}
                    disabled={isSubmitting || !userAnswer.trim()}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Checking...
                      </>
                    ) : (
                      'Submit Answer'
                    )}
                  </Button>
                </div>
              </div>
            )}

            {submission && (
              <div className="space-y-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-3 text-blue-900">Problem:</h3>
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {currentProblem?.problem_text}
                  </p>
                </div>

                <div
                  className={`border-2 rounded-lg p-6 ${
                    submission.is_correct
                      ? 'bg-green-50 border-green-300'
                      : 'bg-orange-50 border-orange-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    {submission.is_correct ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <h3 className="text-xl font-bold text-green-800">Correct!</h3>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-orange-600" />
                        <h3 className="text-xl font-bold text-orange-800">Not quite right</h3>
                      </>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <p className="text-gray-700">
                      <span className="font-semibold">Your answer:</span> {submission.user_answer}
                    </p>
                    {!submission.is_correct && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Correct answer:</span> {submission.correct_answer}
                      </p>
                    )}
                  </div>

                  {submission.feedback && (
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Feedback:</h4>
                      <p className="text-gray-700 leading-relaxed">{submission.feedback}</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={generateProblem}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Try Another Problem
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>All problems and submissions are saved to the database</p>
        </div>
      </div>
    </div>
  );
}
