import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export const sendNotificationEmailToAdmin = async (enquiry: any) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set, skipping admin notification email.');
    return;
  }
  
  try {
    await resend.emails.send({
      from: 'GrowMedLink <onboarding@resend.dev>', // Should use an actual verified domain in production
      to: process.env.SUPER_ADMIN_EMAIL || 'admin@growmedlink.com',
      subject: 'New Enquiry Received',
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${enquiry.name}</p>
        <p><strong>Email:</strong> ${enquiry.email}</p>
        <p><strong>Phone:</strong> ${enquiry.phone}</p>
        <p><strong>Type:</strong> ${enquiry.type}</p>
        <p><strong>Source:</strong> ${enquiry.source || 'Unknown'}</p>
        <p><strong>Message:</strong> ${enquiry.message}</p>
      `,
    });
    console.log('[Email] Admin notification sent.');
  } catch (error) {
    console.error('[Email] Failed to send admin notification:', error);
  }
};

export const sendConfirmationEmailToUser = async (email: string, name: string) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set, skipping user confirmation email.');
    return;
  }

  try {
    await resend.emails.send({
      from: 'GrowMedLink <onboarding@resend.dev>',
      to: email,
      subject: 'Thank You For Contacting Us',
      html: `
        <h2>Thank you, ${name}!</h2>
        <p>We have received your enquiry and one of our experts will get back to you shortly.</p>
        <p>Best regards,<br>The GrowMedLink Team</p>
      `,
    });
    console.log('[Email] User confirmation sent.');
  } catch (error) {
    console.error('[Email] Failed to send user confirmation:', error);
  }
};
