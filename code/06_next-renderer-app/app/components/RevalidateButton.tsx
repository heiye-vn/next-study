'use client';

import { useTransition } from 'react';

interface RevalidateButtonProps {
  action: () => Promise<void>;
  label: string;
}

export default function RevalidateButton({ action, label }: RevalidateButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleRevalidate = () => {
    startTransition(async () => {
      // 执行 Server Action 清除缓存
      await action();
    });
  };

  return (
    <button
      onClick={handleRevalidate}
      disabled={isPending}
      className="btn-primary flex cursor-pointer items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
    >
      {isPending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      )}
      <span>{isPending ? '清除缓存中...' : label}</span>
    </button>
  );
}
