const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
let SUPABASE_URL = '';
let SUPABASE_KEY = '';

lines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPABASE_URL = line.split('=')[1].trim();
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) SUPABASE_KEY = line.split('=')[1].trim();
});

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const { data: cols, error: errCols } = await supabase.from('blogs').select('*').limit(1);
    fs.writeFileSync('blogs_schema.json', JSON.stringify({data: cols, error: errCols}, null, 2));
}

check();
