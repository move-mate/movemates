import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function sendVerificationEmail(email: string, verificationCode: string) {
  const msg = {
    to: email,
    from: process.env.SMS_FROM as string,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${verificationCode}`,
    html: `<strong>Your verification code is: ${verificationCode}</strong>`,
  };

  try {
    await sgMail.send(msg);
    console.log('Verification email sent');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
