/*
  # Add "Funkcja kwadratowa" category

  1. Purpose
    - Add new category for quadratic functions
    - Provide specialized content area for this important topic
    
  2. Changes
    - Insert new category with appropriate description and display order
*/

INSERT INTO categories (name, slug, description, display_order)
VALUES
  ('Funkcja kwadratowa', 'funkcja-kwadratowa', 'Funkcje kwadratowe - wzory, wykres paraboli, postać kanoniczna i iloczynowa. Rozwiązywanie równań kwadratowych i analiza własności funkcji.', 9)
ON CONFLICT (slug) DO NOTHING;
