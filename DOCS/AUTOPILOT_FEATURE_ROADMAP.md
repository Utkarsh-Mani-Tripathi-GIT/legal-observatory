# National Legal Observatory - Autopilot Feature Roadmap

## Purpose
Use this document as the working brief for VS Code autopilot. The goal is to turn the current National Legal Observatory website into a more useful legal research platform with stronger discovery, reading, author, and submission flows.

## Product Goal
Make the website feel like a serious independent legal observatory where users can:
- discover publications quickly,
- search and filter by meaningful legal metadata,
- read long-form legal analysis comfortably,
- understand authors and editorial context,
- submit research or contact the editorial team,
- subscribe for updates and alerts.

## What Already Exists
The site already has:
- a strong homepage and visual identity,
- navigation to Home, Publications, Authors, About, and Contact,
- a search entry point in the header,
- featured and recent publication cards,
- author links and category links,
- newsletter signup,
- a polished dark-mode presentation.

## Priority Feature List

### P0 - Must Have
1. Improved global search
2. Publications filtering and sorting
3. Better publication detail pages
4. Author profile pages
5. A real submission/contact workflow

### P1 - High Value
1. Related articles and recommendations
2. Citation tools
3. Table of contents for long articles
4. Save/bookmark functionality
5. Newsletter preferences by topic

### P2 - Nice to Have
1. Reading progress indicator
2. Print-friendly and PDF export mode
3. Trending / most read modules
4. Topic alerts
5. Improved accessibility and keyboard support

## Page-by-Page Work

### 1. Home Page
Keep the current design, but add:
- a stronger search interaction,
- featured publication section,
- latest publication section,
- trending or most-read section,
- upcoming issue or upcoming article module,
- clearer CTA to submit research.

### 2. Publications Index
Build a proper archive experience with:
- search,
- filters by type, category, author, year, and topic,
- sorting by newest, most relevant, most read, and longest/shortest,
- empty state with helpful suggestions,
- pagination or infinite scrolling.

### 3. Publication Detail Page
Add:
- title, subtitle, author, date, read time, and category metadata,
- table of contents,
- anchor links to sections,
- citation copy button,
- related articles,
- source/reference section,
- sharing actions,
- print-friendly layout.

### 4. Author Pages
Add author profile pages with:
- bio,
- focus areas,
- all publications by that author,
- optional social/profile links,
- featured or latest work,
- clear contact/submission link.

### 5. About Page
Make the about page explain:
- mission and editorial philosophy,
- what the observatory covers,
- editorial standards,
- what sources are used,
- who edits and reviews work.

### 6. Contact / Submit Research
Turn contact into a structured submission page with:
- name,
- email,
- article title,
- abstract,
- category,
- file upload or paste area,
- notes for the editor,
- confirmation message on submit.

### 7. Footer
Add more practical utility:
- sitemap-style links,
- social links,
- newsletter signup,
- legal/citation policy,
- privacy and terms,
- contact email.

## Feature Details

### Search
Search should support:
- title,
- author,
- keyword,
- topic,
- case name,
- statute/act,
- jurisdiction,
- year.

Recommended behavior:
- show suggestions while typing,
- highlight matched text,
- keep search state in the URL,
- allow clearing filters in one click.

### Filters
Useful filters for legal content:
- content type,
- legal subject,
- jurisdiction,
- year,
- author,
- read time,
- featured only.

### Citation Tools
For each article, include:
- copy citation button,
- citation preview,
- source list,
- section anchors.

### Reader Experience
For long-form research pieces:
- sticky table of contents,
- reading progress bar,
- “back to top” control,
- related reading panel,
- low-distraction reading mode.

### Editorial Workflow
If the site supports publishing workflows later, build toward:
- draft,
- review,
- published,
- scheduled,
- archived.

## UX Improvements Worth Doing
- Keep the dark visual language but improve spacing on mobile.
- Make CTA buttons more obvious.
- Use consistent article cards with metadata blocks.
- Make categories feel interactive, not just decorative.
- Ensure keyboard navigation works well for search and filters.
- Improve contrast for small text in dark mode.

## SEO and Sharing
Add:
- title and meta description per page,
- Open Graph and Twitter cards,
- canonical URLs,
- structured metadata for articles and authors,
- share links for social platforms.

## Accessibility
Minimum targets:
- visible focus states,
- semantic headings,
- descriptive link text,
- good color contrast,
- keyboard-accessible search and menus,
- alt text for editorial images.

## Implementation Order
1. Search and archive filters
2. Publication detail page upgrades
3. Author pages
4. Submission/contact workflow
5. Related content, citations, and reading tools
6. SEO, accessibility, and polish

## Definition of Done
The work is ready when:
- users can find publications easily,
- publications are easy to read and cite,
- author discovery feels complete,
- submissions are structured,
- the homepage feels current and useful,
- mobile and desktop both feel clean and usable.

## Suggested VS Code Autopilot Prompt
Use this if you want the editor agent to start work immediately:

> Improve the National Legal Observatory website into a more usable legal research platform. Prioritize global search, publication filters, article detail enhancements, author pages, and a structured submission/contact flow. Preserve the existing visual identity, but make the UX more useful, discoverable, and mobile-friendly. Add citation tools, related articles, table of contents, and accessibility improvements where they fit naturally.

