import { headers } from 'next/headers';
import DemoContainer from '../components/DemoContainer';

export default async function TimeRevalidatePage() {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const apiUrl = `${protocol}://${host}/api/time`;

  const startTime = Date.now();
  // 设置 10 秒缓存过期重新验证
  const res = await fetch(apiUrl, { next: { revalidate: 10 } });
  const data = await res.json();
  const durationMs = Date.now() - startTime;

  const explanation = (
    <div className="space-y-4">
      <p>
        使用 <code>{`{ next: { revalidate: 10 } }`}</code> 会指示 Next.js 将该 fetch 数据缓存 10 秒。
      </p>
      <p className="font-semibold text-cyan-300">Stale-While-Revalidate (SWR) 机制：</p>
      <ul className="list-disc pl-5 space-y-2 text-zinc-400">
        <li><strong>10 秒内访问：</strong>缓存处于“新鲜”状态，直接返回，耗时在 <code>0~5ms</code>，数据完全不变。</li>
        <li><strong>10 秒后访问 (首次刷新)：</strong>缓存已“过期”。为了防止页面加载受阻，Next.js 会<strong>率先返回旧数据</strong>（耗时依然是极低的毫秒级），并在<strong>后台异步</strong>启动新数据的请求以刷新缓存。</li>
        <li><strong>再次刷新 (二次刷新)：</strong>由于缓存已被后台完成更新，本次访问便会展示最新的时间戳和 UUID。</li>
      </ul>
      <p className="text-zinc-400">
        <strong>适用场景：</strong> 适合更新频率不高，但又不能永久不变的公共数据。例如：新闻头条、商品列表、天气状况等。
      </p>
    </div>
  );

  return (
    <DemoContainer
      title="基于时间的重新验证 (Time-based Revalidation)"
      cacheStrategy="fetch(apiUrl, { next: { revalidate: 10 } })"
      data={data}
      durationMs={durationMs}
      explanation={explanation}
    />
  );
}
