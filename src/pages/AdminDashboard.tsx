import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface Stats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalCategories: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { count: totalArticles } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true });

        const { count: publishedArticles } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'published');

        const { count: draftArticles } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'draft');

        const { count: totalCategories } = await supabase
          .from('categories')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalArticles: totalArticles || 0,
          publishedArticles: publishedArticles || 0,
          draftArticles: draftArticles || 0,
          totalCategories: totalCategories || 0
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Strona główna', path: '/' },
        { label: 'Admin', path: '/admin' }
      ]} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Panel Administracyjny</h1>
          <Link
            to="/admin/artykul/nowy"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Nowy artykuł
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm mb-2">Łącznie artykułów</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats.totalArticles}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm mb-2">Opublikowane</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats.publishedArticles}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
            <p className="text-gray-600 text-sm mb-2">Drafty</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats.draftArticles}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
            <p className="text-gray-600 text-sm mb-2">Kategorie</p>
            <p className="text-3xl font-bold text-gray-900">{loading ? '-' : stats.totalCategories}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/admin/artykuly"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-100 hover:border-blue-300 group"
          >
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
              Zarządzaj artykułami
            </h2>
            <p className="text-gray-600 text-sm">Edytuj, usuń lub publikuj artykuły</p>
          </Link>

          <Link
            to="/admin/kategorie"
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 border border-gray-100 hover:border-blue-300 group"
          >
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">
              Zarządzaj kategoriami
            </h2>
            <p className="text-gray-600 text-sm">Twórz i edytuj kategorie artykułów</p>
          </Link>
        </div>
      </div>
    </>
  );
}
