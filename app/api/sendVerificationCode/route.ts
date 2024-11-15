// app/api/sendVerificationCode/route
import type { NextApiRequest, NextApiResponse } from 'next';
import { generateVerificationCode } from '@/libs/codeUtils';
import { storeVerificationCode } from '@/libs/waitlist';
// import { sendVerificationEmail } from '@/libs/sendEmail';
// import { sendSMS } from '@/libs/sendSms';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, phone }: { email?: string; phone?: string } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Please provide either email or phone.' });
    }

    const verificationCode = generateVerificationCode();

    // Store the verification code temporarily (you may use Redis or your DB)
    await storeVerificationCode(verificationCode);

    try {
        // if (email) {
        //     // Send the code via email using SendGrid
        //     await sendVerificationEmail(email, verificationCode);
        // } else if (phone) {
        //     // Send the code via SMS using Twilio
        //     await sendSMS(phone, verificationCode);
        // }
        console.log(`Code: ${verificationCode}`);

        res.status(200).json({ message: 'Verification code sent successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send verification code.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
