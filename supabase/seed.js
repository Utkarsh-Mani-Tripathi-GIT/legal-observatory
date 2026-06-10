// Database Seeder Script for Supabase Migration
// Run using: node supabase/seed.js

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');
const { createClient } = require('@supabase/supabase-js');

// Helper to load environment variables from next env files
function loadEnv() {
  const envPaths = ['.env.local', '.env.development', '.env'];
  for (const envPath of envPaths) {
    const fullPath = path.join(process.cwd(), envPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split('\n').forEach((line) => {
        const match = line.match(/^\s*([\w.\-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          // Remove wrapping quotes
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          process.env[key] = value;
        }
      });
      console.log(`Loaded environment configuration from ${envPath}`);
      return;
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey || supabaseUrl.includes('your-supabase-')) {
  console.error('ERROR: Supabase credentials are missing or not set in environment.');
  console.log('Ensure you have a .env.local file with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// Helper to calculate reading time
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s+/).length;
  return `${Math.ceil(noOfWords / wordsPerMinute)} min read`;
}

// 1. Seed Categories
async function seedCategories() {
  console.log('\n--- Seeding Categories ---');
  const catPath = path.join(process.cwd(), 'content', 'categories.json');
  if (!fs.existsSync(catPath)) {
    console.warn('categories.json not found in content/');
    return;
  }

  const categories = JSON.parse(fs.readFileSync(catPath, 'utf8'));
  for (const cat of categories) {
    const { error } = await supabase.from('categories').upsert(cat);
    if (error) {
      console.error(`Error uploading category ${cat.slug}:`, error.message);
    } else {
      console.log(`Upserted category: ${cat.name}`);
    }
  }
}

// 2. Seed Authors
async function seedAuthors() {
  console.log('\n--- Seeding Authors ---');
  const authorsDir = path.join(process.cwd(), 'content', 'authors');
  if (!fs.existsSync(authorsDir)) {
    console.warn('Authors folder not found in content/');
    return;
  }

  const fileNames = fs.readdirSync(authorsDir);
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;

    const slug = fileName.replace(/\.md$/, '');
    const fileContent = fs.readFileSync(path.join(authorsDir, fileName), 'utf8');
    const { data } = matter(fileContent);

    const authorRow = {
      slug: data.slug || slug,
      name: data.name || '',
      role: data.role || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      social_links: data.socialLinks || {},
    };

    const { error } = await supabase.from('authors').upsert(authorRow);
    if (error) {
      console.error(`Error uploading author ${slug}:`, error.message);
    } else {
      console.log(`Upserted author: ${authorRow.name}`);
    }
  }
}

// 3. Seed Articles
async function seedArticles() {
  console.log('\n--- Seeding Articles ---');
  const folders = [
    { dir: 'judgments', dbType: 'judgment' },
    { dir: 'policies', dbType: 'policy' },
    { dir: 'research', dbType: 'research' },
    { dir: 'opinions', dbType: 'opinion' },
  ];

  for (const folder of folders) {
    const dirPath = path.join(process.cwd(), 'content', folder.dir);
    if (!fs.existsSync(dirPath)) continue;

    const fileNames = fs.readdirSync(dirPath);
    for (const fileName of fileNames) {
      if (!fileName.endsWith('.md')) continue;

      const slug = fileName.replace(/\.md$/, '');
      const fileContent = fs.readFileSync(path.join(dirPath, fileName), 'utf8');
      const { data, content } = matter(fileContent);

      const htmlContent = marked.parse(content);
      const readingTime = calculateReadingTime(content);

      const articleRow = {
        slug: data.slug || slug,
        type: folder.dbType,
        title: data.title || '',
        author_slug: data.author || null,
        date: data.date || new Date().toISOString().split('T')[0],
        categories: data.categories || [],
        tags: data.tags || [],
        content: htmlContent,
        raw_content: content,
        reading_time: readingTime,
        
        // Judgment
        case_summary: data.caseSummary || null,
        legal_principles: data.legalPrinciples || [],
        statutes_referenced: data.statutesReferenced || [],
        key_takeaways: data.keyTakeaways || [],
        citation: data.citation || null,
        
        // Policy
        policy_overview: data.policyOverview || null,
        policy_objectives: data.policyObjectives || [],
        legal_implications: data.legalImplications || [],
        
        // Research
        abstract: data.abstract || null,
        references: data.references || [],
      };

      const { error } = await supabase.from('articles').upsert(articleRow);
      if (error) {
        console.error(`Error uploading article ${folder.dbType}/${slug}:`, error.message);
      } else {
        console.log(`Upserted article (${folder.dbType}): ${articleRow.title}`);
      }
    }
  }
}

async function run() {
  try {
    await seedCategories();
    await seedAuthors();
    await seedArticles();
    console.log('\n--- Seeding Finished Successfully ---');
  } catch (err) {
    console.error('Seeding process failed:', err);
  }
}

run();
