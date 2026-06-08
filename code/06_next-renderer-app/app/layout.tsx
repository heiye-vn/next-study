import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Next.js 16.x 数据获取与缓存管理演示',
  description:
    '深入学习并演示 Next.js 16 (基于 React 19) 的 Data Fetching, Caching 与 Revalidation 机制',
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
      <body className="flex min-h-full flex-col bg-[#080b11] text-zinc-100">
        {/* 全局毛玻璃导航栏 */}
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/60 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link
              href="/"
              className="group flex items-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-blue-600 to-cyan-400 font-bold text-white shadow-lg transition-transform group-hover:scale-105">
                N
              </div>
              <span className="text-lg font-bold tracking-tight transition-colors group-hover:text-cyan-400">
                Next.js <span className="font-mono text-xs font-normal text-zinc-500">v16.2</span>
              </span>
            </Link>

            <nav className="flex items-center gap-2 text-xs sm:gap-4 sm:text-sm md:gap-6">
              <Link
                href="/"
                className="text-zinc-300 transition-colors hover:text-cyan-400"
              >
                仪表盘
              </Link>
              <Link
                href="/demo-no-cache"
                className="text-zinc-400 transition-colors hover:text-cyan-400"
              >
                不缓存
              </Link>
              <Link
                href="/demo-force-cache"
                className="text-zinc-400 transition-colors hover:text-cyan-400"
              >
                静态缓存
              </Link>
              <Link
                href="/demo-time-revalidate"
                className="text-zinc-400 transition-colors hover:text-cyan-400"
              >
                时间验证
              </Link>
              <Link
                href="/demo-on-demand"
                className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-cyan-400 transition-all hover:border-cyan-500/40 hover:bg-cyan-500/20"
              >
                按需验证
              </Link>
            </nav>
          </div>
        </header>

        {/* 主内容区域 */}
        <main className="flex flex-1 flex-col justify-start">{children}</main>

        {/* 底部信息 */}
        <footer className="border-t border-white/5 bg-black/20 py-6 text-center text-xs text-zinc-500">
          <p>© 2026 Next.js 16.x 缓存与重新验证系统. Designed with premium aesthetics.</p>
        </footer>
      </body>
    </html>
  );
}
