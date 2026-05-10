import { test, expect } from '@playwright/test';

test('verify home page renders dynamic content', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Wait for loading to finish
  await page.waitForTimeout(5000);

  // Take screenshot
  await page.screenshot({ path: 'homepage.png' });

  // Check for header/announcement or something common
  const announcement = page.locator('div.uppercase.tracking-widest');
  if (await announcement.count() > 0) {
     console.log('Announcement found');
  }
});

test('verify admin storefront designer renders', async ({ page }) => {
  // We might need to login, but let's see if we can see the page (might redirect to login)
  await page.goto('http://localhost:3001/content');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: 'admin_content.png' });
});
