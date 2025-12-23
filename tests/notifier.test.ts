import { describe, it, expect } from '@jest/globals';
import { filterBelowThreshold, sendEmail } from '../src/notifier';
import { PriceResult } from '../src/types';
import nodemailer from 'nodemailer';

describe('Notifier - Filter Logic', () => {
  const mockResults: PriceResult[] = [
    { site: 'Amazon.it', price: 340, available: true, url: 'https://amazon.it/test', productKey: 'samsung-tab-s10-fe-256gb' },
    { site: 'Trovaprezzi', price: 380, available: true, url: 'https://trovaprezzi.it/test', productKey: 'samsung-tab-s10-fe-256gb' },
    { site: 'Idealo', price: 320, available: true, url: 'https://idealo.it/test', productKey: 'samsung-tab-s10-fe-256gb' },
    { site: 'Yeppon', price: null, available: false, url: 'https://yeppon.it/test', productKey: 'samsung-tab-s10-fe-256gb' }
  ];

  it('should filter results below threshold', () => {
    const filtered = filterBelowThreshold(mockResults, 350);

    expect(filtered.length).toBe(2);
    expect(filtered[0].site).toBe('Amazon.it');
    expect(filtered[1].site).toBe('Idealo');
  });

  it('should return empty array when no results below threshold', () => {
    const filtered = filterBelowThreshold(mockResults, 300);

    expect(filtered.length).toBe(0);
  });

  it('should ignore null prices', () => {
    const filtered = filterBelowThreshold(mockResults, 400);

    expect(filtered.every(r => r.price !== null)).toBe(true);
  });

  it('should return all available results when threshold is very high', () => {
    const filtered = filterBelowThreshold(mockResults, 1000);

    expect(filtered.length).toBe(3); // Excludes the null price
  });
});

describe.skip('Notifier - Email Preview (Manual Test with Ethereal)', () => {
  it('should send email and provide preview URL', async () => {
    const mockResults: PriceResult[] = [
      { site: 'Amazon.it', price: 340, available: true, url: 'https://www.amazon.it/dp/B0F3885QQK', productKey: 'samsung-tab-s10-fe-256gb' },
      { site: 'Idealo', price: 320, available: true, url: 'https://www.idealo.it/test', productKey: 'samsung-tab-s10-fe-256gb' },
      { site: 'Trovaprezzi', price: 380, available: true, url: 'https://www.trovaprezzi.it/test', productKey: 'samsung-tab-s10-fe-256gb' }
    ];

    // Create Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    console.log('\n📧 Ethereal Test Account Created');
    console.log('Email:', testAccount.user);

    // Temporarily override env vars for this test
    const originalUser = process.env.SMTP_USER;
    const originalPass = process.env.SMTP_PASS;

    process.env.SMTP_USER = testAccount.user;
    process.env.SMTP_PASS = testAccount.pass;

    // Mock sendEmail to use Ethereal transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    const subject = '🎯 Tablet Price Alert - Found deals below threshold!';
    let text = 'Great news! We found tablets below your price threshold:\n\n';
    mockResults.forEach(r => {
      text += `📍 ${r.site}\n`;
      text += `   Price: €${r.price}\n`;
      text += `   Link: ${r.url}\n\n`;
    });
    text += '\n---\n';
    text += 'This alert was sent by Tablet Price Monitor\n';

    const info = await transporter.sendMail({
      from: testAccount.user,
      to: 'recipient@example.com',
      subject,
      text
    });

    // Restore original env vars
    process.env.SMTP_USER = originalUser;
    process.env.SMTP_PASS = originalPass;

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('\n✅ Email sent successfully!');
    console.log('📬 Preview URL:', previewUrl);
    console.log('\nOpen this URL in your browser to see the email.\n');

    expect(previewUrl).toBeTruthy();
    expect(info.accepted.length).toBeGreaterThan(0);
  }, 15000);
});
