import { getTranslations, getFormatter } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { articles } from "@/app/articlesData";
import Breadcrumb from "../components/Breadcrumb";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const format = await getFormatter();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 animate-fade-in">
      <Breadcrumb items={[{ label: t("title") }]} />

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-text-primary md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-lg text-text-secondary">{t("subtitle")}</p>
      </div>

      {/* Article List */}
      <div className="space-y-6">
        {articles.map((article, i) => {
          const title = t(`articles.${i}.title` as "articles.0.title");
          const excerpt = t(`articles.${i}.excerpt` as "articles.0.excerpt");
          const author = t(`articles.${i}.author` as "articles.0.author");
          const dateStr = t(`articles.${i}.date` as "articles.0.date");
          const readTime = Number(t.raw(`articles.${i}.readTime` as "articles.0.readTime"));
          const category = t(`articles.${i}.category` as "articles.0.category");
          const date = new Date(dateStr);

          return (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="animate-fade-in-up group flex gap-6 rounded-2xl border border-border bg-bg-card p-6 md:p-8 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Cover Emoji */}
              <div className="hidden sm:flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-bg-elevated text-4xl group-hover:scale-105 transition-transform duration-300">
                {article.coverEmoji}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="rounded-full bg-accent-subtle px-3 py-0.5 text-xs font-medium text-accent">
                    {category}
                  </span>
                  <span className="text-xs text-text-muted">
                    {t("readTime", { minutes: readTime })}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {title}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-text-muted line-clamp-2">
                  {excerpt}
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs text-text-muted">
                  <span>{t("by", { author })}</span>
                  <span>·</span>
                  <span>
                    {format.dateTime(date, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
