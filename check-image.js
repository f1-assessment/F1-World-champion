const fs = require('fs');
const path = require('path');

const imagePath = path.join(__dirname, 'public', 'images', 'f1-hero-background.jpg');

console.log('🔍 Checking for background image...');
console.log('📁 Expected path:', imagePath);

if (fs.existsSync(imagePath)) {
  const stats = fs.statSync(imagePath);
  console.log('✅ Image found!');
  console.log('📊 File size:', (stats.size / 1024 / 1024).toFixed(2), 'MB');
  console.log('🎉 Your new background image is ready to use!');
} else {
  console.log('❌ Image not found.');
  console.log('📝 Please save your image as: f1-hero-background.jpg');
  console.log('📂 In the folder: public/images/');
  console.log('');
  console.log('💡 Steps to add your image:');
  console.log('1. Save your F1 background image');
  console.log('2. Name it: f1-hero-background.jpg');
  console.log('3. Place it in: public/images/ folder');
} 