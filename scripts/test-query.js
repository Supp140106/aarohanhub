import { fetchSupportQueries } from '../app/actions/support.js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function test() {
    console.log('🧪 Testing fetchSupportQueries...');
    try {
        const results = await fetchSupportQueries();
        console.log(`✅ Success! Fetched ${results.length} queries.`);
    } catch (e) {
        console.error('❌ Test failed:', e);
    } finally {
        process.exit(0);
    }
}

test();
