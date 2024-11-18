import { NextRequest, NextResponse } from 'next/server';
import { addToWaitlist } from '@/libs/waitlist';

// Manual validation function (since Express-validator is not available)
const validateWaitlist = (body: { name: string; email: string; phone: string; type: string; province: string; city: string }) => {
  const errors: string[] = [];
  
  if (!body.name.trim()) {
    errors.push('Name is required');
  }
  if (!body.email || !/\S+@\S+\.\S+/.test(body.email)) {
    errors.push('Valid email is required');
  }
  if (!body.phone || !/^\d{10,15}$/.test(body.phone)) {
    errors.push('Valid phone number is required (10-15 digits)');
  }
  if (!['customer', 'driver', 'business'].includes(body.type)) {
    errors.push('Invalid user type');
  }
  if (!body.province.trim()) {
    errors.push('Province is required');
  }
  if (!body.city.trim()) {
    errors.push('City is required');
  }

  return errors;
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  // Validate the incoming data
  const errors = validateWaitlist(body);

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  try {
    const result = await addToWaitlist(body);  // Calls the function from your `libs/waitlist.ts`
    return NextResponse.json({ message: 'Added to waitlist', data: result }, { status: 201 });
  } catch (error) {
    if ((error as any).code === '23505') {
      return NextResponse.json({ error: 'Email already exists in waitlist' }, { status: 409 });
    } else {
      console.error('Error adding to waitlist:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}
