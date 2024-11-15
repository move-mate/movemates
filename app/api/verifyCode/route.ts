// pages/api/verify-code.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyStoredCode } from '@/libs/waitlist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { verificationCode }: { verificationCode: string } = req.body;

    if (!verificationCode) {
      return res.status(400).json({ error: 'Please provide the verification code.' });
    }

    try {
      // Verify if the code matches
      const isValid = await verifyStoredCode(verificationCode);

      if (isValid) {
        res.status(200).json({ message: 'Verification successful!' });
      } else {
        res.status(400).json({ error: 'Invalid verification code.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to verify the code.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
