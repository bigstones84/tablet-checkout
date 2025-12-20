import { checkPrices } from './orchestrator';
import { scrapeAmazon } from './scrapers/amazon';
import { filterBelowThreshold, sendEmail } from './notifier';
import { PRODUCTS } from './config';

async function main() {
  console.log('🔍 Starting tablet price check...\n');

  // Run price check with Amazon scraper
  const results = await checkPrices([scrapeAmazon]);

  console.log(`Found ${results.length} results:\n`);

  results.forEach(r => {
    const priceStr = r.price ? `€${r.price}` : 'N/A';
    const status = r.available ? '✓' : '✗';
    console.log(`  ${status} ${r.site}: ${priceStr}`);
  });

  // Check each product against its threshold
  let dealsFound = false;
  const allDeals = filterBelowThreshold(results, Math.max(...Object.values(PRODUCTS).map(p => p.threshold)));

  if (allDeals.length > 0) {
    console.log(`\n🎯 Found ${allDeals.length} deal(s) below threshold!`);
    dealsFound = true;

    allDeals.forEach(deal => {
      console.log(`   • ${deal.site}: €${deal.price} - ${deal.url}`);
    });

    // Send email alert if configured
    const recipient = process.env.ALERT_EMAIL;
    if (recipient) {
      console.log(`\n   Sending alert to ${recipient}...`);
      await sendEmail(allDeals, recipient);
      console.log('   ✓ Email sent!');
    } else {
      console.log('\n   ⚠ No ALERT_EMAIL configured, skipping email');
    }
  }

  if (!dealsFound) {
    console.log('\n😔 No deals found below threshold');
  }

  console.log('\n✅ Price check complete!');
}

main().catch(error => {
  console.error('❌ Error running price check:', error);
  process.exit(1);
});
