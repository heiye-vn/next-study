import { getTranslations, getFormatter } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("site");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function HomePage() {
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const format = await getFormatter();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-accent/3 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-3xl">
            {/* Tag */}
            <div className="animate-fade-in-up stagger-1 mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg-card px-4 py-1.5 text-sm text-text-secondary">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Next.js 16 + next-intl
            </div>

            {/* Title */}
            <h1 className="animate-fade-in-up stagger-2 text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-6xl lg:text-7xl">
              {t("hero.title")}
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up stagger-3 mt-4 text-xl text-text-secondary md:text-2xl">
              {t("hero.subtitle")}
            </p>

            {/* Description */}
            <p className="animate-fade-in-up stagger-4 mt-6 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
              {t("hero.description")}
            </p>

            {/* CTA */}
            <div className="animate-fade-in-up stagger-5 mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 hover:bg-accent-hover hover:shadow-accent/30 transition-all hover:-translate-y-0.5"
              >
                {t("hero.cta")}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg-card px-6 py-3 text-sm font-semibold text-text-primary hover:bg-bg-elevated transition-all hover:-translate-y-0.5"
              >
                {tCommon("learnMore")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-bg-elevated/50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "3", label: t("stats.languages") },
              { value: "4", label: t("stats.pages") },
              { value: "5+", label: t("stats.components") },
            ].map((stat, i) => (
              <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <div className="text-3xl font-bold text-accent md:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-text-primary md:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mt-3 text-text-secondary text-lg">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {[
            { key: "routing", icon: "🧭" },
            { key: "translation", icon: "🌍" },
            { key: "formatting", icon: "🔢" },
            { key: "seo", icon: "🔍" },
          ].map((feature, i) => (
            <div
              key={feature.key}
              className="animate-fade-in-up group rounded-2xl border border-border bg-bg-card p-8 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {t(`features.${feature.key}.title` as "features.routing.title")}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">
                {t(`features.${feature.key}.description` as "features.routing.description")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ICU Demo Section */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-2xl border border-border bg-bg-card overflow-hidden">
          <div className="border-b border-border px-8 py-6">
            <h2 className="text-xl font-bold text-text-primary">
              {t("icu_demo.title")}
            </h2>
          </div>
          <div className="p-8 space-y-6">
            {/* Greeting with variable interpolation */}
            <div className="rounded-xl bg-bg-elevated p-5">
              <div className="text-xs font-medium text-accent mb-2 uppercase tracking-wider">
                Variable Interpolation
              </div>
              <p className="text-text-primary font-medium">
                {t("icu_demo.greeting", { name: "Developer" })}
              </p>
              <code className="mt-2 block text-xs text-text-muted font-mono bg-bg/50 rounded px-3 py-1.5">
                {`t("icu_demo.greeting", { name: "Developer" })`}
              </code>
            </div>

            {/* Pluralization */}
            <div className="rounded-xl bg-bg-elevated p-5">
              <div className="text-xs font-medium text-accent mb-2 uppercase tracking-wider">
                Pluralization
              </div>
              <div className="space-y-1">
                <p className="text-text-primary">{t("icu_demo.items", { count: 0 })}</p>
                <p className="text-text-primary">{t("icu_demo.items", { count: 1 })}</p>
                <p className="text-text-primary">{t("icu_demo.items", { count: 42 })}</p>
              </div>
              <code className="mt-2 block text-xs text-text-muted font-mono bg-bg/50 rounded px-3 py-1.5">
                {`{count, plural, =0 {no messages} =1 {one message} other {# messages}}`}
              </code>
            </div>

            {/* Date formatting */}
            <div className="rounded-xl bg-bg-elevated p-5">
              <div className="text-xs font-medium text-accent mb-2 uppercase tracking-wider">
                Date Formatting
              </div>
              <p className="text-text-primary font-medium">
                {t("icu_demo.lastUpdated", {
                  date: format.dateTime(new Date(), {
                    dateStyle: "long",
                  }),
                })}
              </p>
              <code className="mt-2 block text-xs text-text-muted font-mono bg-bg/50 rounded px-3 py-1.5">
                {`format.dateTime(new Date(), { dateStyle: "long" })`}
              </code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
