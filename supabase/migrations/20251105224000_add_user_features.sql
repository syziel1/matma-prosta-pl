-- 1. Przywrócenie pola na interaktywne zadania (JSONB jest idealny do tego celu)
ALTER TABLE IF EXISTS public.articles
  ADD COLUMN practice_problems JSONB NULL;

-- 2. Przywrócenie pól do wizualizacji kategorii (zgodnie z projektem Figma)
ALTER TABLE IF EXISTS public.categories
  ADD COLUMN icon TEXT NULL,
  ADD COLUMN color TEXT NULL;

-- 3. (Opcjonalnie, ale zalecane) Dodanie tagów do artykułów (zamiast budowania skomplikowanej relacji)
ALTER TABLE IF EXISTS public.articles
  ADD COLUMN tags TEXT[] NULL;

-- 4. Komentarz: Ignorujemy `article_revisions` i `related_articles` - są poza zakresem MVP.
