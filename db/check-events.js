const postgres = require('postgres');
require('dotenv').config();
const sql = postgres(process.env.DATABASE_URL);
async function check() {
  const res = await sql`SELECT * FROM events`;
  console.log('Count:', res.length);
  process.exit(0);
}
check();
