import { getComments } from '@/app/lib/db';
import { GuestbookContainer } from '@/app/components/GuestbookContainer';

// 强制为动态渲染，确保每次页面加载时均能从 db.json 中读取到最新状态，且确保 headers/cookies 异步获取正常工作
export const dynamic = 'force-dynamic';

export default async function Home() {
  // 服务端直接加载初始留言列表
  const initialComments = await getComments();

  return (
    <main className="animate-fade-in mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:py-20">
      {/* 头部大标题与视觉区 */}
      <header className="mx-auto mb-16 max-w-2xl space-y-4 text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-indigo-400 uppercase">
          🚀 Next.js 16 + React 19 核心演示
        </div>

        <h1 className="bg-linear-to-r from-zinc-100 via-indigo-200 to-purple-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
          Server Actions 最佳实践
        </h1>

        <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
          一个融合了 Server Actions 各项特性的精致留言板。演示了
          <strong> 乐观更新 (Optimistic UI)</strong>、<strong> 表单等待状态</strong>、
          <strong> Zod 服务端验证</strong>、<strong> 错误控制</strong>、
          <strong> Cookies/Headers 读取</strong> 以及
          <strong> 安全重定向</strong> 等核心机制。
        </p>
      </header>

      {/* 核心交互区 */}
      <GuestbookContainer initialComments={initialComments} />
    </main>
  );
}
