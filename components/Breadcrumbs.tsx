import Link from "next/link";

export type BreadcrumbItem = { label: string; href?: string };

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const normalized = items.filter((item) => item.label && item.label.trim().length > 0);
  if (normalized.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-4 mb-4">
      <ol
        className="flex items-center text-sm overflow-x-auto whitespace-nowrap scrollbar-hide"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {normalized.map((item, index) => {
          const isLast = index === normalized.length - 1;
          const content = item.href && !isLast ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-red-600 transition-colors"
              itemProp="item"
            >
              <span itemProp="name">{item.label}</span>
            </Link>
          ) : (
            <span className="text-gray-800 font-medium" itemProp="name">
              {item.label}
            </span>
          );

          return (
            <li
              key={`${item.label}-${index}`}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {content}
              <meta itemProp="position" content={`${index + 1}`} />
              {!isLast ? <span className="mx-2 text-gray-400">/</span> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

