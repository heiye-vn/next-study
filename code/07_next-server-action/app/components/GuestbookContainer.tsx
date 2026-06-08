"use client";

import { useOptimistic } from "react";
import { Comment } from "@/app/lib/db";
import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";

interface GuestbookContainerProps {
  initialComments: Comment[];
}

export function GuestbookContainer({
  initialComments,
}: GuestbookContainerProps) {
  // useOptimistic: React 19 新特性
  // 接收初始值(initialComments)和更新逻辑，返回 [乐观状态数据, 乐观状态触发函数]
  const [optimisticComments, addOptimisticComment] = useOptimistic<
    (Comment & { isPending?: boolean })[],
    Omit<Comment, "id" | "createdAt">
  >(initialComments, (state, newComment) => {
    // 乐观添加：在真实 Server Action 完成前，先本地伪造一条留言追加到首位
    return [
      {
        ...newComment,
        id: `temp-${Math.random()}`,
        createdAt: new Date().toISOString(),
        isPending: true,
      },
      ...state,
    ];
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5 lg:sticky lg:top-8">
        <CommentForm onOptimisticAdd={addOptimisticComment} />
      </div>
      <div className="lg:col-span-7 space-y-4">
        <h3 className="text-lg font-semibold text-zinc-100 mb-2 flex items-center gap-2">
          <span>💬 留言列表</span>
          <span className="text-xs bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-indigo-400 font-mono">
            {optimisticComments.length} 条
          </span>
        </h3>
        <CommentList comments={optimisticComments} />
      </div>
    </div>
  );
}
