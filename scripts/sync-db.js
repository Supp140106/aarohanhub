import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL);

async function sync() {
  console.log('🔄 Syncing database tables...');

  try {
    // 1. Create Users table if not exists (minimal version matching schema.js)
    console.log('Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role TEXT DEFAULT 'external',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 2. Create Queries table if not exists (minimal version matching schema.js)
    console.log('Creating queries table...');
    await sql`
      CREATE TABLE IF NOT EXISTS queries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        question TEXT NOT NULL,
        answer TEXT,
        answered_by_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Tables verified/created successfully.');
  } catch (error) {
    console.error('❌ Sync failed:', error);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

sync();
