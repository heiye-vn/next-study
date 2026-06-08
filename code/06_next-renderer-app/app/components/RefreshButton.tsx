'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      // router.refresh 会通知 Next.js 从服务端重新获取当前路由的数据，而不会丢失客户端的状态
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className="btn-secondary px-5 py-2.5 rounded-lg text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
    >
      {isPending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"></span>
      ) : (
        <svg className="w-4 h-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
        </svg>
      )}
      <span>{isPending ? '重新获取中...' : '刷新当前页面'}</span>
    </button>
  );
}
