import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { FileCode2 } from "lucide-react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.js 表单演示",
  description: "五种表单使用模式的渐进式演示",
};

const navItems = [
  { href: "/traditional", label: "传统表单", num: "01" },
  { href: "/rhf", label: "React Hook Form", num: "02" },
  { href: "/rhf-zod", label: "RHF + Zod", num: "03" },
  { href: "/rhf-zod-server", label: "+ Server Actions", num: "04" },
  { href: "/rhf-zod-shadcn", label: "+ Shadcn UI", num: "05" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                  <FileCode2 className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold tracking-tight">
                  Next.js Form Demo
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <nav className="hidden md:flex items-center gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <span className="text-[10px] font-mono text-primary/60">
                        {item.num}
                      </span>
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <nav className="flex md:hidden items-center gap-1">
                  <Link
                    href="/"
                    className="rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary"
                  >
                    首页
                  </Link>
                </nav>
                <div className="ml-2 border-l border-border/60 pl-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-border/60 bg-background">
            <div className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-muted-foreground">
              Next.js 表单模式演示 — 从传统表单到全栈表单的渐进式探索
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
