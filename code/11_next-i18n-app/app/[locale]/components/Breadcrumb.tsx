"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const t = useTranslations("breadcrumb");

  return (
    <nav className="mb-8 flex items-center gap-2 text-sm" aria-label="Breadcrumb">
      <Link
        href="/"
        className="text-text-muted hover:text-accent transition-colors"
      >
        {t("home")}
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <svg className="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          {item.href ? (
            <Link
              href={item.href}
              className="text-text-muted hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-text-secondary font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
