import { NextResponse } from 'next/server';
import { generateVerificationCode } from '@/libs/codeUtils';
import { storeVerificationCode } from '@/libs/waitlist';
import { findUserByEmailOrPhone } from '@/libs/waitlist';
import { setupDatabase } from '@/db/setup';
import { sendVerificationEmail } from '@/libs/sendEmail';
import { sendSMS } from '@/libs/sendSms';


export async function POST(req: Request) {
    
    try {
        await setupDatabase();
        const { email, phone, preferredContact } = await req.json();

        // Validate that at least one of email or phone is provided
        if (!email && !phone) {
            return new NextResponse(
                JSON.stringify({ error: 'Please provide either email or phone.' }),
                { status: 400 }
            );
        }
        // Check if the user already exists
        const userExists = await findUserByEmailOrPhone(email, phone);

        if (userExists) {
            return new NextResponse(
                JSON.stringify({ error: 'User already exists.' }),
                { status: 400 }
            );
        }

        // Generate the verification code
        const verificationCode = generateVerificationCode();


        // Store the verification code temporarily (you may use Redis or your DB)
        await storeVerificationCode(verificationCode);

        if (preferredContact === 'email') {
            await sendVerificationEmail(email, verificationCode);
        } else if (preferredContact === 'phone') {
            await sendSMS(phone, verificationCode);
        }

        console.log(`Verification Code: ${verificationCode}`);

        // Return success response
        return new NextResponse(
            JSON.stringify({ message: 'Verification code sent successfully!' }),
            { status: 200 }
        );  
    } catch (error) {
        console.error('Error sending verification code:', error);
        
        // Return error response in case of failure
        return new NextResponse(
            JSON.stringify({ error: 'Failed to send verification code.' }),
            { status: 500 }
        );
    }
}

// Handle GET requests (Method Not Allowed for this route)
export async function GET() {
    return new NextResponse(
        JSON.stringify({ error: 'Method Not Allowed' }),
        { status: 405 }
    );
}
