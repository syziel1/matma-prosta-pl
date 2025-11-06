import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', display_order: 0 });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error: err } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (err) throw err;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSave = async () => {
    if (!formData.name) {
      setError('Nazwa kategori jest wymagana');
      return;
    }

    try {
      const slug = formData.slug || generateSlug(formData.name);

      if (editingId) {
        const { error: err } = await supabase
          .from('categories')
          .update({ ...formData, slug })
          .eq('id', editingId);

        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('categories')
          .insert([{ ...formData, slug }]);

        if (err) throw err;
      }

      setFormData({ name: '', slug: '', description: '', display_order: 0 });
      setEditingId(null);
      setShowForm(false);
      setError('');
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      display_order: category.display_order
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę kategorię?')) return;

    try {
      const { error: err } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (err) throw err;
      fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', slug: '', description: '', display_order: 0 });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  return (
    <>
      <Breadcrumbs items={[
        { label: 'Strona główna', path: '/' },
        { label: 'Admin', path: '/admin' },
        { label: 'Kategorie', path: '/admin/kategorie' }
      ]} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Kategorie</h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Nowa kategoria
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8 border border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edytuj kategorię' : 'Nowa kategoria'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="np. Logarytmy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL (slug)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="np. logarytmy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opis</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Krótki opis kategorii"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kolejność wyświetlania</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
                >
                  {editingId ? 'Zaktualizuj' : 'Utwórz'}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 rounded-lg transition"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-blue-50 rounded-lg p-8 text-center">
            <p className="text-gray-600">Brak kategorii</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Nazwa</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Opis</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kolejność</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Akcje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-600">{category.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {category.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{category.display_order}</td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
                      >
                        <Edit className="w-4 h-4" />
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
