// Import the Twilio library using ES module syntax
import twilio from 'twilio';

const sid = process.env.TWILIO_ACCOUNT_SID;

const authToken = process.env.TWILIO_AUTH_TOKEN;

const phone_number = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(sid, authToken);  

// const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendSMS(phone: string, code: string) {
    try {
      console.log(`Sending SMS to ${phone} with code ${code}`);

      const message = await client.messages.create({
        body: `Your verification code is: ${code}`,
        from: phone_number,
        to: phone,
      });
      return `Message sent successfully! SID: ${message.sid}`;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error('Failed to send SMS');
    }
};
