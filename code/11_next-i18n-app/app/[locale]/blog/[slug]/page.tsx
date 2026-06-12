import { getTranslations, getFormatter } from "next-intl/server";
import { notFound } from "next/navigation";
import { articles } from "@/app/articlesData";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "../../components/Breadcrumb";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Not Found" };

  const t = await getTranslations("blog");
  const idx = articles.indexOf(article);
  const title = t(`articles.${idx}.title` as "articles.0.title");
  return { title };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const t = await getTranslations("blog");
  const format = await getFormatter();
  const idx = articles.indexOf(article);

  const title = t(`articles.${idx}.title` as "articles.0.title");
  const excerpt = t(`articles.${idx}.excerpt` as "articles.0.excerpt");
  const author = t(`articles.${idx}.author` as "articles.0.author");
  const dateStr = t(`articles.${idx}.date` as "articles.0.date");
  const readTime = Number(t.raw(`articles.${idx}.readTime` as "articles.0.readTime"));
  const category = t(`articles.${idx}.category` as "articles.0.category");
  const date = new Date(dateStr);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 animate-fade-in">
      <Breadcrumb
        items={[
          { label: t("title"), href: "/blog" },
          { label: title },
        ]}
      />

      {/* Article Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="rounded-full bg-accent-subtle px-3 py-1 text-sm font-medium text-accent">
            {category}
          </span>
          <span className="text-sm text-text-muted">
            {t("readTime", { minutes: readTime })}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-text-primary leading-tight md:text-4xl">
          {title}
        </h1>

        <p className="mt-4 text-lg text-text-secondary leading-relaxed">
          {excerpt}
        </p>

        <div className="mt-6 flex items-center gap-4 pb-6 border-b border-border">
          {/* Author avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white text-sm font-bold">
            {author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{author}</p>
            <p className="text-xs text-text-muted">
              {format.dateTime(date, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Article Body */}
      <article className="prose-custom">
        {article.content.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            className="mb-6 text-base leading-[1.8] text-text-secondary"
          >
            {paragraph.trim()}
          </p>
        ))}
      </article>

      {/* Back link */}
      <div className="mt-12 pt-8 border-t border-border">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Blog
        </Link>
      </div>
    </div>
  );
}
