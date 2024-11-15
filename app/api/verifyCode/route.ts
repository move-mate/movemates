// pages/api/verifyCode
import { NextResponse } from 'next/server';
import { verifyStoredCode } from '@/libs/waitlist';
import { addToWaitlist } from '@/libs/waitlist';

export async function POST(req: Request) {
  const { verificationCode, name, email, phone, type, province, city } = await req.json();

  if (!verificationCode || !name || !email || !phone || !type || !province || !city) {
    return new NextResponse(
      JSON.stringify({ error: 'Please provide all required fields.' }),
      { status: 400 }
    );
  }

  try {
    // Verify if the code matches
    const isValid = await verifyStoredCode(verificationCode);

    if (isValid) {
      // Add user to the waitlist
      await addToWaitlist({ name, email, phone, type, province, city });

      return new NextResponse(
        JSON.stringify({ message: 'Verification successful! You have been added to the waitlist.' }),
        { status: 200 }
      );
    } else {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid verification code.' }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to verify the code or add to waitlist.' }),
      { status: 500 }
    );
  }
}
