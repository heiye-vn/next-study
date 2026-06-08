import { headers } from 'next/headers';
import DemoContainer from '../components/DemoContainer';

// 强制此页面为动态渲染，每次请求重新计算
export const dynamic = 'force-dynamic';

export default async function NoCachePage() {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const apiUrl = `${protocol}://${host}/api/time`;

  const startTime = Date.now();
  // 显式指定 cache: 'no-store'，Next.js 每次均发起真实网络请求
  const res = await fetch(apiUrl, { cache: 'no-store' });
  const data = await res.json();
  const durationMs = Date.now() - startTime;

  const explanation = (
    <div className="space-y-4">
      <p>
        在 <strong>Next.js 16.x (以及 React 19)</strong> 中，核心的设计哲学是 <strong>“安全与直观优先”</strong>。
        因此，在服务端组件中发起的 <code>fetch</code> 请求，默认的缓存行为由 Next.js 14 的 <code>force-cache</code> 改变为了 <strong><code>no-store</code></strong>。
      </p>
      <p className="font-semibold text-cyan-300">运作机制：</p>
      <ul className="list-disc pl-5 space-y-2 text-zinc-400">
        <li>每次路由访问或通过 <code>router.refresh()</code> 刷新时，Next.js 服务端都会向目标 API 发起真实的 HTTP 请求。</li>
        <li>数据中的时间戳和唯一标识 <code>UUID</code> 每次均会改变，反映最新状态。</li>
        <li>请求时间等于服务器与 API 路由的实际通信时长（由于 API 模拟延迟，耗时大约在 200~500 毫秒）。</li>
      </ul>
      <p className="text-zinc-400">
        <strong>适用场景：</strong> 适合对实时性要求极高的场景，例如交易数据、社交状态更新、通知推送等。
      </p>
    </div>
  );

  return (
    <DemoContainer
      title="默认 / 强制不缓存 (Dynamic Fetching)"
      cacheStrategy="fetch(apiUrl, { cache: 'no-store' })"
      data={data}
      durationMs={durationMs}
      explanation={explanation}
    />
  );
}
