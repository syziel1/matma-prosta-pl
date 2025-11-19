# Przewodnik Uruchamiania Migracji w Supabase

## Status Migracji

W folderze `supabase/migrations/` znajdują się **5 plików migracji**:

1. ✅ `20251105223255_create_initial_schema.sql` - Tworzy wszystkie tabele i RLS
2. ✅ `20251105223719_seed_sample_categories.sql` - Dodaje 8 przykładowych kategorii
3. ⚠️ `20251105224000_add_user_features.sql` - Dodatkowe funkcje użytkownika
4. ⚠️ `20251106094057_add_funkcja_kwadratowa_category.sql` - Dodatkowa kategoria
5. ✅ `20251106145308_fix_security_issues.sql` - Poprawki bezpieczeństwa (NAJWAŻNIEJSZA!)

---

## Metoda 1: Przez Dashboard Supabase (ZALECANE)

### Krok 1: Zaloguj się do Supabase
1. Otwórz: https://supabase.com/dashboard
2. Zaloguj się na swoje konto
3. Wybierz projekt: **saublepgjrkcmpluxten**

### Krok 2: Otwórz SQL Editor
1. W menu bocznym kliknij **SQL Editor**
2. Kliknij **New Query**

### Krok 3: Uruchom Migracje Kolejno

#### Migracja 1: Podstawowa struktura bazy
```sql
-- Skopiuj całą zawartość pliku:
-- supabase/migrations/20251105223255_create_initial_schema.sql
```
Kliknij **RUN** i poczekaj na wykonanie.

#### Migracja 2: Przykładowe kategorie
```sql
-- Skopiuj całą zawartość pliku:
-- supabase/migrations/20251105223719_seed_sample_categories.sql
```
Kliknij **RUN**.

#### Migracja 3 (OPCJONALNA): Dodatkowe funkcje
```sql
-- Skopiuj całą zawartość pliku:
-- supabase/migrations/20251105224000_add_user_features.sql
```

#### Migracja 4 (OPCJONALNA): Dodatkowa kategoria
```sql
-- Skopiuj całą zawartość pliku:
-- supabase/migrations/20251106094057_add_funkcja_kwadratowa_category.sql
```

#### Migracja 5: POPRAWKI BEZPIECZEŃSTWA (WYMAGANA!)
```sql
-- Skopiuj całą zawartość pliku:
-- supabase/migrations/20251106145308_fix_security_issues.sql
```
**⚠️ TA MIGRACJA JEST KRYTYCZNA - MUSI BYĆ URUCHOMIONA!**

---

## Metoda 2: Przez Supabase CLI (dla zaawansowanych)

```bash
# 1. Zainstaluj Supabase CLI
npm install -g supabase

# 2. Zaloguj się
supabase login

# 3. Link projektu
supabase link --project-ref saublepgjrkcmpluxten

# 4. Uruchom migracje
supabase db push
```

---

## Weryfikacja Po Uruchomieniu

### Sprawdź czy tabele istnieją:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Powinny pojawić się:**
- ✅ article_revisions
- ✅ articles
- ✅ categories
- ✅ related_articles

### Sprawdź kategorie:

```sql
SELECT name, slug FROM categories ORDER BY display_order;
```

**Powinno być 8 kategorii:**
1. Logarytmy
2. Funkcje
3. Geometria
4. Trygonometria
5. Pewniaki Maturalne
6. Zadania na Dowodzenie
7. Pochodne
8. Całki

### Sprawdź indeksy (z migracji bezpieczeństwa):

```sql
SELECT indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('article_revisions', 'articles', 'categories', 'related_articles');
```

**Powinny być m.in.:**
- idx_article_revisions_article_id
- idx_article_revisions_author_id
- idx_articles_slug
- idx_categories_slug

### Sprawdź RLS policies:

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

**Powinno być około 15-20 policies.**

---

## Troubleshooting

### Błąd: "relation already exists"
To normalne - oznacza, że migracja już była uruchomiona. Przejdź do następnej.

### Błąd: "permission denied"
Upewnij się, że jesteś zalogowany jako właściciel projektu.

### Błąd: "syntax error"
Sprawdź czy skopiowałeś CAŁĄ zawartość pliku migracji, włącznie z komentarzami.

---

## Najważniejsze Migracje

Jeśli nie możesz uruchomić wszystkich, **KONIECZNIE uruchom te 3:**

1. **20251105223255_create_initial_schema.sql** - Podstawowa struktura
2. **20251105223719_seed_sample_categories.sql** - Dane startowe
3. **20251106145308_fix_security_issues.sql** - POPRAWKI BEZPIECZEŃSTWA

Migracje 3 i 4 są opcjonalne.

---

## Po Uruchomieniu Migracji

### 1. Utwórz pierwszego admina
1. Przejdź do Authentication → Users w dashboardzie
2. Utwórz nowego użytkownika
3. Edytuj użytkownika → App metadata
4. Dodaj:
```json
{
  "role": "admin"
}
```

### 2. Włącz ochronę hasła
1. Przejdź do Authentication → Providers → Email
2. Włącz "Protect against compromised passwords"

### 3. Test aplikacji
```bash
npm run dev
```

Otwórz http://localhost:5173 i sprawdź:
- ✅ Strona główna się ładuje
- ✅ Kategorie są widoczne
- ✅ Możesz się zarejestrować
- ✅ Admin może zalogować się i zobaczyć panel

---

## Status: Gotowe do uruchomienia!

Po wykonaniu tych kroków platforma będzie w pełni gotowa do użycia.
