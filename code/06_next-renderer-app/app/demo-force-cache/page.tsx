import { headers } from 'next/headers';
import DemoContainer from '../components/DemoContainer';

export default async function ForceCachePage() {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const apiUrl = `${protocol}://${host}/api/time`;

  const startTime = Date.now();
  // 显式指定 cache: 'force-cache'，表示该数据应被永久缓存，直到被重新验证
  const res = await fetch(apiUrl, { cache: 'force-cache' });
  const data = await res.json();
  const durationMs = Date.now() - startTime;

  const explanation = (
    <div className="space-y-4">
      <p>
        使用 <code>{`{ cache: 'force-cache' }`}</code> 可以指示 Next.js 将抓取回来的数据存入服务端的 <strong>Data Cache</strong>（数据缓存）。
      </p>
      <p className="font-semibold text-cyan-300">运作机制：</p>
      <ul className="list-disc pl-5 space-y-2 text-zinc-400">
        <li><strong>第一次请求：</strong>Next.js 服务端发起真正的请求，将抓取的数据固化在本地缓存中。</li>
        <li><strong>后续请求：</strong>Next.js 直接在服务端读取 Data Cache。此时你刷新页面，获取耗时会陡降至极低的 <code>0~5ms</code> 级。</li>
        <li><strong>持久性：</strong>除非服务重启、缓存目录被清空，或通过手动触发重新验证，否则即使刷新页面，时间戳和 UUID 也绝不会发生变化。</li>
      </ul>
      <p className="text-zinc-400">
        <strong>混合模式：</strong> 本页面使用了动态的 <code>headers()</code>，这会让页面本身被标记为动态渲染，但因为 <code>fetch</code> 标记了强缓存，Next 仍旧只从缓存获取数据。这展现了 Next.js **极其精确的细粒度缓存管理能力**。
      </p>
    </div>
  );

  return (
    <DemoContainer
      title="强静态缓存 (Static Fetching)"
      cacheStrategy="fetch(apiUrl, { cache: 'force-cache' })"
      data={data}
      durationMs={durationMs}
      explanation={explanation}
    />
  );
}
