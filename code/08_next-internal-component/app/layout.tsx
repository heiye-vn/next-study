import type { Metadata } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";

// 用于正文的 Geist Sans 字体
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// 用于代码块的 Geist Mono 字体
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 用于标题的 Outfit 字体
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Next.js 内置组件演示与教程",
  description: "演示 Image, Font, Link, Script, Form 等核心内置组件的使用场景与配置说明",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">{children}</body>
    </html>
  );
}
