# VS Code Autopilot Brief

Use this repo as a live editorial site running on `localhost:3000`.

## What must stay true

- Do not break routes or links.
- Keep the Home page clean and mobile-friendly.
- Keep the Home page contributor CTA labeled `Contributors`.
- Do not show the contributors section on the Home page.
- Keep the `/authors` route working and label it `Contributors` in the nav.
- Use the spider avatar asset for Utkarsh: `/utkarsh-avatar.svg`.
- Keep the monthly article review visible on the Home page.
- Keep the research launch timer accurate.
- Keep the Human Rights article release set to `9 July 2026, 6:00 PM IST`.
- Preserve `format` metadata through the content pipeline.
- Show `June 2026` for monthly-report and founding-editorial content, not a day-level date.

## Editing rules

- Prefer small, targeted edits over broad rewrites.
- If a date is shown for a monthly issue or founding editorial, use the shared publication-date formatter.
- If a new loader or mapper touches article data, carry `format` through unchanged.
- If a page has a date label for a monthly issue, it should resolve to month-year only.
- Keep the UI responsive on phones first, then refine desktop polish.

## Checked routes

- `/`
- `/about`
- `/authors`
- `/authors/utkarsh-mani-tripathi`
- `/publications`
- `/publications/research/monthly-legal-review-june-2026`
- `/publications/research/the-weaponization-of-human-rights`
- `/publications/opinions/founding-editorial`

## Current implementation notes

- Home page uses a monthly issue card plus a timed research launch card.
- The content loader now preserves `format` for local markdown and Supabase rows.
- Search results should use month-year formatting for monthly-report and founding-editorial items.
- The private Bhoomija reader page should also use the shared publication-date formatter.

## Safe checks before shipping

- Run targeted lint on touched files.
- Reload `localhost:3000` and verify the Home, About, Authors, and article pages.
- Confirm no new 404s were introduced.
