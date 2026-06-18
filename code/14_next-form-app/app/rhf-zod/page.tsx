"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Code2,
  ShieldCheck,
} from "lucide-react";

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

type FormData = z.infer<typeof formSchema>;

export default function RhfZodFormPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormData) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setSubmitResult(JSON.stringify(data, null, 2));
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
          <span className="text-sm font-medium">RHF + Zod</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/rhf"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            上一节
          </Link>
          <Link
            href="/rhf-zod-server"
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            下一节：Server Actions
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-bold">
            03
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">RHF + Zod</h1>
            <p className="text-sm text-muted-foreground">
              使用 Zod Schema 实现类型安全的声明式验证
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-border bg-card p-6">
            {submitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mb-4" />
                <h2 className="text-xl font-semibold mb-2">
                  Zod 验证通过并提交成功！
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  所有字段均通过了 Zod Schema 验证。
                </p>
                <pre className="w-full rounded-lg bg-muted p-4 text-left text-xs font-mono text-muted-foreground overflow-auto max-h-48">
                  {submitResult}
                </pre>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    reset();
                  }}
                  className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  重新提交
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                      errors.name
                        ? "border-destructive focus:border-destructive"
                        : "border-input focus:border-primary"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.name.message}
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
                      errors.email
                        ? "border-destructive focus:border-destructive"
                        : "border-input focus:border-primary"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.email.message}
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
                      errors.subject
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
                      errors.message
                        ? "border-destructive focus:border-destructive"
                        : "border-input focus:border-primary"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    "提交表单"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Explanation Panel */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-semibold">Zod Schema</h3>
            </div>
            <pre className="rounded-lg bg-muted p-3 text-xs font-mono text-muted-foreground overflow-auto">
{`const formSchema = z.object({
  name: z.string()
    .min(1, "请输入姓名")
    .min(2, "至少2个字符"),
  email: z.string()
    .min(1, "请输入邮箱")
    .email("无效邮箱"),
  subject: z.string()
    .min(1, "请选择主题"),
  message: z.string()
    .min(10, "至少10个字符"),
})`}
            </pre>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">实现要点</h3>
            </div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                <span>
                  用{" "}
                  <code className="rounded bg-secondary px-1 py-0.5 text-xs font-mono">
                    zodResolver(schema)
                  </code>{" "}
                  连接 Zod 与 RHF
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                <span>
                  <code className="rounded bg-secondary px-1 py-0.5 text-xs font-mono">
                    z.infer
                  </code>{" "}
                  自动推导 TypeScript 类型
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                <span>验证规则集中定义，便于复用和维护</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
                <span>支持复杂验证：refine、transform、交叉类型等</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <h3 className="text-sm font-semibold mb-2 text-emerald-700">
              当前局限
            </h3>
            <p className="text-sm text-emerald-700/80 leading-relaxed">
              表单仍然只在客户端提交。在生产环境中，还需要服务端验证来确保数据安全。
              下一节将引入 Server Actions 实现完整的全栈表单处理。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
