import nodemailer from 'nodemailer';

export default async function sendMail(from, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred email service
    auth: {
      user: process.env.NEXT_PRIVATE_EMAIL,
      pass: process.env.NEXT_PRIVATE_PASS,
    },
  });

  const mailOptions = {
    to: process.env.NEXT_PRIVATE_EMAIL,
    from,
    subject,
    html: htmlContent,
  };

  return transporter.sendMail(mailOptions);
}
