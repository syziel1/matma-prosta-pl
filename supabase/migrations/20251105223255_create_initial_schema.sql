/*
  # Create initial schema for Matma-Prosta.pl

  1. New Tables
    - `categories` - Article categories (Logarytmy, Funkcje, etc.)
    - `articles` - Main article content with LaTeX support
    - `related_articles` - Junction table for article relationships
    - `article_revisions` - Version history tracking for articles
    
  2. Security
    - Enable RLS on all tables
    - Public read access for articles and categories
    - Authenticated admin-only write access
    - Service role for admin operations
    
  3. Indexes
    - Optimize queries by slug and category
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admins can create categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Authenticated admins can update categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Authenticated admins can delete categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  featured_image_url text,
  meta_description text,
  meta_keywords text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published articles"
  ON articles
  FOR SELECT
  TO public
  USING (status = 'published');

CREATE POLICY "Authenticated admins can read all articles"
  ON articles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Authenticated admins can create articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
    AND author_id = auth.uid()
  );

CREATE POLICY "Authenticated admins can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Authenticated admins can delete articles"
  ON articles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Related articles junction table
CREATE TABLE IF NOT EXISTS related_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  related_article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT no_self_reference CHECK (article_id != related_article_id),
  UNIQUE(article_id, related_article_id)
);

ALTER TABLE related_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read related articles"
  ON related_articles
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM articles
      WHERE id = article_id AND status = 'published'
    )
  );

CREATE POLICY "Authenticated admins can manage related articles"
  ON related_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Authenticated admins can delete related articles"
  ON related_articles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Article revisions table for version history
CREATE TABLE IF NOT EXISTS article_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE article_revisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated admins can read revisions"
  ON article_revisions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Authenticated admins can create revisions"
  ON article_revisions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_app_meta_data->>'role' = 'admin'
    )
    AND author_id = auth.uid()
  );

-- Create indexes for optimized queries
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category_id ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured);
CREATE INDEX IF NOT EXISTS idx_related_articles_article_id ON related_articles(article_id);
CREATE INDEX IF NOT EXISTS idx_related_articles_related_article_id ON related_articles(related_article_id);