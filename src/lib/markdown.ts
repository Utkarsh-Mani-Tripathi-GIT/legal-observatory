import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked, type Tokens } from 'marked';

const contentDirectory = path.join(process.cwd(), 'content');
const categoriesPath = path.join(contentDirectory, 'categories.json');

// Configure marked options to include custom heading renderer with anchor IDs
const customRenderer = new marked.Renderer();
customRenderer.heading = function ({ text, depth }: Tokens.Heading) {
  const slug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-');
  return `<h${depth} id="${slug}">${text}</h${depth}>`;
};

marked.use({ renderer: customRenderer });

marked.setOptions({
  gfm: true,
  breaks: true,
});

export interface AuthorData {
  slug: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  content?: string;
}

export interface CategoryData {
  slug: string;
  name: string;
  description: string;
  color: string;
}

export interface ArticleData {
  slug: string;
  type: 'judgment' | 'policy' | 'research' | 'opinion';
  format?: 'monthly-report' | 'post' | 'blog'; // content format filter
  title: string;
  author: string; // author slug
  authorDetails?: AuthorData;
  date: string;
  categories: string[];
  tags: string[];
  content: string; // HTML string
  rawContent: string;
  readingTime: string;
  draft?: boolean; // if true, article is hidden from public listings
  private?: boolean; // if true, only accessible from Bhoomija's profile reader
  
  // Type specific metadata
  caseSummary?: string;
  legalPrinciples?: string[];
  statutesReferenced?: string[];
  keyTakeaways?: string[];
  citation?: string;
  
  policyOverview?: string;
  policyObjectives?: string[];
  legalImplications?: string[];
  
  abstract?: string;
  references?: string[];
  coverImage?: string;
}

// Helper to calculate reading time
function calculateReadingTime(text: string): string {
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s+/).length;
  const minutes = Math.ceil(noOfWords / wordsPerMinute);
  return `${minutes} min read`;
}

// Get all categories
export function getCategories(): CategoryData[] {
  try {
    if (!fs.existsSync(categoriesPath)) return [];
    const fileContent = fs.readFileSync(categoriesPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading categories:', error);
    return [];
  }
}

export function getCategoryBySlug(slug: string): CategoryData | undefined {
  const categories = getCategories();
  return categories.find((cat) => cat.slug === slug);
}

// Get author profile by slug
export function getAuthorBySlug(slug: string): AuthorData | undefined {
  try {
    const filePath = path.join(contentDirectory, 'authors', `${slug}.md`);
    if (!fs.existsSync(filePath)) return undefined;

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      slug: data.slug || slug,
      name: data.name || '',
      role: data.role || '',
      avatar: data.avatar || '',
      bio: data.bio || '',
      socialLinks: data.socialLinks || {},
      content: content,
    };
  } catch (error) {
    console.error(`Error reading author ${slug}:`, error);
    return undefined;
  }
}

// Get all author profiles
export function getAuthors(): AuthorData[] {
  try {
    const authorsDir = path.join(contentDirectory, 'authors');
    if (!fs.existsSync(authorsDir)) return [];

    const fileNames = fs.readdirSync(authorsDir);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        return getAuthorBySlug(slug);
      })
      .filter((author): author is AuthorData => author !== undefined);
  } catch (error) {
    console.error('Error reading authors directory:', error);
    return [];
  }
}

// Get single article by type and slug
export async function getArticleBySlug(
  typeFolder: 'judgments' | 'policies' | 'research' | 'opinions',
  slug: string
): Promise<ArticleData | undefined> {
  try {
    const filePath = path.join(contentDirectory, typeFolder, `${slug}.md`);
    if (!fs.existsSync(filePath)) return undefined;

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Convert Markdown to HTML
    const contentHtml = await marked(content);
    const readingTime = calculateReadingTime(content);

    // Fetch author details
    const authorDetails = data.author ? getAuthorBySlug(data.author) : undefined;

    return {
      slug: data.slug || slug,
      type: data.type || 'research',
      title: data.title || '',
      author: data.author || '',
      authorDetails,
      date: data.date || '',
      categories: data.categories || [],
      tags: data.tags || [],
      content: contentHtml,
      rawContent: content,
      readingTime,
      coverImage: data.coverImage,
      
      // Judgment reviews
      caseSummary: data.caseSummary,
      legalPrinciples: data.legalPrinciples,
      statutesReferenced: data.statutesReferenced,
      keyTakeaways: data.keyTakeaways,
      citation: data.citation,
      
      // Policy reviews
      policyOverview: data.policyOverview,
      policyObjectives: data.policyObjectives,
      legalImplications: data.legalImplications,
      
      // Research
      abstract: data.abstract,
      references: data.references,
      // Access control
      draft: data.draft || false,
      private: data.private || false,
    };
  } catch (error) {
    console.error(`Error reading article ${typeFolder}/${slug}:`, error);
    return undefined;
  }
}

// Get all articles across folders, or in a specific folder
export async function getArticles(
  typeFolder?: 'judgments' | 'policies' | 'research' | 'opinions'
): Promise<ArticleData[]> {
  const folders = typeFolder
    ? [typeFolder]
    : (['judgments', 'policies', 'research', 'opinions'] as const);

  let allArticles: ArticleData[] = [];

  for (const folder of folders) {
    const dirPath = path.join(contentDirectory, folder);
    if (!fs.existsSync(dirPath)) continue;

    const fileNames = fs.readdirSync(dirPath);
    const articles = await Promise.all(
      fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map(async (fileName) => {
          const slug = fileName.replace(/\.md$/, '');
          return getArticleBySlug(folder, slug);
        })
    );

    allArticles = allArticles.concat(
      articles.filter((art): art is ArticleData => art !== undefined && !art.draft && !art.private)
    );
  }

  // Sort by date descending
  return allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
