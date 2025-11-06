import { useSearchParams, Link } from 'react-router-dom';
import { useSearchArticles } from '../hooks/useArticles';
import { Breadcrumbs } from '../components/Breadcrumbs';

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { results, loading } = useSearchArticles(query);

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Strona główna', path: '/' },
        { label: `Wyniki wyszukiwania: "${query}"`, path: window.location.pathname }
      ]} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Wyniki wyszukiwania</h1>
        <p className="text-lg text-gray-600 mb-8">
          Wyniki dla: <span className="font-semibold">"{query}"</span>
        </p>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">Nie znaleziono artykułów pasujących do Twojego zapytania.</p>
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Wróć na stronę główną
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((article) => (
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
        )}
      </div>
    </>
  );
}
