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
  extraActions
}: DemoContainerProps) {
  // 根据实际网络请求时长与 API 内部耗时的比例粗略判断是否命中缓存
  // 缓存命中时，Next.js fetch 不需要向我们的 API 路由发起请求，耗时通常接近 0ms
  // 未命中时，耗时通常包含 API 模拟延迟 (200~500ms)，此时耗时 > 100ms
  const isCacheHit = durationMs < 80;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* 顶部面包屑 */}
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <Link href="/" className="hover:text-cyan-400 transition-colors">仪表盘首页</Link>
        <span>/</span>
        <span className="text-zinc-200 font-medium">{title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：数据展示与状态 */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            {/* 缓存状态高亮挂件 */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider ${
                isCacheHit 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {isCacheHit ? 'HIT (缓存命中)' : 'MISS (未命中/动态获取)'}
              </span>
            </div>

            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-xs text-zinc-400 mb-6 font-mono bg-black/30 p-2.5 rounded-lg border border-white/5 overflow-x-auto">
              {cacheStrategy}
            </p>

            <div className="space-y-4">
              {/* 高亮大字展示时间戳 */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
                <span className="text-xs text-zinc-400 mb-1 tracking-wider uppercase">服务端数据获取时间</span>
                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-gradient">
                  {data.timestamp}
                </span>
              </div>

              {/* 详细指标 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-zinc-400 mb-1">本次抓取耗时</div>
                  <div className="text-lg font-bold font-mono text-zinc-200">
                    {durationMs} <span className="text-xs text-zinc-400 font-normal">ms</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {isCacheHit ? '数据直接从 Next.js 缓存中读取' : `包含模拟的网络延迟 ${data.latencyMs}ms`}
                  </div>
                </div>

                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <div className="text-xs text-zinc-400 mb-1">请求唯一标识 (UUID)</div>
                  <div className="text-sm font-bold font-mono text-zinc-300 truncate" title={data.uuid}>
                    {data.uuid}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">若命中缓存，UUID 将保持不变</div>
                </div>
              </div>

              {/* 随机名言 */}
              <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4">
                <div className="text-xs text-cyan-400 mb-1 font-semibold">随机技术名言 (API 返回)</div>
                <p className="text-sm text-zinc-300 italic font-mono leading-relaxed">"{data.quote}"</p>
              </div>

              {/* API 抓取时间 */}
              <div className="text-xs text-zinc-500 text-right">
                API 数据生成时间: {new Date(data.fetchedAt).toLocaleString('zh-CN')}
              </div>
            </div>

            {/* 交互按钮 */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
              <RefreshButton />
              {extraActions}
            </div>
          </div>
        </div>

        {/* 右侧：原理剖析与文字说明 */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 bg-gradient-to-b from-zinc-900/40 to-black/20">
            <h3 className="text-lg font-semibold mb-4 text-cyan-400 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              原理解析
            </h3>
            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
              {explanation}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 bg-cyan-950/10">
            <h4 className="text-sm font-semibold text-cyan-300 mb-2">💡 架构提示</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              当前页面属于 **Server Component (服务端组件)**。所有的 `fetch` 请求都是在服务器端被拦截并解析的，因此浏览器与 API 路由之间没有直接的数据交互，极大地提升了系统的安全性和首屏渲染效率。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
