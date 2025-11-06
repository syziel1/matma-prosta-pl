/*
  # Fix Security and Performance Issues

  1. Foreign Key Indexes
    - Add indexes on article_revisions.article_id
    - Add indexes on article_revisions.author_id
    
  2. RLS Performance Optimization
    - Replace auth.<function>() with (select auth.<function>()) in all policies
    - This prevents re-evaluation per row and improves query performance at scale
    
  3. Consolidate SELECT Policies
    - Combine multiple permissive policies for SELECT using OR conditions
    - Reduces policy evaluation overhead
    
  4. Index Optimization
    - Indexes remain for future query performance when queries are optimized
*/

-- Add missing indexes for foreign keys in article_revisions
CREATE INDEX IF NOT EXISTS idx_article_revisions_article_id ON article_revisions(article_id);
CREATE INDEX IF NOT EXISTS idx_article_revisions_author_id ON article_revisions(author_id);

-- Drop old categories policies
DROP POLICY IF EXISTS "Authenticated admins can create categories" ON categories;
DROP POLICY IF EXISTS "Authenticated admins can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated admins can delete categories" ON categories;

-- Recreate categories policies with optimized RLS (using SELECT for auth calls)
CREATE POLICY "Authenticated admins can create categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = (select auth.uid())
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
      WHERE id = (select auth.uid())
      AND raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = (select auth.uid())
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
      WHERE id = (select auth.uid())
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Drop old articles policies
DROP POLICY IF EXISTS "Anyone can read published articles" ON articles;
DROP POLICY IF EXISTS "Authenticated admins can read all articles" ON articles;
DROP POLICY IF EXISTS "Authenticated admins can create articles" ON articles;
DROP POLICY IF EXISTS "Authenticated admins can update articles" ON articles;
DROP POLICY IF EXISTS "Authenticated admins can delete articles" ON articles;

-- Recreate articles policies with optimized RLS and consolidated SELECT
CREATE POLICY "Read articles based on status"
  ON articles
  FOR SELECT
  TO public
  USING (
    status = 'published'
    OR EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = (select auth.uid())
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
      WHERE id = (select auth.uid())
      AND raw_app_meta_data->>'role' = 'admin'
    )
    AND author_id = (select auth.uid())
  );

CREATE POLICY "Authenticated admins can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = (select auth.uid())
      AND raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = (select auth.uid())
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
      WHERE id = (select auth.uid())
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Drop old related_articles policies
DROP POLICY IF EXISTS "Anyone can read related articles" ON related_articles;
DROP POLICY IF EXISTS "Authenticated admins can manage related articles" ON related_articles;
DROP POLICY IF EXISTS "Authenticated admins can delete related articles" ON related_articles;

-- Recreate related_articles policies with optimized RLS
CREATE POLICY "Read related articles with published articles"
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
      WHERE id = (select auth.uid())
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
      WHERE id = (select auth.uid())
      AND raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Drop old article_revisions policies
DROP POLICY IF EXISTS "Authenticated admins can read revisions" ON article_revisions;
DROP POLICY IF EXISTS "Authenticated admins can create revisions" ON article_revisions;

-- Recreate article_revisions policies with optimized RLS
CREATE POLICY "Authenticated admins can read revisions"
  ON article_revisions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = (select auth.uid())
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
      WHERE id = (select auth.uid())
      AND raw_app_meta_data->>'role' = 'admin'
    )
    AND author_id = (select auth.uid())
  );