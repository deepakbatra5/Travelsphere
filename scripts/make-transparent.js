const { Jimp } = require('jimp');
const path = require('path');

async function main() {
  try {
    const inputPath = path.join(__dirname, '../public/logo-new.png');
    const outputPath = path.join(__dirname, '../public/logo-transparent.png');
    
    console.log('Reading image from:', inputPath);
    const image = await Jimp.read(inputPath);
    
    console.log('Processing pixels...');
    // Scan all pixels and convert near-black pixels to transparent
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // Threshold to detect black/near-black background
      if (r < 30 && g < 30 && b < 30) {
        this.bitmap.data[idx + 3] = 0; // Make transparent
      }
    });
    
    console.log('Writing transparent image to:', outputPath);
    await image.write(outputPath);
    console.log('Success! Transparent logo saved at:', outputPath);
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

main();
