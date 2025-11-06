/*
  # Seed sample categories for Matma-Prosta.pl

  1. Insert sample categories
    - Logarytmy
    - Funkcje
    - Geometria
    - Trygonometria
    - Pewniaki Maturalne
    - Zadania na Dowodzenie
    - Pochodne
    - Całki

  2. Purpose
    - Provide initial categories for demonstration
    - Help users see the platform structure
*/

INSERT INTO categories (name, slug, description, display_order)
VALUES
  ('Logarytmy', 'logarytmy', 'Wszystko o logarytmach - od podstaw do zaawansowanych tematów. Naucz się czym są logarytmy i jak ich używać.', 1),
  ('Funkcje', 'funkcje', 'Funkcje liniowe, kwadratowe, wymierne i inne. Poznaj własności funkcji i jak je rysować.', 2),
  ('Geometria', 'geometria', 'Geometria analityczna, przestrzenna i planimetria. Rozwiąż trudne zadania geometryczne.', 3),
  ('Trygonometria', 'trygonometria', 'Funkcje trygonometryczne, równania i nierówności. Opanuj sinus, cosinus i tangens.', 4),
  ('Pewniaki Maturalne', 'pewniaki-maturalne', 'Podstawowe zadania, które warto znać przed maturą. Powtórka najważniejszych zagadnień.', 5),
  ('Zadania na Dowodzenie', 'zadania-na-dowodzenie', 'Strategie dowodzenia, indukcja matematyczna i logika. Naucz się pisać ścisłe dowody.', 6),
  ('Pochodne', 'pochodne', 'Rachunek różniczkowy - pochodne funkcji, interpretacja geometryczna i zastosowania.', 7),
  ('Całki', 'calki', 'Rachunek całkowy - całki nieoznaczone i oznaczone, zastosowania w praktyce.', 8)
ON CONFLICT (slug) DO NOTHING;