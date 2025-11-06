# Quick Reference Guide

## Key URLs

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Category | `/kategoria/:slug` | Public |
| Article | `/artykul/:slug` | Public |
| Search | `/szukaj?q=...` | Public |
| Login | `/login` | Public |
| Signup | `/signup` | Public |
| Admin Dashboard | `/admin` | Admin only |
| Manage Articles | `/admin/artykuly` | Admin only |
| Create/Edit Article | `/admin/artykul/:articleId` | Admin only |
| Manage Categories | `/admin/kategorie` | Admin only |

---

## Content Format for Articles

```markdown
# Main Title (H1)

Regular paragraph text here.

## Section Heading (H2)

Inline math: $x^2 + y^2 = z^2$

Block math formula:
$$
\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

### Subsection (H3)

More content...
```

---

## Admin Setup

### 1. Create Admin User
1. Sign up at `/signup`
2. In Supabase Dashboard → Authentication → Users
3. Click user → Edit User
4. Under "App metadata", add:
```json
{
  "role": "admin"
}
```
5. Log out and back in

### 2. Create Category
1. Go to `/admin` → Manage Categories
2. Click "New Category"
3. Fill in name, description, order
4. Click "Create"

### 3. Create Article
1. Go to `/admin` → New Article
2. Fill in title, category, content
3. Click "Show Preview" to see LaTeX rendering
4. Click "Publish" (or save as draft)

---

## Database Queries

### Get Published Articles
```typescript
const { data } = await supabase
  .from('articles')
  .select('*')
  .eq('status', 'published')
  .order('created_at', { ascending: false });
```

### Get Articles by Category
```typescript
const { data } = await supabase
  .from('articles')
  .select('*')
  .eq('category_id', categoryId)
  .eq('status', 'published');
```

### Search Articles
```typescript
const { data } = await supabase
  .from('articles')
  .select('*')
  .or(`title.ilike.%query%,content.ilike.%query%`)
  .eq('status', 'published');
```

---

## Common Issues & Solutions

### Issue: Admin can't access admin pages
**Solution**:
- Check app_metadata.role = 'admin' in Supabase
- Log out and back in to refresh JWT token

### Issue: LaTeX not rendering
**Solution**:
- Ensure formulas use `$` delimiters
- Block formulas need `$$\n...\n$$` on separate lines
- Check browser console for KaTeX errors

### Issue: Search is slow
**Solution**:
- Search is debounced to 300ms
- Ensure articles are published
- Check database query performance

### Issue: Articles not showing up
**Solution**:
- Verify article status is 'published'
- Check category is correct
- Ensure article_id is not null

---

## Performance Tips

1. **For Large Article Lists**
   - Use pagination (10-20 items per page)
   - Implement lazy loading
   - Cache category data

2. **For Search**
   - Debounce input (already done: 300ms)
   - Limit results to first 10
   - Show loading state

3. **For Images**
   - Optimize before upload
   - Use appropriate dimensions
   - Consider CDN for storage

---

## Security Reminders

⚠️ **Never**:
- Store passwords in code
- Commit `.env` file
- Expose API keys in client code
- Skip RLS verification

✅ **Always**:
- Use Supabase client for auth
- Verify user role before admin operations
- Check article status before displaying
- Use parameterized queries

---

## Maintenance Checklist

### Weekly
- [ ] Check slow query logs
- [ ] Monitor error rates
- [ ] Review user feedback

### Monthly
- [ ] Audit admin role assignments
- [ ] Review RLS policies
- [ ] Update dependencies

### Quarterly
- [ ] Full security audit
- [ ] Performance testing
- [ ] Backup restoration test

---

## Useful Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build
npm run typecheck     # Check TypeScript
npm run lint          # Run ESLint

# Database
# Access via Supabase Dashboard
# Authentication → Users (manage admins)
# SQL Editor (run custom queries)
# Database → Backups (restore if needed)
```

---

## API Endpoints

All data access goes through Supabase client (not REST APIs).

### Example: Fetch with Auth
```typescript
import { supabase } from './lib/supabase';

const { data, error } = await supabase
  .from('articles')
  .select('*')
  .eq('slug', slug);
```

### Example: Create with Auth
```typescript
const { error } = await supabase
  .from('articles')
  .insert([{
    title: 'My Article',
    content: '# Content',
    category_id: categoryId,
    author_id: userId,
    status: 'draft'
  }]);
```

---

## LaTeX Examples

### Inline
```
The formula $a^2 + b^2 = c^2$ shows...
```

### Fractions
```
$$
\frac{numerator}{denominator}
$$
```

### Square Root
```
$$
\sqrt{x^2 + y^2}
$$
```

### Greek Letters
```
$\alpha \beta \gamma \delta \epsilon \theta \lambda \mu$
```

### Subscripts & Superscripts
```
$x_{subscript}^{superscript}$
```

### More Complex
```
$$
\left( \sum_{i=1}^{n} x_i \right)^2 = \sum_{i=1}^{n} x_i^2 + 2 \sum_{1 \leq i < j \leq n} x_i x_j
$$
```

---

## Support Contacts

- **Documentation**: See SETUP.md and SECURITY_FIXES.md
- **Issues**: Check GitHub issues or project board
- **Questions**: Review SECURITY_AUDIT_COMPLETE.md

---

**Last Updated**: November 6, 2024
**Status**: Production Ready ✅
