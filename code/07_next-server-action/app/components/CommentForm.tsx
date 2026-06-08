"use client";

import { useActionState, useEffect, useRef } from "react";
import { addCommentAction, FormState } from "@/app/actions/guestbook";
import { SubmitButton } from "./SubmitButton";
import { Comment } from "@/app/lib/db";

interface CommentFormProps {
  onOptimisticAdd: (comment: Omit<Comment, "id" | "createdAt">) => void;
}

const initialState: FormState = {
  success: false,
  errors: null,
};

export function CommentForm({ onOptimisticAdd }: CommentFormProps) {
  // React 19 的 useActionState 接收 (action, initialState)
  // 返回 [当前状态, 触发 Action 的包裹函数, 是否处于 Pending 状态]
  const [state, formAction, isPending] = useActionState(
    addCommentAction,
    initialState
  );
  
  const formRef = useRef<HTMLFormElement>(null);

  // 提交成功后清空输入框
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
    }
  }, [state]);

  const handleSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // 前端基础预检：若填入主要字段，即立即注入乐观状态留言
    if (name.trim().length >= 2 && email.includes("@") && message.trim().length >= 5) {
      onOptimisticAdd({
        name,
        email,
        message,
        userAgent: "获取中...", // 乐观数据中的临时占位符
      });
    }

    // 调用 useActionState 返回的执行器，触发 Server Action
    formAction(formData);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-zinc-800/80">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
        <span>✍️ 撰写留言</span>
      </h3>
      
      {/* 全局异常/频控错误展示 */}
      {state.errors?.form && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 animate-shake">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>{state.errors.form.join(", ")}</div>
        </div>
      )}

      {/* 全局成功状态展示 */}
      {state.success && state.message && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>{state.message}</div>
        </div>
      )}

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-zinc-400 mb-1.5">
            姓名
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="输入您的姓名（2字以上）"
            disabled={isPending}
            className="glass-input w-full px-4 py-2.5 rounded-xl text-sm placeholder-zinc-600 focus:outline-none"
          />
          {state.errors?.name && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{state.errors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-zinc-400 mb-1.5">
            邮箱
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your-email@example.com"
            disabled={isPending}
            className="glass-input w-full px-4 py-2.5 rounded-xl text-sm placeholder-zinc-600 focus:outline-none"
          />
          {state.errors?.email && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{state.errors.email[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-medium text-zinc-400 mb-1.5">
            留言内容
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            placeholder="写下你想对大家说的话（输入 /admin 将演示服务端 Action 重定向）"
            disabled={isPending}
            className="glass-input w-full px-4 py-2.5 rounded-xl text-sm placeholder-zinc-600 focus:outline-none resize-none"
          />
          {state.errors?.message && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{state.errors.message[0]}</p>
          )}
        </div>

        {/* 提交按钮（内部基于 useFormStatus 控制 Pending 态） */}
        <SubmitButton />
        
        <p className="text-[10px] text-zinc-600 text-center mt-2 leading-relaxed">
          * 提示：提交含有 <strong>/admin</strong> 的内容将被重定向。<br />
          提交成功后，本地会通过 Cookie 限制 10s 频控，防止高频表单轰炸。
        </p>
      </form>
    </div>
  );
}
