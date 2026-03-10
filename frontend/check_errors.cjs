const puppeteer = require('puppeteer');

async function checkConsole() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  page.on('requestfailed', req => console.error('FAILED REQUEST:', req.url(), req.failure().errorText));

  try {
    console.log("Navigating to http://localhost:5173/ ...");
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:\\Users\\Caio Sofiati Sena\\.gemini\\antigravity\\brain\\892f8980-2470-46ed-bc1a-81cc5f0b4359\\frontend_recovered.png' });
    console.log("Navigation complete.");
  } catch (e) {
    console.error("Navigation error:", e);
  } finally {
    await browser.close();
  }
}

checkConsole();
