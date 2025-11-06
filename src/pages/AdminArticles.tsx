import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error: err } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (err) throw err;
      setArticles(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten artykuł?')) return;

    try {
      const { error: err } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (err) throw err;
      setArticles(articles.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Strona główna', path: '/' },
        { label: 'Admin', path: '/admin' },
        { label: 'Artykuły', path: '/admin/artykuly' }
      ]} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Artykuły</h1>
          <Link
            to="/admin/artykul/nowy"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Nowy artykuł
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">Brak artykułów</p>
            <Link to="/admin/artykul/nowy" className="text-blue-600 hover:text-blue-700 font-medium">
              Stwórz pierwszy artykuł
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Tytuł</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Ostatnia aktualizacja</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-600">{article.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(article.status)}`}>
                        {article.status === 'published' ? 'Opublikowany' : article.status === 'draft' ? 'Draft' : 'Zarchiwizowany'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(article.updated_at).toLocaleDateString('pl-PL')}
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <Link
                        to={`/admin/artykul/${article.id}`}
                        className="text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edytuj
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-700 transition flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
