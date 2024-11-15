// Import the Twilio library using ES module syntax
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMS(phone: string, code: string) {
    try {
      const message = await client.messages.create({
        body: `Your verification code is: ${code}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      return `Message sent successfully! SID: ${message.sid}`;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS');
    }
};
