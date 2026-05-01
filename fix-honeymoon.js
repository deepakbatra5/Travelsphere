// Direct SQL fix for HONEYMOON packages
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function fix() {
  try {
    const result = await pool.query(
      `UPDATE "Package" SET category = $1 WHERE category = $2`,
      ['SOLO', 'HONEYMOON']
    );
    console.log('✅ Updated', result.rowCount, 'packages from HONEYMOON to SOLO');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fix();
