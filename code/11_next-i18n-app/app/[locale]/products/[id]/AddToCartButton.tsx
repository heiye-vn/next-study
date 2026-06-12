"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

export default function AddToCartButton({ inStock }: { inStock: boolean }) {
  const t = useTranslations("products.detail");
  const [added, setAdded] = useState(false);

  function handleClick() {
    if (!inStock) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={!inStock}
      className={`w-full rounded-xl px-8 py-4 text-base font-semibold transition-all cursor-pointer ${
        !inStock
          ? "bg-bg-elevated text-text-muted cursor-not-allowed"
          : added
          ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
          : "bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-hover hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-0"
      }`}
    >
      {!inStock
        ? t("outOfStock")
        : added
        ? "✓ Added!"
        : t("addToCart")}
    </button>
  );
}
