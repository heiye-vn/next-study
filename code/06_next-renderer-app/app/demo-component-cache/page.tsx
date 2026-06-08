import { cache } from 'react';
import { cacheLife } from 'next/cache';
import Link from 'next/link';
import RefreshButton from '../components/RefreshButton';

// ============================================================================
// 1. React cache() - Request Memoization (请求记忆化)
// ============================================================================
const getMemoizedValue = cache(async (id: string) => {
  // 控制台日志只会在首次真正执行时打印，复用时不打印
  console.log(`[REACT CACHE] getMemoizedValue 执行，参数 ID: ${id}`);
  await new Promise((resolve) => setTimeout(resolve, 50));
  const now = new Date();
  return {
    random: Math.random().toString(36).substring(7).toUpperCase(),
    timestamp: now.toLocaleTimeString('zh-CN', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0')
  };
});

async function getNormalValue(id: string) {
  // 普通异步调用，每次执行都会打印
  console.log(`[NORMAL] getNormalValue 执行，参数 ID: ${id}`);
  await new Promise((resolve) => setTimeout(resolve, 50));
  const now = new Date();
  return {
    random: Math.random().toString(36).substring(7).toUpperCase(),
    timestamp: now.toLocaleTimeString('zh-CN', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0')
  };
}

// 子组件渲染
async function MemoizedChild({ group }: { group: string }) {
  const data = await getMemoizedValue(group);
  return (
    <div className="bg-cyan-950/20 border border-cyan-500/10 rounded-xl p-4 text-center">
      <div className="text-xs text-zinc-500 mb-1">子组件 A (记忆化)</div>
      <div className="font-mono text-sm text-cyan-400 font-bold tracking-wider">{data.random}</div>
      <div className="font-mono text-[10px] text-zinc-400 mt-1">{data.timestamp}</div>
    </div>
  );
}

async function NormalChild({ group }: { group: string }) {
  const data = await getNormalValue(group);
  return (
    <div className="bg-amber-950/20 border border-amber-500/10 rounded-xl p-4 text-center">
      <div className="text-xs text-zinc-500 mb-1">子组件 B (普通调用)</div>
      <div className="font-mono text-sm text-amber-400 font-bold tracking-wider">{data.random}</div>
      <div className="font-mono text-[10px] text-zinc-400 mt-1">{data.timestamp}</div>
    </div>
  );
}

// ============================================================================
// 2. Next.js "use cache" 指令 - 持久化函数与组件缓存
// ============================================================================
async function getUseCacheValue() {
  "use cache";
  // 配置缓存生命周期，缓存 10 秒
  cacheLife({ revalidate: 10 });

  console.log(`[USE CACHE] getUseCacheValue 持久化函数执行`);
  const now = new Date();
  return {
    random: Math.random().toString(36).substring(7).toUpperCase(),
    timestamp: now.toLocaleTimeString('zh-CN', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0')
  };
}

// 强制整页在服务端为动态渲染，以便每次刷新能重新发起请求，观察 Request Memoization
export const dynamic = 'force-dynamic';

export default async function ComponentCachePage() {
  // 调用 use cache 函数
  const useCacheData = await getUseCacheValue();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* 顶部导航面包屑 */}
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-400">
        <Link href="/" className="hover:text-cyan-400 transition-colors">仪表盘首页</Link>
        <span>/</span>
        <span className="text-zinc-200 font-medium">组件与函数级缓存</span>
      </div>

      {/* 页面标题 */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">
          React & Next.js <span className="text-gradient">组件与函数级缓存</span>
        </h1>
        <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
          除了传统的基于 <code>fetch</code> 的数据缓存 (Data Cache)，Next.js 16 深度融合了 React 19，提供了<strong>函数级与组件级缓存体系</strong>。主要解决“单次请求内的去重合并”和“跨请求的任意组件/非 fetch 数据库持久化缓存”两大痛点。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 左侧：React cache() 请求记忆化 */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                React 19 - Request Memoization
              </span>
              <span className="text-xs text-zinc-500 font-mono">仅单次请求生存</span>
            </div>
            
            <h2 className="text-xl font-bold text-zinc-200 mb-2">React `cache()` 记忆化函数</h2>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              在一此页面渲染树中，三个并发运行的子组件并发请求<strong>同一个 ID</strong>。观察两组子组件在输出和控制台日志上的区别。
            </p>

            {/* 演示：使用 React cache 包裹过的 */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-cyan-400 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  记忆化组件演示 (共享 ID: "user-100")
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <MemoizedChild group="user-100" />
                  <MemoizedChild group="user-100" />
                  <MemoizedChild group="user-100" />
                </div>
                <p className="text-[11px] text-emerald-400 mt-2">
                  ✓ 结果完全一致：三个子组件共享了同一次计算结果。后台终端日志中只执行了 1 次。
                </p>
              </div>

              {/* 演示：普通查询的 */}
              <div className="pt-2">
                <h3 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  普通异步调用演示 (共享 ID: "user-100")
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <NormalChild group="user-100" />
                  <NormalChild group="user-100" />
                  <NormalChild group="user-100" />
                </div>
                <p className="text-[11px] text-amber-400 mt-2">
                  ⚠ 结果不一致或产生多次请求：数据随机值和毫秒级时间戳均不同，后台终端日志中执行了 3 次。
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-300">💻 核心用法代码：</h4>
              <pre className="bg-black/40 border border-white/5 p-3 rounded-lg text-[10px] font-mono text-zinc-300 overflow-x-auto">
{`import { cache } from 'react';

// 包装你底层的数据库查询或慢计算
export const getUser = cache(async (id: string) => {
  const user = await db.user.findUnique({ id });
  return user;
});`}
              </pre>
            </div>
          </div>
        </div>

        {/* 右侧：Next.js "use cache" 持久化缓存 */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Next.js 16 - Component & Function Cache
              </span>
              <span className="text-xs text-zinc-500 font-mono">跨请求持久化缓存</span>
            </div>

            <h2 className="text-xl font-bold text-zinc-200 mb-2">Next.js `"use cache"` 指令</h2>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              全新的数据和组件层面的通用持久化缓存。它可以直接将非 fetch 逻辑（如复杂的 SQL 或是任意 CPU 密集计算）持久化在 Data Cache 中，不依赖于网络补丁。
            </p>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
                <span className="text-xs text-zinc-500 mb-1 tracking-wider uppercase">"use cache" 函数执行结果</span>
                <span className="text-2xl font-extrabold font-mono tracking-tight text-gradient my-2">
                  {useCacheData.random}
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  服务端计算时间戳: {useCacheData.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-purple-300 leading-relaxed">
                💡 <strong>现象展示</strong>：开启 <code>experimental: &#123; useCache: true &#125;</code> 后，此函数内的数据结果将被强制缓存 10 秒。即使你反复点击下方的“刷新当前页面”，上方的数据值也绝不会改变，直到 10 秒后缓存失效触发后台静默重验。
              </p>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-300">💻 核心用法代码：</h4>
              <pre className="bg-black/40 border border-white/5 p-3 rounded-lg text-[10px] font-mono text-zinc-300 overflow-x-auto">
{`import { cacheLife } from 'next/cache';

async function getUseCacheValue() {
  "use cache";                  // 声明该函数/组件在服务端被缓存
  cacheLife({ revalidate: 10 }); // 配置 10 秒后重新验证
  
  return {
    random: Math.random().toString(36)
  };
}`}
              </pre>
            </div>
          </div>
        </div>

      </div>

      {/* 底部控制动作 */}
      <div className="mt-8 flex items-center justify-between glass-panel rounded-2xl p-6 border border-white/5 bg-black/20">
        <div className="text-xs text-zinc-400">
          <strong>提示</strong>：建议观察控制台的终端输出日志，你会看到 <code>[REACT CACHE]</code> 和 <code>[NORMAL]</code> 的调用打印次数，直观感受去重记忆化带来的效率。
        </div>
        <RefreshButton />
      </div>
    </div>
  );
}
