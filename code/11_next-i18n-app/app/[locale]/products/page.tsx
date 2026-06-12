import { getTranslations, getFormatter } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { products } from "@/app/productsData";
import Breadcrumb from "../components/Breadcrumb";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("products");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function ProductsPage() {
  const t = await getTranslations("products");
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

      {/* Product Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, i) => {
          // Get translated product data from messages
          const name = t(`list.${i}.name` as "list.0.name");
          const description = t(`list.${i}.description` as "list.0.description");
          const price = Number(t.raw(`list.${i}.price` as "list.0.price"));
          const currency = t(`list.${i}.currency` as "list.0.currency") as string;

          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="animate-fade-in-up group rounded-2xl border border-border bg-bg-card overflow-hidden hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Product Image Placeholder */}
              <div className="flex h-48 items-center justify-center bg-bg-elevated text-6xl group-hover:scale-105 transition-transform duration-500">
                {product.image}
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                  {name}
                </h3>
                <p className="mt-1.5 text-sm text-text-muted leading-relaxed line-clamp-2">
                  {description}
                </p>

                {/* Price */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-accent">
                    {format.number(price, {
                      style: "currency",
                      currency: currency,
                    })}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.inStock
                        ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {product.inStock ? t("detail.inStock") : t("detail.outOfStock")}
                  </span>
                </div>

                {/* Rating */}
                <div className="mt-3 flex items-center gap-1.5 text-sm text-text-muted">
                  <span className="text-amber-500">{"★".repeat(Math.round(product.rating))}</span>
                  <span>{product.rating}</span>
                  <span>·</span>
                  <span>{t("detail.reviewCount", { count: product.reviewCount })}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
