import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { sessionId, userAnswer } = await request.json();

    const { data: session, error: sessionError } = await supabase
      .from('math_problem_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      throw new Error('Session not found');
    }

    const isCorrect = Math.abs(Number(userAnswer) - Number(session.final_answer)) < 0.01;

    const feedbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a supportive and encouraging math tutor for Primary 5 students. Provide personalized feedback based on whether the student got the answer correct or incorrect. If correct, praise them and explain briefly why their answer is right. If incorrect, gently explain the mistake and guide them toward the correct answer without giving it away completely. Keep your feedback concise, friendly, and age-appropriate.'
          },
          {
            role: 'user',
            content: `Problem: ${session.problem_text}\n\nCorrect answer: ${session.final_answer}\nStudent's answer: ${userAnswer}\nIs correct: ${isCorrect}\n\nProvide feedback for this student.`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!feedbackResponse.ok) {
      throw new Error('Failed to generate feedback from OpenAI');
    }

    const feedbackData = await feedbackResponse.json();
    const feedback = feedbackData.choices[0].message.content;

    const { data: submission, error: submissionError } = await supabase
      .from('math_problem_submissions')
      .insert({
        session_id: sessionId,
        user_answer: userAnswer,
        is_correct: isCorrect,
        feedback: feedback,
      })
      .select()
      .single();

    if (submissionError) {
      throw new Error(`Database error: ${submissionError.message}`);
    }

    return NextResponse.json({
      ...submission,
      correct_answer: session.final_answer,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
