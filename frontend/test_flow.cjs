const puppeteer = require('puppeteer');
const fs = require('fs');
const _path = require('path');

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const appDataDir = "C:\\Users\\Caio Sofiati Sena\\.gemini\\antigravity\\brain\\892f8980-2470-46ed-bc1a-81cc5f0b4359";

  try {
    console.log("Navigating to frontend...");
    await page.goto('http://localhost:5174/');
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: _path.join(appDataDir, 'frontend_initial.png') });

    console.log("Navigating to login...");
    await page.goto('http://localhost:5174/login');
    await new Promise(r => setTimeout(r, 1000));
    
    // Login
    console.log("Logging in...");
    await page.type('input[type="text"]', 'mor_2314');
    await page.type('input[type="password"]', '83r5^_');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to home
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: _path.join(appDataDir, 'frontend_logged_in.png') });

    // Add first item to cart
    console.log("Adding item to cart...");
    const addButtons = await page.$$('text/Adicionar ao Carrinho');
    if (addButtons.length > 0) {
      await addButtons[0].click();
      await new Promise(r => setTimeout(r, 1000));
      await addButtons[1].click();
      await new Promise(r => setTimeout(r, 1000));
    }

    console.log("Going to cart...");
    await page.goto('http://localhost:5174/cart');
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: _path.join(appDataDir, 'frontend_cart.png') });

    console.log("Going to checkout...");
    const checkoutBtn = await page.$('text/Finalizar Compra');
    if (checkoutBtn) await checkoutBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: _path.join(appDataDir, 'frontend_checkout.png') });

    console.log("Confirming order...");
    const confirmBtn = await page.$('text/Confirmar Pagamento e Finalizar Pedido');
    if (confirmBtn) await confirmBtn.click();
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: _path.join(appDataDir, 'frontend_order_confirmation.png') });

    console.log("Going to orders history...");
    await page.goto('http://localhost:5174/orders');
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: _path.join(appDataDir, 'frontend_orders_history.png') });

    console.log("Done.");
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
  }
}

run();
