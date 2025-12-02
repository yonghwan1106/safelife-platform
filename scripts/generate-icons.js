// PWA 아이콘 생성 스크립트
// 실행: node scripts/generate-icons.js
// 참고: 실제 배포 시 sharp 또는 온라인 도구를 사용하여 PNG 생성 권장

const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/images/icons');

// SVG 템플릿 - SafeLife 로고 (방패 + 하트)
const createSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb"/>
      <stop offset="100%" style="stop-color:#1d4ed8"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.1875}" fill="url(#bg)"/>
  <g transform="scale(${size / 512})">
    <path d="M256 100c-50 0-100 25-120 45v120c0 70 50 120 120 160 70-40 120-90 120-160V145c-20-20-70-45-120-45z"
          fill="none" stroke="white" stroke-width="20" stroke-linejoin="round"/>
    <path d="M256 190c-12-20-38-20-48-5-10 20 5 45 48 75 43-30 58-55 48-75-10-15-36-15-48 5z"
          fill="white"/>
  </g>
</svg>`;

// 각 사이즈의 SVG 파일 생성
sizes.forEach(size => {
  const svgContent = createSvg(size);
  const filePath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filePath, svgContent);
  console.log(`Created: icon-${size}x${size}.svg`);
});

console.log('\\n아이콘 SVG 파일이 생성되었습니다.');
console.log('PNG 파일로 변환하려면 다음 온라인 도구를 사용하세요:');
console.log('- https://cloudconvert.com/svg-to-png');
console.log('- https://svgtopng.com/');
console.log('\\n또는 sharp 패키지를 설치하여 변환할 수 있습니다:');
console.log('npm install sharp');
