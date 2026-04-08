const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  console.log("Checking reviews table...");
  const { data, error } = await supabase.from('reviews').select('*').limit(5);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Found reviews:", data.length);
    console.log("Schema sample:", data[0]);
  }
}

check();
