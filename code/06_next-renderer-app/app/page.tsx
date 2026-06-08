import Link from 'next/link';

export default function Home() {
  const demos = [
    {
      title: "默认 / 强制不缓存",
      tag: "Dynamic Fetching",
      desc: "数据每次都从 API 实时抓取，不存在服务端 Data Cache。最适合频繁变动的热数据。",
      code: "fetch(url, { cache: 'no-store' })",
      href: "/demo-no-cache",
      colorClass: "from-amber-500 to-orange-400",
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "强制静态缓存",
      tag: "Static Fetching",
      desc: "数据永久缓存在 Data Cache 中。访问速度接近 0ms。最适合不常更新的静态资源。",
      code: "fetch(url, { cache: 'force-cache' })",
      href: "/demo-force-cache",
      colorClass: "from-blue-500 to-cyan-400",
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "基于时间的重新验证",
      tag: "Time-based Revalidation",
      desc: "设定缓存存活周期（例如 10 秒）。过期后触发 SWR（后台异步拉取新值并更新缓存）。",
      code: "fetch(url, { next: { revalidate: 10 } })",
      href: "/demo-time-revalidate",
      colorClass: "from-purple-500 to-indigo-400",
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "按需手动重新验证",
      tag: "On-demand Revalidation",
      desc: "为 fetch 绑定缓存 Tag，并在某些业务操作发生时通过 Server Action 手动将缓存失效。",
      code: "fetch(url, { next: { tags: ['time'] } })",
      href: "/demo-on-demand",
      colorClass: "from-emerald-500 to-teal-400",
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
        </svg>
      )
    },
    {
      title: "组件与函数缓存",
      tag: "React & Next Caching",
      desc: "包含单请求去重记忆（React cache）与跨请求持久化缓存（use cache 指令）。",
      code: "cache(fn) / \"use cache\"",
      href: "/demo-component-cache",
      colorClass: "from-pink-500 to-rose-400",
      icon: (
        <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 flex-1 flex flex-col gap-12">
      {/* 顶部介绍区域 */}
      <div className="text-center md:text-left space-y-4 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Next.js 16.x <span className="text-gradient">数据获取与缓存中控台</span>
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          在 React Server Components (RSC) 体系下，Next.js 对原生的 <code>fetch</code> API 进行了极具深度的工程化扩展，并提供了基于服务端的 <strong>Data Cache</strong>（数据缓存）。本演示平台采用高保真模拟网络请求，帮助您快速掌握 5 大核心数据获取与缓存机制。
        </p>
      </div>

      {/* 5 大核心演示卡片区 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demos.map((demo, idx) => (
          <div key={idx} className="glass-panel rounded-2xl p-6 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform">
                  {demo.icon}
                </div>
                <span className="text-xs font-mono font-medium text-zinc-500 tracking-wider">
                  {demo.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-zinc-200 mb-2 group-hover:text-cyan-400 transition-colors">
                {demo.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                {demo.desc}
              </p>
              <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 font-mono text-xs text-zinc-300 overflow-x-auto">
                <code>{demo.code}</code>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href={demo.href}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold btn-secondary"
              >
                <span>进入演示场景</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 矩阵对比表格 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Next.js 16 缓存与记忆机制技术矩阵对比
        </h2>
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-zinc-300 font-semibold">
                  <th className="p-4">缓存机制</th>
                  <th className="p-4">缓存配置选项 / 指令</th>
                  <th className="p-4">缓存驱逐与过期时机</th>
                  <th className="p-4">首次抓取延迟</th>
                  <th className="p-4">推荐使用场景</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-400">
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-semibold text-zinc-200">默认/强制不缓存</td>
                  <td className="p-4"><code className="bg-black/30 p-1 rounded font-mono text-amber-400 text-xs">cache: 'no-store'</code></td>
                  <td className="p-4">从不缓存，每次请求即刻过期</td>
                  <td className="p-4">取决于 API (模拟延迟 200ms+)</td>
                  <td className="p-4">账户余额、实时通知、股市行情</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-semibold text-zinc-200">强静态缓存 (Data Cache)</td>
                  <td className="p-4"><code className="bg-black/30 p-1 rounded font-mono text-cyan-400 text-xs">cache: 'force-cache'</code></td>
                  <td className="p-4">永久存活，直到手动清除或重部署</td>
                  <td className="p-4">近乎 0ms (首次除外)</td>
                  <td className="p-4">商品详情页、系统服务条款、帮助中心</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-semibold text-zinc-200">基于时间的重新验证</td>
                  <td className="p-4"><code className="bg-black/30 p-1 rounded font-mono text-purple-400 text-xs">next: &#123; revalidate: 10 &#125;</code></td>
                  <td className="p-4">过期后首次访问返回旧值，后台静默重刷 (SWR)</td>
                  <td className="p-4">0ms (过期后首次除外)</td>
                  <td className="p-4">热门商品排行、博客文章列表、天气情况</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-semibold text-zinc-200">按需手动重新验证</td>
                  <td className="p-4"><code className="bg-black/30 p-1 rounded font-mono text-emerald-400 text-xs">next: &#123; tags: ['time'] &#125;</code></td>
                  <td className="p-4">当执行 Server Action 等触发清除时</td>
                  <td className="p-4">近乎 0ms (清除后首次除外)</td>
                  <td className="p-4">内容管理系统 (CMS)、编辑更新数据</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

