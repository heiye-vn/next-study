'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Code2 } from 'lucide-react';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function TraditionalFormPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState<string>('');

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '姓名至少需要 2 个字符';
    }

    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    if (!formData.subject) {
      newErrors.subject = '请选择主题';
    }

    if (!formData.message.trim()) {
      newErrors.message = '请输入留言内容';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = '留言至少需要 10 个字符';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitting(false);
    setSubmitted(true);
    setSubmitResult(JSON.stringify(formData, null, 2));
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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
          <span className="text-sm font-medium">传统表单</span>
        </div>
        <Link
          href="/rhf"
          className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
        >
          下一节：React Hook Form
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-amber-500 to-orange-600 text-sm font-bold text-white">
            01
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">传统表单</h1>
            <p className="text-muted-foreground text-sm">
              使用 useState + onChange 手动管理表单状态
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
                <p className="text-muted-foreground mb-6 text-sm">您的消息已成功发送。</p>
                <pre className="bg-muted text-muted-foreground max-h-48 w-full overflow-auto rounded-lg p-4 text-left font-mono text-xs">
                  {submitResult}
                </pre>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-6 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  重新提交
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
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
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="请输入您的姓名"
                    className={`bg-background placeholder:text-muted-foreground/50 focus:ring-ring/20 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary'
                    }`}
                  />
                  {errors.name && <p className="text-destructive mt-1 text-xs">{errors.name}</p>}
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`bg-background placeholder:text-muted-foreground/50 focus:ring-ring/20 w-full rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary'
                    }`}
                  />
                  {errors.email && <p className="text-destructive mt-1 text-xs">{errors.email}</p>}
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
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
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
                    <p className="text-destructive mt-1 text-xs">{errors.subject}</p>
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
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="请输入您的留言内容..."
                    className={`bg-background placeholder:text-muted-foreground/50 focus:ring-ring/20 w-full resize-none rounded-lg border px-3 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${
                      errors.message
                        ? 'border-destructive focus:border-destructive'
                        : 'border-input focus:border-primary'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-destructive mt-1 text-xs">{errors.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
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
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                使用{' '}
                <code className="bg-secondary rounded px-1 py-0.5 font-mono text-xs">
                  useState
                </code>{' '}
                管理每个表单字段
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                通过{' '}
                <code className="bg-secondary rounded px-1 py-0.5 font-mono text-xs">
                  onChange
                </code>{' '}
                事件手动更新状态
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                手写{' '}
                <code className="bg-secondary rounded px-1 py-0.5 font-mono text-xs">
                  validate()
                </code>{' '}
                函数做表单验证
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />用{' '}
                <code className="bg-secondary rounded px-1 py-0.5 font-mono text-xs">
                  e.preventDefault()
                </code>{' '}
                阻止默认提交
              </li>
            </ul>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <h3 className="mb-3 text-sm font-semibold">适用场景</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              适合简单的表单场景，如搜索框、登录表单等。当表单字段较多或需要复杂验证时，
              手动管理的代码量会迅速增长，建议升级到 React Hook Form。
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/20 dark:border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10 p-5">
            <h3 className="mb-2 text-sm font-semibold text-amber-700 dark:text-amber-400">注意事项</h3>
            <p className="text-sm leading-relaxed text-amber-700/80 dark:text-amber-400/80">
              每个字段都需要单独的 state 和 handler，随着字段增加，代码会变得冗长且难以维护。
              同时每次输入都会触发组件重渲染。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
