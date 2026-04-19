// Quick MySQL Connection Test
// Run: node test-mysql.js

const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔍 Testing MySQL connection...\n');

  // Try different password combinations
  const passwords = ['root', '', 'password', 'admin', 'mysql'];
  
  for (const password of passwords) {
    try {
      console.log(`Trying password: "${password || '(empty)'}"`);
      
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: password,
        port: 3306
      });

      console.log('✅ SUCCESS! Connected to MySQL\n');
      console.log(`Your MySQL password is: "${password || '(empty)'}"\n`);
      
      // Check if database exists
      const [databases] = await connection.query('SHOW DATABASES');
      const dbExists = databases.some(db => db.Database === 'codeforge');
      
      if (dbExists) {
        console.log('✅ Database "codeforge" exists');
      } else {
        console.log('⚠️  Database "codeforge" does NOT exist');
        console.log('   Run this command to create it:');
        console.log('   mysql -u root -p');
        console.log('   CREATE DATABASE codeforge;');
      }
      
      console.log('\n📝 Next steps:');
      console.log('1. Create a .env file in the backend folder');
      console.log('2. Add this line:');
      console.log(`   DB_PASS=${password}`);
      console.log('3. Run: npm install dotenv');
      console.log('4. Add to top of src/index.ts: import "dotenv/config";');
      console.log('5. Run: npm run dev\n');
      
      await connection.end();
      process.exit(0);
      
    } catch (error) {
      console.log(`❌ Failed with password "${password || '(empty)'}"`);
    }
  }
  
  console.log('\n❌ Could not connect with any common password\n');
  console.log('💡 Solutions:');
  console.log('1. Reset your MySQL password:');
  console.log('   brew services stop mysql');
  console.log('   sudo mysqld_safe --skip-grant-tables &');
  console.log('   mysql -u root');
  console.log('   FLUSH PRIVILEGES;');
  console.log('   ALTER USER "root"@"localhost" IDENTIFIED BY "root";');
  console.log('   EXIT;');
  console.log('   sudo killall mysqld');
  console.log('   brew services start mysql');
  console.log('\n2. Or use SQLite instead (no password needed)');
  console.log('   See MYSQL_SETUP_GUIDE.md for instructions\n');
}

testConnection().catch(console.error);
