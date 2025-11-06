import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useRelatedArticles } from '../hooks/useArticles';
import { ContentRenderer } from '../components/ContentRenderer';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { PracticeQuiz } from '../components/PracticeQuiz';

interface PracticeProblem {
  question: string;
  answer: string;
  hint?: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  meta_description: string | null;
  meta_keywords: string | null;
  practice_problems: PracticeProblem[] | null;
  tags: string[] | null;
}

interface TableOfContentsItem {
  level: number;
  text: string;
  id: string;
}

function parsePracticeProblems(raw: unknown): PracticeProblem[] | null {
  if (!raw) return null;

  let data: unknown = raw;
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (!Array.isArray(data)) {
    return null;
  }

  const normalized = data
    .map((item) => {
      if (item && typeof item === 'object') {
        const record = item as Record<string, unknown>;
        const question = typeof record.question === 'string' ? record.question : null;
        const answerValue = record.answer;
        const answer =
          typeof answerValue === 'string' || typeof answerValue === 'number'
            ? String(answerValue)
            : null;
        const hint = typeof record.hint === 'string' ? record.hint : undefined;

        if (question && answer) {
          return { question, answer, hint } as PracticeProblem;
        }
      }
      return null;
    })
    .filter((item): item is PracticeProblem => item !== null);

  return normalized.length > 0 ? normalized : null;
}

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null);
  const [toc, setToc] = useState<TableOfContentsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { articles: relatedArticles } = useRelatedArticles(article?.id || '');

  useEffect(() => {
    (async () => {
      try {
        let query = supabase
          .from('articles')
          .select('*')
          .eq('slug', slug);

        if (!isAdmin) {
          query = query.eq('status', 'published');
        }

        const { data, error: err } = await query.single();

        if (err) throw err;

        setArticle({
          ...data,
          practice_problems: parsePracticeProblems(data.practice_problems),
          tags: Array.isArray(data.tags) ? data.tags : null
        });

        const { data: categoryData } = await supabase
          .from('categories')
          .select('name, slug')
          .eq('id', data.category_id)
          .single();

        if (categoryData) {
          setCategory(categoryData);
        }

        const headings = extractHeadings(data.content);
        setToc(headings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Article not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, isAdmin]);

  const extractHeadings = (content: string): TableOfContentsItem[] => {
    const lines = content.split('\n');
    const headings: TableOfContentsItem[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        const text = line.substring(3);
        headings.push({
          level: 2,
          text,
          id: `heading-${index}`,
        });
      } else if (line.startsWith('### ')) {
        const text = line.substring(4);
        headings.push({
          level: 3,
          text,
          id: `heading-${index}`,
        });
      }
    });

    return headings;
  };

  if (loading) {
    return (
      <>
        <Breadcrumbs />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="h-10 bg-gray-200 rounded mb-6 animate-pulse w-3/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
            <div className="hidden lg:block space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !article) {
    return (
      <>
        <Breadcrumbs />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Artykuł nie znaleziony</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">Wróć na stronę główną</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Strona główna', path: '/' },
        ...(category ? [{ label: category.name, path: `/kategoria/${category.slug}` }] : []),
        { label: article.title, path: `/artykul/${article.slug}` }
      ]} />

      <article className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

            {article.meta_description && (
              <p className="text-lg text-gray-600 mb-6">{article.meta_description}</p>
            )}

            <div className="flex items-center text-sm text-gray-500 mb-8">
              {category && (
                <Link
                  to={`/kategoria/${category.slug}`}
                  className="text-blue-600 hover:text-blue-700 mr-4"
                >
                  {category.name}
                </Link>
              )}
              <span>
                {new Date(article.created_at).toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
              <ContentRenderer content={article.content} />
            </div>

            {article.practice_problems && article.practice_problems.length > 0 && (
              <PracticeQuiz problems={article.practice_problems} />
            )}

            {relatedArticles.length > 0 && (
              <section className="mt-12 pt-12 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Powiązane artykuły</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      to={`/artykul/${related.slug}`}
                      className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-100 hover:border-blue-300 group"
                    >
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 mb-2">
                        {related.title}
                      </h3>
                      {related.meta_description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {related.meta_description}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {toc.length > 0 && (
            <aside className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                <h3 className="font-bold text-gray-900 mb-4">Spis treści</h3>
                <nav className="space-y-2 text-sm">
                  {toc.map((item, index) => (
                    <a
                      key={index}
                      href={`#${item.id}`}
                      className={`block text-gray-600 hover:text-blue-600 transition ${
                        item.level === 3 ? 'ml-4' : ''
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>
      </article>
    </>
  );
}
