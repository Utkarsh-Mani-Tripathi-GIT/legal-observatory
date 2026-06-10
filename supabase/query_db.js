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

async function main() {
  console.log('Fetching authors...');
  const { data: authors, error: authorsErr } = await supabase.from('authors').select('slug, name');
  if (authorsErr) {
    console.error('Authors err:', authorsErr);
  } else {
    console.log('Authors in DB:', authors);
  }

  console.log('\nFetching articles...');
  const { data: articles, error: articlesErr } = await supabase.from('articles').select('slug, title, author_slug');
  if (articlesErr) {
    console.error('Articles err:', articlesErr);
  } else {
    console.log('Articles in DB:', articles);
  }
}

main();
