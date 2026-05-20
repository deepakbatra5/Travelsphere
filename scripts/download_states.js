const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = 'd:/travel/public/states/';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const images = {
  'rajasthan.jpg': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'uttarakhand.jpg': 'https://images.unsplash.com/photo-1626621341517-bbf3e99c0a6b?w=800&q=80',
  'up.jpg': 'https://images.unsplash.com/photo-1564507592208-528f1e672723?w=800&q=80',
  'himachal.jpg': 'https://images.unsplash.com/photo-1605649487212-4dcfd3a10996?w=800&q=80',
  'sikkim.jpg': 'https://images.unsplash.com/photo-1579294523315-998816cbcdbe?w=800&q=80',
  'meghalaya.jpg': 'https://images.unsplash.com/photo-1629807496229-23ce4d8b9f93?w=800&q=80',
  'maharashtra.jpg': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
  'karnataka.jpg': 'https://images.unsplash.com/photo-1605786524103-6a9c1e149d5a?w=800&q=80',
  'tamilnadu.jpg': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
  'gujarat.jpg': 'https://images.unsplash.com/photo-1625884974026-64195152fcbe?w=800&q=80',
  'westbengal.jpg': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80',
  'andaman.jpg': 'https://images.unsplash.com/photo-1586902279476-3244d8d18285?w=800&q=80'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject);
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  const promises = Object.entries(images).map(([name, url]) => {
    return download(url, path.join(dir, name))
      .then(() => console.log(`Downloaded ${name}`))
      .catch(err => console.error(`Error with ${name}: ${err.message}`));
  });
  await Promise.all(promises);
  console.log('All downloads finished.');
}

main();
