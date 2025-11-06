import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticlePage } from './pages/ArticlePage';
import { SearchPage } from './pages/SearchPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminArticles } from './pages/AdminArticles';
import { AdminArticleEditor } from './pages/AdminArticleEditor';
import { AdminCategories } from './pages/AdminCategories';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-white">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/szukaj" element={<SearchPage />} />
              <Route path="/kategoria/:slug" element={<CategoryPage />} />
              <Route path="/artykul/:slug" element={<ArticlePage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/artykuly"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminArticles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/artykul/:articleId"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminArticleEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/kategorie"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminCategories />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Strona nie znaleziona</h1>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
