import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useSearchArticles } from '../hooks/useArticles';

export function HomePage() {
  const { categories, loading: categoriesLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState('');
  const { results: searchResults } = useSearchArticles(searchQuery);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/szukaj?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const mainCategories = categories.slice(0, 8);

  return (
    <div>
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Matma-Prosta.pl
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Matematyka wytłumaczona krok po kroku. Przygotuj się do matury bez stresu.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj artykułów... np. logarytmy, funkcje, pochodne"
                className="w-full px-6 py-4 pr-14 rounded-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition text-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition"
              >
                <Search className="w-6 h-6" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Główne Kategorie</h2>

        {categoriesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainCategories.map((category) => (
              <Link
                key={category.id}
                to={`/kategoria/${category.slug}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border border-gray-100 hover:border-blue-300"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-600 transition" />
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {category.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Ostatnie Artykuły</h2>

          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Wkrótce będą tu wyświetlane najnowsze artykuły...</p>
          </div>
        </div>
      </section>
    </div>
  );
}
