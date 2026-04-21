export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Log for now — wire up an email service (Resend, Nodemailer, etc.) here
  console.log('Contact form submission:', { name, email, subject, message });

  // If RESEND_API_KEY is set, send via Resend (https://resend.com — free tier available)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Portfolio Contact <onboarding@resend.dev>',
          to: ['creativesites263@gmail.com'],
          subject: `[Portfolio] ${subject}`,
          html: `
            <h2>New message from your portfolio</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr/>
            <p>${message.replace(/\n/g, '<br/>')}</p>
          `,
          reply_to: email,
        }),
      });

      if (!response.ok) {
        console.error('Resend error:', await response.text());
        return res.status(500).json({ message: 'Failed to send email' });
      }
    } catch (err) {
      console.error('Email send error:', err);
      return res.status(500).json({ message: 'Failed to send email' });
    }
  }

  return res.status(200).json({ message: 'Message received' });
}
