import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL);

async function migrate() {
  console.log('🔄 Adding organizer_id column to events table...');
  try {
    // Add the column if it doesn't exist
    await sql`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS organizer_id INTEGER
      REFERENCES users(id) ON DELETE CASCADE
    `;
    console.log('✅ organizer_id column added (or already existed).');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await sql.end();
    process.exit(0);
  }
}

migrate();
