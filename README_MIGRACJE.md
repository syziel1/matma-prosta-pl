# 🚀 Jak Uruchomić Migracje w Supabase

## Szybki Start (3 kroki)

### 1️⃣ Zaloguj się do Supabase
Otwórz: **https://supabase.com/dashboard/project/saublepgjrkcmpluxten**

### 2️⃣ Otwórz SQL Editor
Kliknij **SQL Editor** w menu bocznym → **New Query**

### 3️⃣ Uruchom 3 Migracje

#### MIGRACJA 1: Struktura bazy (WYMAGANA)
Skopiuj całość z: `supabase/migrations/20251105223255_create_initial_schema.sql`
- Tworzy 4 tabele
- Dodaje 27 security policies
- Tworzy indeksy

**Kliknij RUN**

---

#### MIGRACJA 2: Przykładowe kategorie (WYMAGANA)
Skopiuj całość z: `supabase/migrations/20251105223719_seed_sample_categories.sql`
- Dodaje 8 kategorii
- Dane startowe

**Kliknij RUN**

---

#### MIGRACJA 3: Poprawki bezpieczeństwa (KRYTYCZNA!)
Skopiuj całość z: `supabase/migrations/20251106145308_fix_security_issues.sql`
- Naprawia 16 błędów bezpieczeństwa
- Optymalizuje RLS
- Dodaje brakujące indeksy

**Kliknij RUN**

---

## ✅ Weryfikacja

Po uruchomieniu wszystkich migracji, uruchom w SQL Editor:

```sql
-- Sprawdź tabele
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Powinny być: articles, article_revisions, categories, related_articles

-- Sprawdź kategorie
SELECT name FROM categories ORDER BY display_order;

-- Powinno być 8 kategorii
```

---

## 🎯 Co Dalej?

### 1. Utwórz pierwszego admina
1. Authentication → Users → Utwórz użytkownika
2. Edytuj → App metadata → Dodaj:
```json
{"role": "admin"}
```

### 2. Włącz ochronę hasła
Authentication → Providers → Email → "Protect against compromised passwords" → ON

### 3. Uruchom aplikację
```bash
npm run dev
```

Otwórz: http://localhost:5173

---

## 📁 Zawartość Migracji

| Plik | Opis | Status |
|------|------|--------|
| 20251105223255_create_initial_schema.sql | Podstawowa struktura | ✅ WYMAGANA |
| 20251105223719_seed_sample_categories.sql | 8 kategorii | ✅ WYMAGANA |
| 20251105224000_add_user_features.sql | Dodatkowe funkcje | ⚠️ Opcjonalna |
| 20251106094057_add_funkcja_kwadratowa_category.sql | Dodatkowa kategoria | ⚠️ Opcjonalna |
| 20251106145308_fix_security_issues.sql | Poprawki bezpieczeństwa | ✅ KRYTYCZNA |

---

## ❓ Pytania?

- Pełna dokumentacja: `MIGRATION_GUIDE.md`
- Szybka ściągawka: `QUICK_REFERENCE.md`
- Status projektu: `STATUS.md`

**URL projektu Supabase:**
https://supabase.com/dashboard/project/saublepgjrkcmpluxten

**Project ID:** `saublepgjrkcmpluxten`
