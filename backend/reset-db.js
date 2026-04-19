/**
 * Database Reset Script
 * 
 * This script will:
 * 1. Delete the existing SQLite database
 * 2. Restart the server to recreate and seed the database
 * 
 * Use this when you need a fresh database.
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'codeforge.sqlite');

console.log('🗑️  Resetting database...');

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('✅ Database deleted');
} else {
  console.log('ℹ️  No database file found');
}

console.log('\n📝 Next steps:');
console.log('1. Restart the backend server: npm run dev');
console.log('2. The database will be recreated and seeded automatically');
console.log('3. Log in again with: anishka@codeforge.com / user123\n');
