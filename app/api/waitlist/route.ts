import { NextRequest, NextResponse } from 'next/server';
import { addToWaitlist, DuplicateWaitlistEmailError } from '@/libs/waitlist';
import { waitlistSchema } from '@/schema/schema';
import { corsHeaders } from '@/libs/cors';

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request),
  });
}

export async function POST(request: NextRequest) {
  const cors = corsHeaders(request);

  try {
    const body = await request.json();
    const parsed = waitlistSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => issue.message);
      return NextResponse.json({ errors }, { status: 400, headers: cors });
    }

    const result = await addToWaitlist(parsed.data);
    return NextResponse.json(
      { message: 'Added to waitlist', data: result },
      { status: 201, headers: cors }
    );
  } catch (error: any) {
    if (error instanceof DuplicateWaitlistEmailError || error?.code === 'DUPLICATE_EMAIL') {
      return NextResponse.json(
        { error: 'Email already exists in waitlist' },
        { status: 409, headers: cors }
      );
    }
    console.error('Error adding to waitlist:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: cors });
  }
}
