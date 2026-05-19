// ============================================================
// IMAGE FETCHER — Sauda (v4)
// Uses Playwright to search Unsplash and download images
// ============================================================

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, 'images');

const PRODUCTS = [
  { id: 1,  title: 'Fresh Palak',         query: 'spinach fresh green' },
  { id: 2,  title: 'Gobi',                query: 'cauliflower fresh vegetable' },
  { id: 3,  title: 'Tamatar',             query: 'tomato fresh red' },
  { id: 4,  title: 'Doodh',               query: 'milk dairy fresh' },
  { id: 5,  title: 'Dahi',                query: 'yogurt curd indian' },
  { id: 6,  title: 'Paneer',              query: 'paneer cheese block' },
  { id: 7,  title: 'Aashirvaad Atta',     query: 'wheat flour atta' },
  { id: 8,  title: 'Chini',              query: 'sugar white packet' },
  { id: 9,  title: 'Aam',                query: 'mango fresh ripe' },
  { id: 10, title: 'Kela',               query: 'banana fresh yellow' },
  { id: 11, title: 'Banarasi Silk Saree', query: 'silk saree indian traditional' },
  { id: 12, title: 'Cotton Kurta',        query: 'kurta men cotton indian' },
  { id: 13, title: 'Designer Dupatta',    query: 'dupatta ethnic embroidered' },
  { id: 14, title: 'Anarkali Suit',       query: 'anarkali suit women ethnic' },
  { id: 15, title: 'Palazzo Set',         query: 'palazzo pants women ethnic' },
  { id: 16, title: 'Lehenga',            query: 'lehenga bridal indian' },
  { id: 17, title: 'Custom Blouse',      query: 'blouse design indian' },
  { id: 18, title: 'Suit Stitching',     query: 'salwar kameez women' },
  { id: 19, title: 'Mobile Cover',       query: 'phone case colorful' },
  { id: 20, title: 'Earphones',          query: 'earphones wired' },
  { id: 21, title: 'Power Bank',          query: 'power bank portable charger' },
  { id: 22, title: 'Mehendi Service',     query: 'mehendi henna hands design' },
  { id: 23, title: 'Facial',             query: 'facial beauty treatment' },
  { id: 24, title: 'Threading',          query: 'beauty parlour women' },
  { id: 25, title: 'AC Repair',           query: 'air conditioner service' },
  { id: 26, title: 'Plumbing',            query: 'plumber repair tool' },
  // Household Services - Maids
  { id: 27, title: 'Full Time Maid',      query: 'housekeeper woman uniform' },
  { id: 28, title: 'Part Time Maid',      query: 'cleaning woman home' },
  { id: 29, title: 'Cook',                query: 'indian cook chef woman' },
  { id: 30, title: 'Baby Caretaker',      query: 'babysitter child care' },
  { id: 31, title: 'Elderly Caretaker',   query: 'elderly care helper' },
];

async function downloadImage(page, url, filepath) {
  try {
    const response = await page.request.get(url, { timeout: 15000 });
    if (response.ok()) {
      const buffer = await response.body();
      if (buffer.length > 2000) {
        fs.writeFileSync(filepath, buffer);
        return true;
      }
    }
  } catch (e) { /* ignore */ }
  return false;
}

async function main() {
  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });

  console.log('🚀 Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  const mapping = { products: {} };
  let success = 0;

  for (const product of PRODUCTS) {
    const filename = `product-${product.id}.jpg`;
    const filepath = path.join(IMAGE_DIR, filename);

    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      if (stats.size > 2000) {
        console.log(`  ✓ [cached] ${product.title}`);
        mapping.products[product.id] = filename;
        success++;
        continue;
      }
    }

    try {
      // Search Unsplash
      const searchUrl = `https://unsplash.com/s/photos/${encodeURIComponent(product.query)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(2000);

      // Get image URLs from search results
      const imgUrls = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img[srcset], img[src*="images.unsplash.com"]'));
        return imgs.map(img => {
          // Try srcset first (higher quality)
          if (img.srcset) {
            const sources = img.srcset.split(',').map(s => s.trim().split(' '));
            const best = sources.sort((a, b) => (parseInt(b[1]) || 0) - (parseInt(a[1]) || 0))[0];
            if (best && best[0]) return best[0];
          }
          return img.src;
        }).filter(src => src && src.includes('images.unsplash.com') && !src.includes('profile') && !src.includes('logo'));
      });

      let downloaded = false;
      for (const imgUrl of imgUrls.slice(0, 5)) {
        // Resize to our needed dimensions
        const downloadUrl = imgUrl.includes('?') ? imgUrl + '&w=420&h=320&fit=crop' : imgUrl + '?w=420&h=320&fit=crop';
        if (await downloadImage(page, downloadUrl, filepath)) {
          console.log(`  ✓ ${product.title}`);
          mapping.products[product.id] = filename;
          success++;
          downloaded = true;
          break;
        }
      }

      if (!downloaded) {
        console.log(`  ✗ ${product.title} — no image found`);
      }
    } catch (e) {
      console.log(`  ✗ ${product.title} — error: ${e.message.slice(0, 80)}`);
    }

    // Rate limiting
    await page.waitForTimeout(1000);
  }

  await browser.close();

  fs.writeFileSync(path.join(IMAGE_DIR, 'mapping.json'), JSON.stringify(mapping, null, 2));
  console.log(`\n✅ Done! Fetched ${success}/26 product images`);
  console.log(`📁 Images: ${IMAGE_DIR}`);
}

main().catch(console.error);