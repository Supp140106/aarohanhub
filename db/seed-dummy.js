const postgres = require('postgres');
const dotenv = require('dotenv');
dotenv.config();

console.error('Starting deployment script...');
console.error('DB URL:', process.env.DATABASE_URL.substring(0, 20) + '...');

const sql = postgres(process.env.DATABASE_URL);

async function run() {
  try {
    console.error('Connecting and inserting...');
    const res = await sql`
      INSERT INTO events (title, description, schedule) 
      VALUES 
        ('CYBER-X-2026', 'National level cybersecurity hackathon involving penetration testing and CTF challenges.', (NOW() + interval '5 days')),
        ('ROBO-STORM', 'High-intensity robot combat and autonomous navigation mission.', (NOW() + interval '7 days'))
      RETURNING *
    `;
    console.error('Successfully deployed!');
    process.stdout.write(JSON.stringify(res, null, 2) + '\n');
  } catch (err) {
    console.error('Deployment failed error:', err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

run();
