import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-white mb-4">O Matma-Prosta</h3>
            <p className="text-sm leading-relaxed">
              Platforma edukacyjna pomagająca uczniom zrozumieć matematykę krok po kroku. Przygotuj się do matury bez stresu.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Szybkie Linki</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition">Strona główna</Link></li>
              <li><Link to="/kategorie" className="hover:text-white transition">Kategorie</Link></li>
              <li><Link to="/szukaj" className="hover:text-white transition">Szukaj</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Informacje Prawne</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Polityka Prywatności</a></li>
              <li><a href="#" className="hover:text-white transition">Warunki Użytkowania</a></li>
              <li><a href="#" className="hover:text-white transition">Kontakt</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; 2024 Matma-Prosta. Wszystkie prawa zastrzeżone.</p>
          <p className="text-sm text-gray-400 mt-4 md:mt-0">
            Stworzone z <span className="text-red-500">❤</span> dla uczniów
          </p>
        </div>
      </div>
    </footer>
  );
}
