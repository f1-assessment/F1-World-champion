#!/usr/bin/env node

/**
 * Test Setup Script for F1 World Champion Backend
 * This script installs testing dependencies and verifies the setup
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🏎️  Setting up testing environment for F1 World Champion Backend...\n');

// Check if we're in the correct directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the backend directory.');
  process.exit(1);
}

try {
  // Install testing dependencies
  console.log('📦 Installing testing dependencies...');
  execSync('npm install --save-dev @types/jest jest supertest @types/supertest mongodb-memory-server ts-jest', { 
    stdio: 'inherit' 
  });

  console.log('\n✅ Testing dependencies installed successfully!');

  // Update tsconfig.json to include Jest types
  console.log('\n📝 Updating TypeScript configuration...');
  
  const tsconfigPath = join(__dirname, 'tsconfig.json');
  
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    if (!tsconfig.compilerOptions.types) {
      tsconfig.compilerOptions.types = [];
    }
    
    if (!tsconfig.compilerOptions.types.includes('jest')) {
      tsconfig.compilerOptions.types.push('jest');
    }
    
    if (!tsconfig.compilerOptions.types.includes('node')) {
      tsconfig.compilerOptions.types.push('node');
    }

    // Ensure proper ESM settings
    tsconfig.compilerOptions.esModuleInterop = true;
    tsconfig.compilerOptions.allowSyntheticDefaultImports = true;
    
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('✅ TypeScript configuration updated!');
  }

  // Try to run a basic test
  console.log('\n🧪 Running basic test to verify setup...');
  
  try {
    execSync('npm test', { stdio: 'inherit' });
    console.log('\n🎉 Test setup completed successfully!');
    console.log('\n📖 Available test commands:');
    console.log('   npm test              - Run all tests');
    console.log('   npm run test:watch    - Run tests in watch mode');
    console.log('   npm run test:coverage - Run tests with coverage');
    console.log('   npm run test:unit     - Run unit tests only');
    console.log('   npm run test:integration - Run integration tests only');
    
  } catch (testError) {
    console.log('\n⚠️  Test setup complete, but initial test run failed.');
    console.log('This is normal if you haven\'t created test files yet.');
    console.log('Run "npm test" after creating your test files.');
  }

} catch (error) {
  console.error('\n❌ Error setting up tests:', error.message);
  console.log('\n📋 Manual setup steps:');
  console.log('1. Install dependencies: npm install --save-dev @types/jest jest supertest @types/supertest mongodb-memory-server ts-jest');
  console.log('2. Add "jest" and "node" to the types array in tsconfig.json');
  console.log('3. Create test files in src/tests/ directory');
  console.log('4. Run tests with: npm test');
  process.exit(1);
}

console.log('\n📚 For detailed testing guide, see: TESTING_GUIDE.md');
console.log('🚀 Happy testing!'); 