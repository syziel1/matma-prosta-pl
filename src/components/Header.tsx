import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MP</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Matma-Prosta</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Strona główna</Link>
            <Link to="/kategorie" className="text-gray-700 hover:text-blue-600 transition">Kategorie</Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 transition font-medium">Admin</Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Search className="w-5 h-5 text-gray-700" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center gap-2"
                >
                  <User className="w-5 h-5 text-gray-700" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition flex items-center gap-2 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Wyloguj
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Zaloguj
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link to="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
              Strona główna
            </Link>
            <Link to="/kategorie" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
              Kategorie
            </Link>
            {isAdmin && (
              <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded font-medium transition">
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
