import { headers } from 'next/headers';
import DemoContainer from '../components/DemoContainer';
import RevalidateButton from '../components/RevalidateButton';
import { revalidateTimeTag } from '../actions';

export default async function OnDemandPage() {
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const apiUrl = `${protocol}://${host}/api/time`;

  const startTime = Date.now();
  // 绑定特定标签 'time-data'
  const res = await fetch(apiUrl, { next: { tags: ['time-data'] } });
  const data = await res.json();
  const durationMs = Date.now() - startTime;

  const explanation = (
    <div className="space-y-4">
      <p>
        使用 <code>{`{ next: { tags: ['time-data'] } }`}</code>，你可以为该 <code>fetch</code> 请求关联一个或多个唯一的标签（Tags）。
      </p>
      <p className="font-semibold text-cyan-300">运作机制：</p>
      <ul className="list-disc pl-5 space-y-2 text-zinc-400">
        <li><strong>常态运行下：</strong>只要不主动执行清除操作，它就会一直命中 Data Cache。无论怎么刷新，响应都是 <code>0~5ms</code> 且数据完全固化。</li>
        <li><strong>动作触发：</strong>点击左下角按钮，我们将执行一个服务端动作（Server Action），其调用了 <code>revalidateTag('time-data')</code>。</li>
        <li><strong>即时更新：</strong>该 Tag 的旧缓存会被立刻清除，下一次页面重新加载（或 <code>router.refresh()</code> 自动进行）便会发起全新请求抓取最新数据。</li>
      </ul>
      <p className="text-zinc-400">
        <strong>适用场景：</strong> 特别适合与内容管理系统（CMS）发布、数据库写入操作配合使用。如：发布新博文后清除文章列表缓存、用户修改个人资料后清除页面卡片缓存等。
      </p>
    </div>
  );

  return (
    <DemoContainer
      title="按需手动重新验证 (On-demand Revalidation)"
      cacheStrategy="fetch(apiUrl, { next: { tags: ['time-data'] } })"
      data={data}
      durationMs={durationMs}
      explanation={explanation}
      extraActions={
        <RevalidateButton 
          action={revalidateTimeTag} 
          label="执行 revalidateTag('time-data')"
        />
      }
    />
  );
}
