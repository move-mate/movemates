import { NextRequest, NextResponse } from 'next/server';
import { addToWaitlist, DuplicateWaitlistEmailError } from '@/libs/waitlist';
import { waitlistSchema } from '@/schema/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => issue.message);
      return NextResponse.json({ errors }, { status: 400 });
    }

    const result = await addToWaitlist(parsed.data);
    return NextResponse.json({ message: 'Added to waitlist', data: result }, { status: 201 });
  } catch (error: any) {
    if (error instanceof DuplicateWaitlistEmailError || error?.code === 'DUPLICATE_EMAIL') {
      return NextResponse.json({ error: 'Email already exists in waitlist' }, { status: 409 });
    }
    console.error('Error adding to waitlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
