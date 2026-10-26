/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const images = [
  // Categories
  {
    url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/categories/laptops.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/categories/desktop-computers.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/categories/processors.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/categories/motherboards.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/categories/ram.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/categories/monitors.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/categories/keyboards-and-mice.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/categories/accessories.jpg',
  },

  // Hero slideshow
  {
    url: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1600&q=80',
    dest: 'public/images/hero/hero-desktop.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1600&q=80',
    dest: 'public/images/hero/hero-laptop.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1600&q=80',
    dest: 'public/images/hero/hero-components.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1600&q=80',
    dest: 'public/images/hero/hero-monitors.jpg',
  },
  {
    url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1600&q=80',
    dest: 'public/images/hero/hero-cctv.jpg',
  },

  // Products placeholder
  {
    url: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/products/placeholder.jpg',
  },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fullDest = path.resolve(destPath);
    const dir = path.dirname(fullDest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    function get(currentUrl, redirectCount = 0) {
      if (redirectCount > 5) {
        return reject(new Error(`Too many redirects for ${url}`));
      }

      const client = currentUrl.startsWith('https') ? https : http;
      client.get(currentUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location, redirectCount + 1);
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to download ${currentUrl}: HTTP ${res.statusCode}`));
        }

        const fileStream = fs.createWriteStream(fullDest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Saved: ${destPath} (${fs.statSync(fullDest).size} bytes)`);
          resolve();
        });
        fileStream.on('error', (err) => {
          fs.unlink(fullDest, () => {});
          reject(err);
        });
      }).on('error', reject);
    }

    get(url);
  });
}

async function run() {
  console.log(`Starting download of ${images.length} images...`);
  for (const item of images) {
    try {
      await downloadFile(item.url, item.dest);
    } catch (err) {
      console.error(`Error downloading ${item.dest}:`, err.message);
    }
  }
  console.log('All downloads completed!');
}

run();
