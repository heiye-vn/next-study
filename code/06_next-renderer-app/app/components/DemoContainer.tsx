import Link from 'next/link';
import RefreshButton from './RefreshButton';

interface DemoContainerProps {
  title: string;
  cacheStrategy: string;
  data: {
    timestamp: string;
    uuid: string;
    quote: string;
    fetchedAt: string;
    latencyMs: number;
  };
  durationMs: number;
  explanation: React.ReactNode;
  extraActions?: React.ReactNode;
}

export default function DemoContainer({
  title,
  cacheStrategy,
  data,
  durationMs,
  explanation,
  extraActions,
}: DemoContainerProps) {
  // 根据实际网络请求时长与 API 内部耗时的比例粗略判断是否命中缓存
  // 缓存命中时，Next.js fetch 不需要向我们的 API 路由发起请求，耗时通常接近 0ms
  // 未命中时，耗时通常包含 API 模拟延迟 (200~500ms)，此时耗时 > 100ms
  const isCacheHit = durationMs < 80;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* 顶部面包屑 */}
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <Link
          href="/"
          className="transition-colors hover:text-cyan-400"
        >
          仪表盘首页
        </Link>
        <span>/</span>
        <span className="font-medium text-zinc-200">{title}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* 左侧：数据展示与状态 */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="glass-panel relative overflow-hidden rounded-2xl p-6">
            {/* 缓存状态高亮挂件 */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wider ${
                  isCacheHit
                    ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                    : 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
                }`}
              >
                {isCacheHit ? 'HIT (缓存命中)' : 'MISS (未命中/动态获取)'}
              </span>
            </div>

            <h2 className="mb-2 text-xl font-semibold">{title}</h2>
            <p className="mb-6 overflow-x-auto rounded-lg border border-white/5 bg-black/30 p-2.5 font-mono text-xs text-zinc-400">
              {cacheStrategy}
            </p>

            <div className="space-y-4">
              {/* 高亮大字展示时间戳 */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-6">
                <span className="mb-1 text-xs tracking-wider text-zinc-400 uppercase">
                  服务端数据获取时间
                </span>
                <span className="text-gradient font-mono text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {data.timestamp}
                </span>
              </div>

              {/* 详细指标 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="mb-1 text-xs text-zinc-400">本次抓取耗时</div>
                  <div className="font-mono text-lg font-bold text-zinc-200">
                    {durationMs} <span className="text-xs font-normal text-zinc-400">ms</span>
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {isCacheHit
                      ? '数据直接从 Next.js 缓存中读取'
                      : `包含模拟的网络延迟 ${data.latencyMs}ms`}
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="mb-1 text-xs text-zinc-400">请求唯一标识 (UUID)</div>
                  <div
                    className="truncate font-mono text-sm font-bold text-zinc-300"
                    title={data.uuid}
                  >
                    {data.uuid}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">若命中缓存，UUID 将保持不变</div>
                </div>
              </div>

              {/* 随机名言 */}
              <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/5 p-4">
                <div className="mb-1 text-xs font-semibold text-cyan-400">
                  随机技术名言 (API 返回)
                </div>
                <p className="font-mono text-sm leading-relaxed text-zinc-300 italic">
                  "{data.quote}"
                </p>
              </div>

              {/* API 抓取时间 */}
              <div className="text-right text-xs text-zinc-500">
                API 数据生成时间: {new Date(data.fetchedAt).toLocaleString('zh-CN')}
              </div>
            </div>

            {/* 交互按钮 */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
              <RefreshButton />
              {extraActions}
            </div>
          </div>
        </div>

        {/* 右侧：原理剖析与文字说明 */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-2xl bg-linear-to-b from-zinc-900/40 to-black/20 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-cyan-400">
              <svg
                className="h-5 w-5 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              原理解析
            </h3>
            <div className="space-y-4 text-sm leading-relaxed text-zinc-300">{explanation}</div>
          </div>

          <div className="glass-panel rounded-2xl border border-cyan-500/20 bg-cyan-950/10 p-6">
            <h4 className="mb-2 text-sm font-semibold text-cyan-300">💡 架构提示</h4>
            <p className="text-xs leading-relaxed text-zinc-400">
              当前页面属于 **Server Component (服务端组件)**。所有的 `fetch`
              请求都是在服务器端被拦截并解析的，因此浏览器与 API
              路由之间没有直接的数据交互，极大地提升了系统的安全性和首屏渲染效率。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
