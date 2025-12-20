import nodemailer from 'nodemailer';
import { PriceResult } from './types';

export function filterBelowThreshold(results: PriceResult[], threshold: number): PriceResult[] {
  return results.filter(r => r.price !== null && r.price < threshold);
}

export async function sendEmail(results: PriceResult[], recipient: string): Promise<void> {
  // Create email content
  const subject = '🎯 Tablet Price Alert - Found deals below threshold!';

  let text = 'Great news! We found tablets below your price threshold:\n\n';
  results.forEach(r => {
    text += `📍 ${r.site}\n`;
    text += `   Price: €${r.price}\n`;
    text += `   Link: ${r.url}\n\n`;
  });
  text += '\n---\n';
  text += 'This alert was sent by Tablet Price Monitor\n';

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Send email
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: recipient,
    subject,
    text
  });

  console.log(`Email sent to ${recipient}`);
}
