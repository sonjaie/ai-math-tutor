import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a math teacher creating word problems for Primary 5 (Grade 5) students. Generate a single math word problem and provide the answer. Return your response as a JSON object with exactly two fields: "problem_text" (the word problem) and "final_answer" (the numerical answer as a number, not a string). The problem should involve operations like addition, subtraction, multiplication, division, or fractions appropriate for Primary 5 level.'
          },
          {
            role: 'user',
            content: 'Generate a new math word problem for a Primary 5 student.'
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate problem from OpenAI');
    }

    const data = await response.json();
    const problemData = JSON.parse(data.choices[0].message.content);

    const { data: session, error } = await supabase
      .from('math_problem_sessions')
      .insert({
        problem_text: problemData.problem_text,
        final_answer: problemData.final_answer,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error generating problem:', error);
    return NextResponse.json(
      { error: 'Failed to generate problem' },
      { status: 500 }
    );
  }
}
