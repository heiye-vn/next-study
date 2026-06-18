'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Code2 } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function RhfFormPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setSubmitResult(JSON.stringify(data, null, 2));
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            首页
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-sm font-medium">React Hook Form</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/traditional"
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            上一节
          </Link>
          <Link
            href="/rhf-zod"
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            下一节：RHF + Zod
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-cyan-600 text-sm font-bold text-white">
            02
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">React Hook Form</h1>
            <p className="text-muted-foreground text-sm">
              使用 RHF 的 register + handleSubmit 简化表单处理
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="border-border bg-card rounded-xl border p-6">
            {submitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-500" />
                <h2 className="mb-2 text-xl font-semibold">提交成功！</h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  数据已通过 React Hook Form 收集并提交。
                </p>
                <pre className="bg-muted text-muted-foreground max-h-48 w-full overflow-auto rounded-lg p-4 text-left font-mono text-xs">
                  {submitResult}
                </pre>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    reset();
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  重新提交
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    姓名 <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="请输入您的姓名"
                    {...register('name', {
                      required: '请输入姓名',
                      minLength: {
                        value: 2,
                        message: '姓名至少需要 2 个字符',
                      },
                    })}
                    className={`bg-background placeholder:text-muted-foreground/50 focus:ring-ring/20 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-destructive mt-1 text-xs">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    邮箱 <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    {...register('email', {
                      required: '请输入邮箱',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: '请输入有效的邮箱地址',
                      },
                    })}
                    className={`bg-background placeholder:text-muted-foreground/50 focus:ring-ring/20 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-destructive mt-1 text-xs">{errors.email.message}</p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    主题 <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="subject"
                    {...register('subject', {
                      required: '请选择主题',
                    })}
                    className={`bg-background focus:ring-ring/20 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${
                      errors.subject
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary'
                    }`}
                  >
                    <option value="">请选择主题...</option>
                    <option value="general">一般咨询</option>
                    <option value="support">技术支持</option>
                    <option value="feedback">意见反馈</option>
                    <option value="business">商务合作</option>
                  </select>
                  {errors.subject && (
                    <p className="text-destructive mt-1 text-xs">{errors.subject.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    留言 <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="请输入您的留言内容..."
                    {...register('message', {
                      required: '请输入留言内容',
                      minLength: {
                        value: 10,
                        message: '留言至少需要 10 个字符',
                      },
                    })}
                    className={`bg-background placeholder:text-muted-foreground/50 focus:ring-ring/20 w-full resize-none rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${
                      errors.message
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-destructive mt-1 text-xs">{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-blue-500 to-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      提交中...
                    </>
                  ) : (
                    '提交表单'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Explanation Panel */}
        <div className="space-y-5 lg:col-span-2">
          <div className="border-border bg-card rounded-xl border p-5">
            <div className="mb-3 flex items-center gap-2">
              <Code2 className="text-primary h-4 w-4" />
              <h3 className="text-sm font-semibold">实现要点</h3>
            </div>
            <ul className="text-muted-foreground space-y-2.5 text-sm">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>
                  使用{' '}
                  <code className="bg-secondary rounded px-1 py-0.5 font-mono text-xs">
                    useForm()
                  </code>{' '}
                  Hook 获取表单方法
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>
                  <code className="bg-secondary rounded px-1 py-0.5 font-mono text-xs">
                    register()
                  </code>{' '}
                  自动绑定 input 事件和 ref
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>
                  <code className="bg-secondary rounded px-1 py-0.5 font-mono text-xs">
                    formState.errors
                  </code>{' '}
                  自动收集验证错误
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                <span>内置验证规则：required, minLength, pattern 等</span>
              </li>
            </ul>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <h3 className="mb-3 text-sm font-semibold">与传统表单的对比</h3>
            <div className="text-muted-foreground space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>无需为每个字段创建 useState</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>输入时不会触发整个组件重渲染</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>验证规则与字段声明在一起，更直观</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                <span>自动处理 isSubmitting 状态</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-blue-500/20 dark:border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10 p-5">
            <h3 className="mb-2 text-sm font-semibold text-blue-700 dark:text-blue-400">局限性</h3>
            <p className="text-sm leading-relaxed text-blue-700/80 dark:text-blue-400/80">
              验证规则以内联方式定义，缺乏可复用性和类型安全。
              复杂验证（如跨字段验证）仍需要手动处理。 下一节将展示如何用 Zod 解决这些问题。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
