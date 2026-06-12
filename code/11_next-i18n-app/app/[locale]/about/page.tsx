import { getTranslations } from "next-intl/server";
import Breadcrumb from "../components/Breadcrumb";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 animate-fade-in">
      <Breadcrumb items={[{ label: t("title") }]} />

      {/* Header */}
      <div className="mb-16 max-w-2xl">
        <h1 className="text-3xl font-bold text-text-primary md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-xl text-text-secondary leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Mission */}
      <section className="mb-20">
        <div className="rounded-2xl border border-border bg-bg-card p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-accent/5 blur-2xl -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            {t("mission.title")}
          </h2>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
            {t("mission.description")}
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-text-primary mb-8">
          {t("team.title")}
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[0, 1, 2].map((i) => {
            const name = t(`team.members.${i}.name` as "team.members.0.name");
            const role = t(`team.members.${i}.role` as "team.members.0.role");
            const bio = t(`team.members.${i}.bio` as "team.members.0.bio");

            return (
              <div
                key={i}
                className="animate-fade-in-up rounded-2xl border border-border bg-bg-card p-6 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 text-center"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Avatar placeholder */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-subtle text-accent text-xl font-bold mb-4">
                  {name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-text-primary">{name}</h3>
                <p className="text-sm text-accent font-medium mt-1">{role}</p>
                <p className="mt-3 text-sm text-text-muted leading-relaxed">{bio}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold text-text-primary mb-8">
          {t("stats.title")}
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { value: "28", label: t("stats.contributors") },
            { value: "486", label: t("stats.commits") },
            { value: "2.4k", label: t("stats.stars") },
          ].map((stat, i) => (
            <div
              key={i}
              className="animate-fade-in-up rounded-2xl border border-border bg-bg-card p-6 text-center hover:border-accent/30 transition-colors"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="text-3xl font-bold text-accent md:text-4xl">{stat.value}</div>
              <div className="mt-2 text-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text-primary mb-8">
          {t("contact.title")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              key: "email",
              icon: (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              ),
              value: "hello@i18nlab.dev",
            },
            {
              key: "github",
              icon: (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              ),
              value: "github.com/i18n-lab",
            },
            {
              key: "twitter",
              icon: (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              ),
              value: "@i18nlab",
            },
          ].map((item) => (
            <a
              key={item.key}
              href="#"
              className="flex items-center gap-4 rounded-xl border border-border bg-bg-card p-5 hover:border-accent/30 hover:shadow-md hover:shadow-accent/5 transition-all duration-300 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-subtle text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider">
                  {t(`contact.${item.key}` as "contact.email")}
                </p>
                <p className="text-sm font-medium text-text-primary mt-0.5">{item.value}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
