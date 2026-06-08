'use client';

import { Comment } from '@/app/lib/db';

interface CommentListProps {
  comments: (Comment & { isPending?: boolean })[];
}

export function CommentList({ comments }: CommentListProps) {
  // 简易格式化日期
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (comments.length === 0) {
    return (
      <div className="glass-card rounded-2xl border border-dashed border-zinc-800 p-10 text-center text-zinc-500">
        ✨ 暂无留言，快来发布第一条留言吧！
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className={`glass-card relative overflow-hidden rounded-2xl border-l-4 p-6 transition-all duration-300 ${
            comment.isPending
              ? 'scale-[0.99] border-l-indigo-500 bg-indigo-500/5 opacity-60'
              : 'border-l-zinc-800 hover:border-l-indigo-400'
          }`}
        >
          {comment.isPending && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-medium text-indigo-400">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-indigo-400" />
              正在发送...
            </div>
          )}

          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 text-xs font-bold text-white shadow-md">
                {comment.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="flex flex-col gap-1 text-sm font-semibold text-zinc-100 sm:flex-row sm:items-center sm:gap-2">
                  <span>{comment.name}</span>
                  <span className="text-xs font-normal text-zinc-500">&lt;{comment.email}&gt;</span>
                </h4>
                <p
                  className="mt-0.5 text-[10px] text-zinc-500"
                  suppressHydrationWarning
                >
                  {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <p className="pl-13 text-sm leading-relaxed whitespace-pre-wrap text-zinc-300">
            {comment.message}
          </p>

          <div className="mt-4 flex flex-col justify-between gap-2 border-t border-zinc-900/60 pt-3 pl-13 text-[10px] text-zinc-600 sm:flex-row sm:items-center">
            <span
              className="max-w-[320px] truncate"
              title={comment.userAgent}
            >
              🌐 {comment.userAgent}
            </span>
            {!comment.isPending && (
              <span className="self-end rounded border border-zinc-800/30 bg-zinc-900/50 px-2 py-0.5 text-zinc-700 sm:self-auto">
                已同步至服务器
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
