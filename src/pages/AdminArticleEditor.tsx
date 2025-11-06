import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCategories } from '../hooks/useCategories';
import { ContentRenderer } from '../components/ContentRenderer';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface Article {
  id?: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  meta_description: string;
  meta_keywords: string;
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
}

export function AdminArticleEditor() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { categories } = useCategories();
  const [article, setArticle] = useState<Article>({
    title: '',
    slug: '',
    content: '',
    category_id: '',
    meta_description: '',
    meta_keywords: '',
    status: 'draft',
    is_featured: false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(articleId ? true : false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (articleId && articleId !== 'nowy') {
      (async () => {
        try {
          const { data, error: err } = await supabase
            .from('articles')
            .select('*')
            .eq('id', articleId)
            .single();

          if (err) throw err;
          setArticle(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load article');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [articleId]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setArticle(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setError('');
    setSaving(true);

    try {
      if (!article.title || !article.content || !article.category_id) {
        throw new Error('Uzupełnij wymagane pola');
      }

      if (!user) throw new Error('Not authenticated');

      if (article.id) {
        const { error: err } = await supabase
          .from('articles')
          .update({
            ...article,
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', article.id);

        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('articles')
          .insert([{
            ...article,
            status,
            author_id: user.id,
            created_at: new Date().toISOString()
          }]);

        if (err) throw err;
      }

      navigate('/admin/artykuly');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Breadcrumbs />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-64 mb-6" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Strona główna', path: '/' },
        { label: 'Admin', path: '/admin' },
        { label: articleId === 'nowy' ? 'Nowy artykuł' : 'Edytuj artykuł', path: window.location.pathname }
      ]} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            {articleId === 'nowy' ? 'Nowy artykuł' : 'Edytuj artykuł'}
          </h1>
          <Link to="/admin/artykuly" className="text-gray-600 hover:text-gray-900">
            Powrót
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tytuł *</label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Wpisz tytuł artykułu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL (slug) *</label>
                <input
                  type="text"
                  value={article.slug}
                  onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="artykul-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria *</label>
                <select
                  value={article.category_id}
                  onChange={(e) => setArticle(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                  <option value="">Wybierz kategorię</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opis (meta) *</label>
                <textarea
                  value={article.meta_description}
                  onChange={(e) => setArticle(prev => ({ ...prev, meta_description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Krótki opis artykułu"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zawartość *
                  <span className="block text-xs text-gray-500 font-normal mt-1">
                    Obsługiwane: # H1, ## H2, ### H3, $...$  (LaTeX inline), $$\n...\n$$ (LaTeX block)
                  </span>
                </label>
                <textarea
                  value={article.content}
                  onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-mono text-sm"
                  placeholder="Wpisz zawartość artykułu (markdown + LaTeX)"
                  rows={20}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleSave('draft')}
                  disabled={saving}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
                >
                  {saving ? 'Zapisywanie...' : 'Zapisz jako draft'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('published')}
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg transition"
                >
                  {saving ? 'Zapisywanie...' : 'Opublikuj'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="font-bold text-gray-900 mb-4">Podgląd</h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full mb-4 bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 rounded-lg transition"
              >
                {showPreview ? 'Ukryj podgląd' : 'Pokaż podgląd'}
              </button>

              {showPreview && article.content && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="prose prose-sm max-w-none max-h-96 overflow-y-auto">
                    <ContentRenderer content={article.content} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
