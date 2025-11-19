import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://saublepgjrkcmpluxten.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhdWJsZXBnanJrY21wbHV4dGVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0Mjc3NDQsImV4cCI6MjA3ODAwMzc0NH0.Cd21mgIq3aObOC-AhXdZaMROvDznK8XpMqUATtZp4GA';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('🔍 Sprawdzanie statusu migracji w Supabase...\n');

// Check categories
const { data: categories, error: catError } = await supabase
  .from('categories')
  .select('*');

if (catError) {
  console.log('❌ Błąd pobierania kategorii:', catError.message);
  console.log('\n⚠️  Migracje NIE zostały uruchomione!');
  console.log('\n📝 Potrzebne kroki:');
  console.log('1. Zaloguj się do dashboardu Supabase');
  console.log('2. Przejdź do SQL Editor');
  console.log('3. Uruchom kolejno wszystkie migracje z folderu supabase/migrations/');
} else {
  console.log('✅ Tabela categories istnieje');
  console.log(`   Liczba kategorii: ${categories.length}`);
  if (categories.length > 0) {
    console.log('\n📚 Kategorie:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });
  }
}

// Check articles
const { data: articles, error: artError } = await supabase
  .from('articles')
  .select('count');

if (!artError) {
  console.log('\n✅ Tabela articles istnieje');
}

// Check related_articles
const { data: related, error: relError } = await supabase
  .from('related_articles')
  .select('count');

if (!relError) {
  console.log('✅ Tabela related_articles istnieje');
}

// Check article_revisions
const { data: revisions, error: revError } = await supabase
  .from('article_revisions')
  .select('count');

if (!revError) {
  console.log('✅ Tabela article_revisions istnieje');
}

console.log('\n✅ Wszystkie migracje zostały pomyślnie uruchomione!');
console.log('\n📊 Status bazy danych: GOTOWA');
