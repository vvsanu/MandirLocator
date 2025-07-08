#!/usr/bin/env node

/**
 * BAPS Temple Finder - Development Server
 * This script starts the development server for the BAPS Temple Finder application.
 * It serves both the React frontend and Express backend on a single port.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🕉️  Starting BAPS Temple Finder Development Server...\n');

// Set environment variables
process.env.NODE_ENV = 'development';

// Start the development server
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

// Handle server events
server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

server.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down BAPS Temple Finder...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down BAPS Temple Finder...');
  server.kill('SIGTERM');
  process.exit(0);
});

console.log('🚀 Server starting...');
console.log('📍 Once running, open your browser to: http://localhost:5000');
console.log('   (If port 5000 is busy, the app will automatically use port 5001)');
console.log('🗺️  Features available:');
console.log('   • Search temples by zip code or current location');
console.log('   • Interactive map with BAPS logo markers');
console.log('   • Toggle between list and map views');
console.log('   • Mobile-optimized for iOS and Android');
console.log('\n📱 For iOS testing: Add to home screen for best experience');
console.log('⌨️  Press Ctrl+C to stop the server\n');