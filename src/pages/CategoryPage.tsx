import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  meta_description: string | null;
}

const ARTICLES_PER_PAGE = 10;

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { isAdmin } = useAuth();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();

        if (catError) throw catError;
        setCategory(catData);

        const rangeStart = (page - 1) * ARTICLES_PER_PAGE;
        const rangeEnd = page * ARTICLES_PER_PAGE - 1;

        let query = supabase
          .from('articles')
          .select('*', { count: 'exact' })
          .eq('category_id', catData.id)
          .order('created_at', { ascending: false });

        if (!isAdmin) {
          query = query.eq('status', 'published');
        }

        const { data: articlesData, error: articlesError, count } = await query
          .range(rangeStart, rangeEnd);

        if (articlesError) throw articlesError;

        setArticles(articlesData || []);
        const computedTotalPages = count ? Math.max(1, Math.ceil(count / ARTICLES_PER_PAGE)) : 1;
        setTotalPages(computedTotalPages);
      } catch (err) {
        console.error('Failed to fetch category:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, page, isAdmin]);

  if (loading) {
    return (
      <>
        <Breadcrumbs />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-10 bg-gray-200 rounded mb-6 animate-pulse w-64" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <Breadcrumbs />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Kategoria nie znaleziona</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700">Wróć na stronę główną</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Strona główna', path: '/' },
        { label: category.name, path: `/kategoria/${category.slug}` }
      ]} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Wszystkie artykuły: {category.name}</h1>

        {category.description && (
          <p className="text-lg text-gray-600 mb-8">{category.description}</p>
        )}

        {articles.length === 0 ? (
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">Brak artykułów w tej kategorii</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/artykul/${article.slug}`}
                  className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-100 hover:border-blue-300 group"
                >
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
                    {article.title}
                  </h2>
                  {article.meta_description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{article.meta_description}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString('pl-PL')}
                  </p>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-lg transition ${
                      page === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
