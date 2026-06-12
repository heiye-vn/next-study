export interface Article {
  slug: string;
  coverEmoji: string;
  content: string;
}

export const articles: Article[] = [
  {
    slug: "getting-started-next-intl",
    coverEmoji: "🚀",
    content: `
      Next-intl is one of the most popular internationalization libraries for Next.js App Router.
      It provides a complete solution for routing, translation management, and localized formatting.

      In this guide, we'll walk through the complete setup process, from installation to deployment.
      You'll learn how to organize your translation files, configure locale-based routing, and
      implement both server-side and client-side translations.

      The key concepts include: dynamic route segments for locale prefixes, the middleware/proxy
      pattern for automatic language detection, and the NextIntlClientProvider for seamless
      client-side integration.
    `,
  },
  {
    slug: "icu-message-syntax",
    coverEmoji: "📝",
    content: `
      ICU Message Syntax is a powerful standard for defining translatable messages with dynamic
      content. It goes far beyond simple string interpolation, supporting plural rules, gender
      selection, number formatting, and nested expressions.

      The plural category system is particularly important for internationalization. Different
      languages have different plural rules - for example, Arabic has six plural forms while
      Chinese and Japanese have only one. ICU syntax handles all of these automatically.

      Key features include: variable interpolation with {name}, plural rules with
      {count, plural, ...}, select expressions for gender/choice, and number/date formatting
      with {price, number, currency}.
    `,
  },
  {
    slug: "seo-multilingual",
    coverEmoji: "🌐",
    content: `
      Search engine optimization for multilingual websites requires careful attention to
      technical details. The hreflang attribute tells search engines which language version
      of a page to show to users in different regions.

      Beyond hreflang, you need to consider: unique URLs for each language version, proper
      canonical tags, language-specific sitemaps, and localized structured data (JSON-LD).
      Each language version should be treated as a separate page by search engines.

      Next-intl makes this easier by providing utilities for generating alternate links,
      locale-aware metadata, and automatic language detection that aligns with SEO best practices.
    `,
  },
];
