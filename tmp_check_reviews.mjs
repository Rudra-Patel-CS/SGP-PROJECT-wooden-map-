import { createClient } from "@supabase/supabase-js";
import 'dotenv/config'; // Requires dotenv to be installed or use process.env directly if running via npx

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function check() {
  console.log("Checking reviews table...");
  const { data, error } = await supabase.from('reviews').select('*').limit(5);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Found reviews:", data.length);
    if (data.length > 0) {
      console.log("Schema sample:", JSON.stringify(data[0], null, 2));
    }
  }
}

check();
