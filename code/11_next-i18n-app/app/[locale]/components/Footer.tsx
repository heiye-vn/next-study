"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white text-xs font-bold">
              i
            </div>
            <span className="text-sm font-semibold text-text-primary">
              i18n<span className="text-accent">Lab</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link href="/products" className="hover:text-text-secondary transition-colors">
              Products
            </Link>
            <Link href="/blog" className="hover:text-text-secondary transition-colors">
              Blog
            </Link>
            <Link href="/about" className="hover:text-text-secondary transition-colors">
              About
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-text-muted text-center md:text-right">
            <p>{t("copyright", { year })}</p>
            <p className="mt-1 text-xs">{t("builtWith")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
