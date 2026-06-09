import Link from 'next/link';
import Image from 'next/image';

// Next.js 15+ 中 searchParams 是一个 Promise，需要使用 async/await 异步读取
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query || '';

  // 模拟一些搜索数据
  const mockArticles = [
    { id: 1, title: '深度剖析 Next.js 图像优化核心原理', category: 'Next.js', date: '2026-06-01' },
    {
      id: 2,
      title: 'React 19 全新特性及 Server Component 实践',
      category: 'React',
      date: '2026-05-28',
    },
    {
      id: 3,
      title: 'Tailwind CSS v4 现代开发环境搭建与主题定制',
      category: 'Tailwind',
      date: '2026-05-15',
    },
    {
      id: 4,
      title: '第三方脚本对页面首次可交互时间 (TTI) 的影响分析',
      category: 'Performance',
      date: '2026-05-10',
    },
  ];

  // 过滤数据
  const filteredArticles = query
    ? mockArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.category.toLowerCase().includes(query.toLowerCase())
      )
    : mockArticles;

  return (
    <div className="bg-grid scanline-overlay relative min-h-screen overflow-hidden bg-zinc-50 pb-24 font-sans transition-colors duration-300 dark:bg-zinc-950">
      {/* 科技蓝/紫/绿背光氛围 */}
      <div className="pointer-events-none absolute -top-40 -right-40 -z-10 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.06)_0%,transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(168,85,247,0.03)_0%,transparent_70%)]" />

      {/* 头部导航 */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 bg-white/70 backdrop-blur-md transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-950/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center rounded border border-zinc-200/80 bg-white p-1.5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={72}
                height={15}
                className="dark:invert"
                priority
              />
            </div>
            <span className="rounded border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-purple-600 uppercase dark:text-purple-400">
              SYS.V16_LAB
            </span>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs font-bold tracking-wider text-purple-600 uppercase transition-colors hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
          >
            ← [ BACK_TO_DASHBOARD ]
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pt-16">
        <div className="relative mb-12 border-l-2 border-purple-500/60 pb-4 pl-6 sm:pl-8">
          <div className="absolute top-0 -left-1.25 h-2 w-2 rounded-full bg-purple-500" />
          <div className="mb-2 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
            [ QUERY EXECUTION SUCCESSFUL ]
          </div>

          <h1 className="font-title text-3xl leading-tight font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            检索结果 (Retrieved Logs)
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
            <span>DATABASE_FILTER_PARAMETER:</span>
            <span className="led-glow-purple inline-flex items-center rounded border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 text-[11px] font-bold text-purple-700 dark:text-purple-400">
              query = &quot;{query}&quot;
            </span>
          </p>
        </div>

        {/* 搜索结果列表 */}
        <div className="space-y-6">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <article
                key={article.id}
                className="lab-panel lab-corners group rounded border border-zinc-200/80 bg-white/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/30 hover:bg-white dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:bg-zinc-900/60"
              >
                {/* 装饰卡角标ID */}
                <div className="absolute top-0 right-0 p-1 font-mono text-[7px] text-zinc-400/50 select-none">
                  [ LOG_ID // 0{article.id} ]
                </div>

                <div className="mb-3 flex items-center justify-between border-b border-zinc-200/30 pb-2 dark:border-zinc-800/20">
                  <span className="rounded border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider text-purple-700 uppercase dark:text-purple-400">
                    TAG // {article.category}
                  </span>
                  <time className="font-mono text-[10px] text-zinc-400">{article.date}</time>
                </div>
                <h3 className="font-title text-lg font-bold text-zinc-900 transition-colors duration-200 group-hover:text-purple-600 dark:text-zinc-100 dark:group-hover:text-purple-400">
                  {article.title}
                </h3>
                <p className="mt-2.5 font-sans text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  这是一篇使用 Next.js 内置组件（如 Image、Font、Link 等）进行性能和 SEO
                  优化，并部署于 Vercel 服务器的实际开发教程与博文，包含代码范例和开发细节说明。
                </p>
              </article>
            ))
          ) : (
            <div className="lab-panel lab-corners rounded border border-dashed border-zinc-300 bg-white/40 py-20 text-center dark:border-zinc-800 dark:bg-zinc-900/20">
              <div className="relative mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full border border-dashed border-purple-500/30 bg-purple-500/5">
                <span className="animate-bounce text-3xl">📡</span>
                <span className="absolute inset-0 animate-ping rounded-full border border-purple-500/10" />
              </div>
              <h3 className="font-mono text-xs font-bold tracking-wider text-zinc-900 uppercase dark:text-zinc-200">
                [ SIGNALS_LOST // 未找到相关记录 ]
              </h3>
              <p className="mx-auto mt-2 max-w-xs font-sans text-xs leading-relaxed text-zinc-400">
                未检索到匹配数据。请尝试更换搜索关键字，例如键入 &quot;React&quot; 或
                &quot;Tailwind&quot;。
              </p>
              <div className="mt-8">
                <Link
                  href="/"
                  className="cursor-pointer rounded border border-purple-600 bg-purple-600/90 px-5 py-3 font-mono text-xs font-bold tracking-wider text-white shadow transition-colors hover:bg-purple-600"
                >
                  REBOOT_SEARCH [重新检索]
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
