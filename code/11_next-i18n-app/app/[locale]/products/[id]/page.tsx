import { getTranslations, getFormatter } from "next-intl/server";
import { notFound } from "next/navigation";
import { products } from "@/app/productsData";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "../../components/Breadcrumb";
import AddToCartButton from "./AddToCartButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return { title: "Not Found" };

  const t = await getTranslations("products");
  const idx = products.indexOf(product);
  const name = t(`list.${idx}.name` as "list.0.name");
  return { title: name };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  const t = await getTranslations("products");
  const format = await getFormatter();
  const idx = products.indexOf(product);

  const name = t(`list.${idx}.name` as "list.0.name");
  const description = t(`list.${idx}.description` as "list.0.description");
  const price = Number(t.raw(`list.${idx}.price` as "list.0.price"));
  const currency = t(`list.${idx}.currency` as "list.0.currency") as string;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 animate-fade-in">
      <Breadcrumb
        items={[
          { label: t("title"), href: "/products" },
          { label: name },
        ]}
      />

      <div className="grid gap-10 md:grid-cols-2">
        {/* Product Image */}
        <div className="flex items-center justify-center rounded-2xl bg-bg-elevated border border-border p-12 min-h-[400px]">
          <span className="text-[120px] leading-none">{product.image}</span>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary">{name}</h1>
          <p className="mt-3 text-lg text-text-secondary leading-relaxed">{description}</p>

          {/* Price & Stock */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-accent">
              {format.number(price, { style: "currency", currency })}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                product.inStock
                  ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {product.inStock ? t("detail.inStock") : t("detail.outOfStock")}
            </span>
          </div>

          {/* Rating */}
          <div className="mt-4 flex items-center gap-2 text-sm text-text-muted">
            <span className="text-amber-500 text-lg">{"★".repeat(Math.round(product.rating))}</span>
            <span>{t("detail.rating", { rating: product.rating })}</span>
            <span>·</span>
            <span>{t("detail.reviewCount", { count: product.reviewCount })}</span>
          </div>

          {/* Add to Cart - Client Component */}
          <div className="mt-8">
            <AddToCartButton inStock={product.inStock} />
          </div>

          {/* Specs */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-text-primary mb-4">{t("detail.specs")}</h2>
            <div className="rounded-xl border border-border overflow-hidden">
              {Object.entries(product.specs).map(([key, value], i) => (
                <div
                  key={key}
                  className={`flex items-center justify-between px-5 py-3 text-sm ${
                    i > 0 ? "border-t border-border" : ""
                  } ${i % 2 === 0 ? "bg-bg-elevated/50" : ""}`}
                >
                  <span className="text-text-muted capitalize">{key}</span>
                  <span className="font-medium text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-text-primary mb-4">{t("detail.features")}</h2>
            <div className="flex flex-wrap gap-2">
              {product.features.map((feature) => (
                <span
                  key={feature}
                  className="rounded-lg bg-accent-subtle px-3 py-1.5 text-sm font-medium text-accent border border-accent/10"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="mt-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Products
        </Link>
      </div>
    </div>
  );
}
