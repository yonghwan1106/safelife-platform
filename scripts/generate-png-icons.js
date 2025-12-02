// PWA PNG 아이콘 생성 스크립트
// 실행: node scripts/generate-png-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/images/icons');

// SVG 템플릿 - SafeLife 로고 (방패 + 하트)
const createSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <path d="M256 100c-50 0-100 25-120 45v120c0 70 50 120 120 160 70-40 120-90 120-160V145c-20-20-70-45-120-45z"
        fill="none" stroke="white" stroke-width="20" stroke-linejoin="round"/>
  <path d="M256 190c-12-20-38-20-48-5-10 20 5 45 48 75 43-30 58-55 48-75-10-15-36-15-48 5z"
        fill="white"/>
</svg>`;

async function generateIcons() {
  // 디렉토리 확인
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  for (const size of sizes) {
    const svgBuffer = Buffer.from(createSvg(512));
    const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(pngPath);

    console.log(`Created: icon-${size}x${size}.png`);
  }

  // Apple Touch Icon (180x180)
  const appleTouchPath = path.join(iconsDir, 'apple-touch-icon.png');
  await sharp(Buffer.from(createSvg(512)))
    .resize(180, 180)
    .png()
    .toFile(appleTouchPath);
  console.log('Created: apple-touch-icon.png');

  // Favicon (32x32)
  const faviconPath = path.join(iconsDir, 'favicon-32x32.png');
  await sharp(Buffer.from(createSvg(512)))
    .resize(32, 32)
    .png()
    .toFile(faviconPath);
  console.log('Created: favicon-32x32.png');

  // Favicon (16x16)
  const favicon16Path = path.join(iconsDir, 'favicon-16x16.png');
  await sharp(Buffer.from(createSvg(512)))
    .resize(16, 16)
    .png()
    .toFile(favicon16Path);
  console.log('Created: favicon-16x16.png');

  console.log('\n모든 PNG 아이콘이 생성되었습니다!');
}

generateIcons().catch(console.error);
