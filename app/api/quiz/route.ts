import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { Console } from 'console';

// Initialize Supabase Client
const supabase = createClient()

// Prevent Next.js from caching this route (dynamic content)
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch a batch of resumes (e.g., up to 100)
    // We fetch more than 5 so we have a pool to randomize from.
    const { data, error } = await supabase
      .from('user')
      .select('*')
    // console.log(data,error)

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No resumes found in DB' }, { status: 404 });
    }

    // 2. Shuffle the array (Fisher-Yates Shuffle Algorithm)
    const shuffled = data.sort(() => 0.5 - Math.random());

    // 3. Slice the first 5 items
    const quizSelection = shuffled.slice(0, 5);
    console.log(quizSelection)
    // 4. Return the selected 5
    return NextResponse.json(quizSelection);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}