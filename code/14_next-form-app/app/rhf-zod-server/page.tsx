"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useActionState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Code2,
  Server,
} from "lucide-react";
import { submitForm, type FormState } from "../actions/submit";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "请输入姓名")
    .min(2, "姓名至少需要 2 个字符"),
  email: z
    .string()
    .min(1, "请输入邮箱")
    .email("请输入有效的邮箱地址"),
  subject: z
    .string()
    .min(1, "请选择主题"),
  message: z
    .string()
    .min(1, "请输入留言内容")
    .min(10, "留言至少需要 10 个字符"),
});

type ContactFormData = z.infer<typeof formSchema>;

const initialState: FormState = {
  success: false,
  message: "",
};

export default function RhfZodServerPage() {
  const [state, formAction, isPending] = useActionState(submitForm, initialState);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
  });

  function onSubmitClient(data: ContactFormData) {
    // Convert form data to FormData for server action
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formAction(formData);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            首页
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">RHF + Zod + Server Actions</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/rhf-zod"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            上一节
          </Link>
          <Link
            href="/rhf-zod-shadcn"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            下一节：Shadcn UI
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 text-white text-sm font-bold">
            04
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              RHF + Zod + Server Actions
            </h1>
            <p className="text-sm text-muted-foreground">
              客户端 + 服务端双重验证的全栈表单方案
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-6">
            {/* Server Response */}
            {state.success && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    {state.message}
                  </p>
                  {state.data && (
                    <pre className="mt-2 text-xs font-mono text-emerald-600/80 overflow-auto max-h-32">
                      {JSON.stringify(state.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {state.errors && !state.success && (
              <div className="mb-5 flex items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <div>
                  <p className="text-sm font-medium text-destructive">
                    {state.message}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {Object.entries(state.errors).map(([field, messages]) =>
                      messages.map((msg, i) => (
                        <li
                          key={`${field}-${i}`}
                          className="text-xs text-destructive/80"
                        >
                          · {field}: {msg}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmitClient)}
              className="space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1.5"
                >
                  姓名 <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="请输入您的姓名"
                  {...register("name")}
                  className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring/20 ${
                    errors.name || state.errors?.name
                      ? "border-destructive focus:border-destructive"
                      : "border-input focus:border-primary"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
                {state.errors?.name && !errors.name && (
                  <p className="mt-1 text-xs text-destructive">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5"
                >
                  邮箱 <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your@email.com"
                  {...register("email")}
                  className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-ring/20 ${
                    errors.email || state.errors?.email
                      ? "border-destructive focus:border-destructive"
                      : "border-input focus:border-primary"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
                {state.errors?.email && !errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1.5"
                >
                  主题 <span className="text-destructive">*</span>
                </label>
                <select
                  id="subject"
                  {...register("subject")}
                  className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring/20 ${
                    errors.subject || state.errors?.subject
                      ? "border-destructive focus:border-destructive"
                      : "border-input focus:border-primary"
                  }`}
                >
                  <option value="">请选择主题...</option>
                  <option value="general">一般咨询</option>
                  <option value="support">技术支持</option>
                  <option value="feedback">意见反馈</option>
                  <option value="business">商务合作</option>
                </select>
                {errors.subject && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.subject.message}
                  </p>
                )}
                {state.errors?.subject && !errors.subject && (
                  <p className="mt-1 text-xs text-destructive">
                    {state.errors.subject[0]}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1.5"
                >
                  留言 <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="请输入您的留言内容..."
                  {...register("message")}
                  className={`w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 resize-none focus:ring-2 focus:ring-ring/20 ${
                    errors.message || state.errors?.message
                      ? "border-destructive focus:border-destructive"
                      : "border-input focus:border-primary"
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
                {state.errors?.message && !errors.message && (
                  <p className="mt-1 text-xs text-destructive">
                    {state.errors.message[0]}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    服务端处理中...
                  </>
                ) : (
                  "提交到服务端"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Explanation Panel */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Server className="h-4 w-4 text-violet-500" />
              <h3 className="text-sm font-semibold">Server Action</h3>
            </div>
            <pre className="rounded-lg bg-muted p-3 text-xs font-mono text-muted-foreground overflow-auto">
{`"use server";

export async function submitForm(
  prevState, formData
) {
  // 模拟网络延迟
  await new Promise(
    r => setTimeout(r, 1500)
  );

  // 服务端验证...
  // 数据库操作...
  // 返回结果
}`}
            </pre>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">实现要点</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500" />
                <span>
                  <code className="rounded bg-secondary px-1 py-0.5 text-xs font-mono">
                    useActionState
                  </code>{" "}
                  管理 Server Action 状态
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500" />
                <span>客户端 Zod 验证 + 服务端双重校验</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500" />
                <span>
                  表单数据通过{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 text-xs font-mono">
                    FormData
                  </code>{" "}
                  传递到服务端
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-500" />
                <span>服务端返回的错误信息会显示在对应字段下方</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold mb-3">数据流</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-violet-500/10 text-violet-600 font-bold text-[10px]">
                  1
                </span>
                <span>用户输入数据</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-violet-500/10 text-violet-600 font-bold text-[10px]">
                  2
                </span>
                <span>客户端 Zod Schema 验证</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-violet-500/10 text-violet-600 font-bold text-[10px]">
                  3
                </span>
                <span>转换为 FormData 发送到服务端</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-violet-500/10 text-violet-600 font-bold text-[10px]">
                  4
                </span>
                <span>服务端二次验证 + 业务处理</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-violet-500/10 text-violet-600 font-bold text-[10px]">
                  5
                </span>
                <span>返回结果（成功/错误）</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
