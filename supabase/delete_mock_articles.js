const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Helper to load env
function loadEnv() {
  const envPaths = ['.env.local', '.env.development', '.env'];
  for (const envPath of envPaths) {
    const fullPath = path.join(__dirname, '..', envPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split('\n').forEach((line) => {
        const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          process.env[key] = value;
        }
      });
      return;
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
  console.error('Supabase env vars missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, anonKey);

const mockSlugs = [
  'climate-litigation-frontiers',
  'digital-services-act-assessment',
  'privacy-in-algorithmic-governance',
  'separation-of-powers-ruling'
];

async function main() {
  console.log('Deleting mock articles from Supabase...');
  for (const slug of mockSlugs) {
    const { data, error } = await supabase
      .from('articles')
      .delete()
      .eq('slug', slug);
      
    if (error) {
      console.error(`Error deleting ${slug}:`, error.message);
    } else {
      console.log(`Successfully deleted: ${slug}`);
    }
  }
}

main();
