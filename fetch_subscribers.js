const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2] || '';
        // Remove quotes if present
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    });
  }
} catch (e) {
  console.warn('Error reading .env.local:', e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function pad(str, length) {
  str = String(str || '');
  if (str.length >= length) return str.substring(0, length - 3) + '...';
  return str + ' '.repeat(length - str.length);
}

async function main() {
  console.log('Fetching subscribers from Supabase...');
  const { data: subs, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscribers:', error.message);
    process.exit(1);
  }

  if (!subs || subs.length === 0) {
    console.log('No subscribers found.');
    return;
  }

  // Header column widths
  const widths = {
    email: 40,
    subscribed_at: 30
  };

  let content = '';
  content += '='.repeat(80) + '\n';
  content += ' NATIONAL LEGAL OBSERVATORY - NEWSLETTER SUBSCRIBERS LOG\n';
  content += '='.repeat(80) + '\n';
  
  content += `| ${pad('EMAIL', widths.email)} | ${pad('SUBSCRIBED AT', widths.subscribed_at)} |\n`;
  content += '-'.repeat(80) + '\n';

  subs.forEach(s => {
    content += `| ${pad(s.email, widths.email)} | ${pad(s.subscribed_at, widths.subscribed_at)} |\n`;
  });
  
  content += '='.repeat(80) + '\n';
  content += `Total Subscribers: ${subs.length}\n`;
  content += `Generated on: ${new Date().toLocaleString()}\n`;

  const outputPath = path.join(__dirname, 'subscribers.txt');
  fs.writeFileSync(outputPath, content, 'utf8');
  console.log(`Saved ${subs.length} subscribers to subscribers.txt successfully!`);
}

main();
