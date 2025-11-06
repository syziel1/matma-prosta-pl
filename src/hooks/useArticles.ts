import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  author_id: string;
  featured_image_url: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  practice_problems: any;
  tags: string[] | null;
  category?: { name: string; slug: string };
}

export function useArticlesByCategory(categorySlug: string | null, isAdmin: boolean = false) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) return;

    (async () => {
      try {
        let query = supabase
          .from('articles')
          .select('*')
          .eq('category_id', (await supabase.from('categories').select('id').eq('slug', categorySlug).single()).data?.id || '');

        if (!isAdmin) {
          query = query.eq('status', 'published');
        }

        const { data, error: err } = await query.order('created_at', { ascending: false });

        if (err) throw err;
        setArticles(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    })();
  }, [categorySlug, isAdmin]);

  return { articles, loading, error };
}

export function useArticleBySlug(slug: string | null, isAdmin: boolean = false) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        let query = supabase
          .from('articles')
          .select('*')
          .eq('slug', slug);

        if (!isAdmin) {
          query = query.eq('status', 'published');
        }

        const { data, error: err } = await query.maybeSingle();

        if (err) throw err;
        setArticle(data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch article');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, isAdmin]);

  return { article, loading, error };
}

export function useSearchArticles(query: string, isAdmin: boolean = false) {
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setResults([]);
      return;
    }

    const sanitizedQuery = sanitizeSearchQuery(trimmedQuery);
    if (!sanitizedQuery) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setError(null);

        const likePattern = `%${escapeForIlike(sanitizedQuery)}%`;
        const orFilter = `title.ilike.${likePattern},content.ilike.${likePattern}`;

        let search = supabase
          .from('articles')
          .select('*')
          .or(orFilter);

        if (!isAdmin) {
          search = search.eq('status', 'published');
        }

        const { data, error: err } = await search.order('created_at', { ascending: false });

        if (err) throw err;
        setResults(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 300);

    setLoading(true);
    return () => clearTimeout(timer);
  }, [query, isAdmin]);

  return { results, loading, error };
}

export function useRelatedArticles(articleId: string) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleId) return;

    (async () => {
      try {
        const { data, error: err } = await supabase
          .from('related_articles')
          .select('related_article_id')
          .eq('article_id', articleId);

        if (err) throw err;

        const relatedIds = data?.map(r => r.related_article_id) || [];
        if (relatedIds.length === 0) {
          setArticles([]);
          return;
        }

        const { data: articles, error: err2 } = await supabase
          .from('articles')
          .select('*')
          .in('id', relatedIds)
          .eq('status', 'published')
          .limit(3);

        if (err2) throw err2;
        setArticles(articles || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch related articles');
      } finally {
        setLoading(false);
      }
    })();
  }, [articleId]);

  return { articles, loading, error };
}

const MAX_SEARCH_LENGTH = 100;

function sanitizeSearchQuery(rawQuery: string): string {
  const normalized = rawQuery
    .normalize('NFKC')
    .slice(0, MAX_SEARCH_LENGTH)
    .replace(/[(),]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized;
}

function escapeForIlike(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}
