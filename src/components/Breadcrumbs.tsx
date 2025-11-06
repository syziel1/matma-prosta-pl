import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: Breadcrumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const location = useLocation();

  const generateBreadcrumbs = (): Breadcrumb[] => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: Breadcrumb[] = [{ label: 'Strona główna', path: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = decodeURIComponent(segment).replace(/-/g, ' ');
      const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

      if (index < pathSegments.length - 1) {
        breadcrumbs.push({ label: capitalizedLabel, path: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="bg-gray-50 border-b border-gray-200" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-600">{breadcrumb.label}</span>
              ) : (
                <Link to={breadcrumb.path} className="text-blue-600 hover:text-blue-700 transition">
                  {breadcrumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
