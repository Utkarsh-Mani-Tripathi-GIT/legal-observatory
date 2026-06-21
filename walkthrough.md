# Legal Observatory Platform - Walkthrough & Architecture Report

A fully functional, high-fidelity, production-ready MVP of the **Legal Observatory Platform** has been created in the `legal-observatory` directory. The codebase compiles successfully, uses **Next.js App Router**, **TypeScript**, and **Tailwind CSS v4**, and is optimized for deployment on **Vercel** with a zero-rewrite path to **Supabase**.

---

## 🎨 Color Scheme & Theme (Updated)

Per your design directives, the color scheme maps exactly to the custom palette:
- **Background Color**: `#FFFFFF` in Light Mode, `#293040` (Deep Navy) in Dark Mode.
- **Foreground Text Color**: `#293040` (Deep Navy) in Light Mode, `#FFFFFF` in Dark Mode.
- **Secondary Gray-Blue Accent**: `#3B475C` (used for dividers, borders, select states).
- **Primary Accent / Gold**: `#D3AC2B` (used for links, highlight states, buttons, citations).

These colors are mapped directly to CSS variables and Tailwind v4 themes in [src/app/globals.css](src/app/globals.css) using overrides for the `indigo` and `slate` scales:
- `indigo-500` & `indigo-600` resolve to `#D3AC2B` (gold).
- `slate-900` resolves to `#293040` (navy).
- `slate-800` resolves to `#3B475C` (gray-blue).

---

## ✍️ Authorship (Updated)

- The **only author** registered on the platform is **Bhoomija Khanna** (slug: `bhoomija-khanna`).
- The mock authors have been deleted.
- The biography card, profile avatar, social links, and lists of written papers have been fully updated to reference **Bhoomija Khanna** across all page layouts.

---

## 📄 Content Placeholders (Updated)

All imaginary articles and pre-written mock postings have been cleared of long text narratives and replaced with clean, structured placeholders that say:
- **"CONTENT GOES HERE"**
- **"[Your Article Content Goes Here]"**

These placeholders exist across:
1. **Case Summaries / Abstracts** (Metadata)
2. **Main Article Body Paragraphs**
3. **Fact, Background, Reasoning, Analysis, and Conclusion Sections**

This provides a clean slate where your actual articles can be added.

---

## 📂 Project Directory Structure

```
/legal-observatory
├── content/                     # Local Markdown Data Sources
│   ├── judgments/               # Case analyses (e.g. separation-of-powers-ruling.md)
│   ├── policies/                # Legislation audits (e.g. digital-services-act-assessment.md)
│   ├── research/                # Full academic papers (e.g. privacy-in-algorithmic-governance.md)
│   ├── opinions/                # Scholar editorials (e.g. climate-litigation-frontiers.md)
│   ├── authors/                 # Scholar bio files (e.g. bhoomija-khanna.md)
│   └── categories.json          # 10 core fields of law & metadata
├── supabase/                    # Supabase Resources
│   ├── schema.sql               # Relational SQL schema, indices, & views
│   └── seed.js                  # Automatic Node.js seeder to upload md content
├── src/
│   ├── app/                     # App Router pages and APIs
│   │   ├── layout.tsx           # Global wrap, Google fonts (Playfair/Inter), SEO metadata
│   │   ├── page.tsx             # Homepage (Hero, featured papers, scholars list)
│   │   ├── about/page.tsx       # About page (editorial board & philosophy)
│   │   ├── contact/page.tsx     # Submission guidelines & contact form
│   │   ├── publications/        # Search catalog, paging, & sort toolbar
│   │   │   ├── page.tsx
│   │   │   └── [category]/[slug]/  # Single paper view (TOC, citations, related grid)
│   │   │       ├── ViewTracker.tsx
│   │   │       └── CiteSection.tsx
│   │   └── api/                 # Endpoint routes (Search indexing, newsletters, views tracking)
│   │       ├── search/route.ts
│   │       ├── newsletter/route.ts
│   │       └── views/route.ts
│   ├── components/              # Interactive UI blocks
│   │   ├── Header.tsx           # Sticky nav, theme toggle, Cmd+K search overlay trigger
│   │   ├── Footer.tsx           # Column layout, social SVGs, email signup form
│   │   ├── ArticleCard.tsx      # Scholarly article grid card
│   │   ├── CitationModal.tsx    # MLA, APA, Bluebook legal citation generator
│   │   ├── TableOfContents.tsx  # Viewport IntersectionObserver scroll-tracker
│   │   ├── SearchOverlay.tsx    # Cmd+K global search autocomplete modal
│   │   └── ThemeProvider.tsx    # Context provider syncing .dark wrapper class
│   └── lib/                     # Libraries
│       ├── markdown.ts          # Markdown reader & html compilers
│       ├── supabase.ts          # Supabase client singleton setup
│       └── content.ts           # DAL abstraction routing
```

---

## ⚡ Live Status

- **Production URL**: [https://legal-observatory.vercel.app](https://legal-observatory.vercel.app)
- **Deployment URL**: [https://legal-observatory-cgfeylljg-utkarsh-mani-tripathi.vercel.app](https://legal-observatory-cgfeylljg-utkarsh-mani-tripathi.vercel.app)
- **Supabase Project ID**: `pbysrftircgrhchootwi`

Any changes pushed to your master branch or re-seeded in Supabase will immediately update the live observatory.

---

## 🎨 Website Favicon Logo (Updated)
- The default Vercel favicon has been replaced with the official **National Legal Observatory** logo (placed at `src/app/icon.png`).
- Next.js App Router automatically compiles this into the browser's tab icon route.

---

## ⚡ Recent Enhancements & Fixes (June 2026)
- **Instant Category Descriptions**: Removed transition-opacity duration classes from comparison table tooltips inside `content/research/manufacturing-consent.md`, making the definition cards display instantly on hover without delay.
- **Scroll Sync Table of Contents**: Added auto-scroll sync mechanism in `TableOfContents.tsx` which automatically center-scrolls the sidebar container as readers navigate down the document.
- **Home Navigation Alert Alert**: Hooked up click actions on the header logo branding to display an alert popup with the message `"This button takes you to the HOME PAGE"` prior to executing the redirection.
- **Sidebar Ordering**: Standardized layout ordering: Table of Contents is positioned at the top, followed by Bhoomija Khanna's author biography, and the Citation Index details are placed at the bottom.



