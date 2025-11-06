# Matma-Prosta.pl Setup Guide

## Project Overview

Matma-Prosta.pl is a production-ready educational math platform built with React, TypeScript, and Supabase. It features a comprehensive content management system, LaTeX mathematical formula rendering, and role-based authentication.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Math Rendering**: KaTeX
- **Routing**: React Router v7
- **Icons**: Lucide React

## Environment Setup

The Supabase credentials are already configured in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Database Schema

### Tables

1. **categories** - Article categories (Logarytmy, Funkcje, etc.)
   - id, name, slug, description, display_order

2. **articles** - Main article content
   - id, title, slug, content, category_id, author_id, status, is_featured, meta_description, meta_keywords

3. **related_articles** - Junction table for article relationships
   - article_id, related_article_id

4. **article_revisions** - Version history tracking
   - article_id, title, content, author_id, created_at

### Row Level Security (RLS)

All tables have RLS enabled:
- **Public Read**: Anyone can read published articles and categories
- **Admin Write**: Only authenticated users with admin role can create/edit/delete
- Role is stored in auth.users.raw_app_meta_data as `role: 'admin'`

## Authentication

The platform uses Supabase's built-in email/password authentication.

### Admin Account Setup

To set up an admin account, you need to manually set the role in Supabase:

1. Create a new user via Sign Up
2. In Supabase Dashboard → Authentication → Users
3. Click the user, then "Edit User"
4. Under "App metadata", add:
   ```json
   {
     "role": "admin"
   }
   ```

## Features

### Public Pages
- **Home** (`/`) - Hero section with category grid and search
- **Category** (`/kategoria/:slug`) - List of articles by category with pagination
- **Article** (`/artykul/:slug`) - Full article view with LaTeX support, TOC, and related articles
- **Search** (`/szukaj?q=...`) - Search results page

### Authentication Pages
- **Login** (`/login`) - Email/password login
- **Signup** (`/signup`) - User registration

### Admin Pages (Protected)
- **Dashboard** (`/admin`) - Statistics and quick actions
- **Articles Management** (`/admin/artykuly`) - Create, edit, delete articles
- **Article Editor** (`/admin/artykul/:articleId`) - Rich article creation/editing with LaTeX preview
- **Categories Management** (`/admin/kategorie`) - Manage article categories

## Content Creation

### Article Markdown Format

Articles support markdown-like formatting with LaTeX:

```markdown
# Main Heading

## Sub Heading

### Smaller Heading

Regular paragraph text goes here.

Inline LaTeX: $x^2 + y^2 = z^2$

Block LaTeX:
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

Another paragraph...
```

### LaTeX Support

- **Inline**: Use `$formula$` for inline formulas
- **Block**: Use `$$\nformula\n$$` for display mode (on separate lines)
- Both are rendered beautifully using KaTeX

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Breadcrumbs.tsx
│   ├── ContentRenderer.tsx
│   ├── MathBlock.tsx
│   ├── InlineMath.tsx
│   └── ProtectedRoute.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── hooks/             # Custom React hooks
│   ├── useCategories.ts
│   └── useArticles.ts
├── lib/               # Utilities
│   └── supabase.ts
├── pages/             # Page components
│   ├── HomePage.tsx
│   ├── CategoryPage.tsx
│   ├── ArticlePage.tsx
│   ├── SearchPage.tsx
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── AdminDashboard.tsx
│   ├── AdminArticles.tsx
│   ├── AdminArticleEditor.tsx
│   └── AdminCategories.tsx
├── App.tsx            # Main app component with routing
├── main.tsx           # Entry point
└── index.css          # Global styles
```

## Development

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Type Checking
```bash
npm run typecheck
```

### Run Linter
```bash
npm run lint
```

## Key Implementation Details

### Authentication Flow
1. User signs up → Supabase creates auth user
2. Login sets session in context
3. Protected routes check authentication and admin role
4. Role comes from auth metadata (must be set manually in Supabase)

### Article Rendering
- Content is stored as markdown + LaTeX in database
- ContentRenderer component parses content on display
- Supports headings (H1, H2, H3), paragraphs, and math
- Automatically generates table of contents from headings

### Search Functionality
- Full-text search on title and content fields
- Debounced input (300ms) for performance
- Only shows published articles to public users
- All articles shown to admins

### Data Security
- Row Level Security prevents unauthorized access
- Only authenticated admins can create/edit articles
- Public users only see published articles
- Session management handled by Supabase auth

## Content Management Workflow

1. **Admin Login** - Sign in at `/login`
2. **Create Category** - Go to Admin → Manage Categories
3. **Create Article** - Go to Admin → New Article
4. **Write Content** - Use markdown + LaTeX format in editor
5. **Preview** - Click "Show Preview" to see rendered content
6. **Publish** - Click "Publish" to make article public (or save as draft)
7. **View Article** - Navigate to public article page

## Example Article Content

```markdown
# Logarytmy od Podstaw

## Co to jest logarytm?

Logarytm liczby $b$ przy podstawie $a$ to liczba $x$, dla której zachodzi:

$$
a^x = b
$$

Zapisujemy to jako: $\log_a b = x$

## Własności Logarytmów

Oto najważniejsze własności logarytmów:

1. Logarytm iloczynu: $\log_a(x \cdot y) = \log_a x + \log_a y$
2. Logarytm ilorazu: $\log_a(x/y) = \log_a x - \log_a y$
3. Logarytm potęgi: $\log_a(x^n) = n \log_a x$

## Przykład

Rozwiąż równanie: $\log_2 x = 3$

Z definicji logarytmu wynika, że:

$$
2^3 = x
$$

Zatem $x = 8$.
```

## Sample Data

Sample categories have been seeded in the database:
- Logarytmy
- Funkcje
- Geometria
- Trygonometria
- Pewniaki Maturalne
- Zadania na Dowodzenie
- Pochodne
- Całki

## Performance Notes

- KaTeX fonts are bundled (~600KB) for offline rendering
- Consider code splitting in future for large deployments
- Search is debounced to prevent excessive queries
- Images and featured images should be optimized before upload

## Troubleshooting

### Admin can't access admin pages
- Check that `app_metadata.role` is set to "admin" in Supabase
- User may need to log out and back in to refresh token

### LaTeX not rendering
- Check browser console for KaTeX errors
- Ensure formulas are properly escaped with `$` delimiters
- Block formulas need `$$\n` on separate lines

### Search not working
- Ensure articles are published (status = 'published')
- Check that search query is not empty
- Search is debounced - wait 300ms after typing

## License

Internal project for Matma-Prosta.pl
