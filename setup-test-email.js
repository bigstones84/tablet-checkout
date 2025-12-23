// Helper script to generate Ethereal email credentials for testing
const nodemailer = require('nodemailer');

async function setupTestEmail() {
  console.log('🔧 Generating Ethereal email credentials for testing...\n');

  const testAccount = await nodemailer.createTestAccount();

  console.log('✅ Test email account created!\n');
  console.log('Add these to your .env file:\n');
  console.log('ALERT_EMAIL=' + testAccount.user);
  console.log('SMTP_HOST=smtp.ethereal.email');
  console.log('SMTP_PORT=587');
  console.log('SMTP_USER=' + testAccount.user);
  console.log('SMTP_PASS=' + testAccount.pass);
  console.log('\n📧 View sent emails at: https://ethereal.email/messages');
  console.log('   Username: ' + testAccount.user);
  console.log('   Password: ' + testAccount.pass);
}

setupTestEmail().catch(console.error);
