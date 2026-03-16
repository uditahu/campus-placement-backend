require('dotenv').config();
const bcrypt = require('bcrypt');
const db     = require('./config/db');

async function seed() {
  const hash = await bcrypt.hash('Admin@123', 10);
  await db.query(
    'INSERT IGNORE INTO users (name,email,password,role) VALUES (?,?,?,?)',
    ['Admin', 'admin@campus.com', hash, 'admin']
  );
  console.log('Admin seeded: admin@campus.com / Admin@123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
