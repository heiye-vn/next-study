import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js 16.x 数据获取与缓存管理演示",
  description: "深入学习并演示 Next.js 16 (基于 React 19) 的 Data Fetching, Caching 与 Revalidation 机制",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080b11] text-zinc-100">
        {/* 全局毛玻璃导航栏 */}
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform">
                N
              </div>
              <span className="font-bold tracking-tight text-lg group-hover:text-cyan-400 transition-colors">
                Next.js <span className="text-xs font-mono text-zinc-500 font-normal">v16.2</span>
              </span>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm">
              <Link href="/" className="text-zinc-300 hover:text-cyan-400 transition-colors">仪表盘</Link>
              <Link href="/demo-no-cache" className="text-zinc-400 hover:text-cyan-400 transition-colors">不缓存</Link>
              <Link href="/demo-force-cache" className="text-zinc-400 hover:text-cyan-400 transition-colors">静态缓存</Link>
              <Link href="/demo-time-revalidate" className="text-zinc-400 hover:text-cyan-400 transition-colors">时间验证</Link>
              <Link href="/demo-on-demand" className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all font-medium">
                按需验证
              </Link>
            </nav>
          </div>
        </header>

        {/* 主内容区域 */}
        <main className="flex-1 flex flex-col justify-start">
          {children}
        </main>

        {/* 底部信息 */}
        <footer className="border-t border-white/5 bg-black/20 py-6 text-center text-xs text-zinc-500">
          <p>© 2026 Next.js 16.x 缓存与重新验证系统. Designed with premium aesthetics.</p>
        </footer>
      </body>
    </html>
  );
}
