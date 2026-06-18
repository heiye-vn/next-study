'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, Code2, Sparkles, Layers } from 'lucide-react';
import { submitForm, type FormState } from '../actions/submit';
import { contactFormSchema, type ContactFormData } from '@/lib/schemas';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialState: FormState = {
  success: false,
  message: '',
};

export default function RhfZodShadcnPage() {
  const [state, formAction, isPending] = useActionState(submitForm, initialState);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // 监听服务端提交结果，如果成功则重置表单
  useEffect(() => {
    if (state.success) {
      form.reset();
    }
  }, [state.success, form]);

  function onSubmitClient(data: ContactFormData) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formAction(formData);
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
          <span className="text-sm font-medium">RHF + Zod + Server Actions + Shadcn UI</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/rhf-zod-server"
            className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            上一节
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-rose-500 to-pink-600 text-sm font-bold text-white">
            05
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">完整方案：Shadcn UI</h1>
            <p className="text-muted-foreground text-sm">
              RHF + Zod + Server Actions + Shadcn UI 组件 = 生产级表单
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form Section */}
        <div className="lg:col-span-3">
          <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
            {/* Server Response */}
            {state.success && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium text-emerald-700">{state.message}</p>
                  {state.data && (
                    <pre className="mt-2 max-h-32 overflow-auto font-mono text-xs text-emerald-600/80">
                      {JSON.stringify(state.data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )}

            {state.errors && !state.success && (
              <div className="border-destructive/20 bg-destructive/5 mb-6 flex items-start gap-3 rounded-lg border p-4">
                <div>
                  <p className="text-destructive text-sm font-medium">{state.message}</p>
                  <ul className="mt-2 space-y-1">
                    {Object.entries(state.errors).map(([field, messages]) =>
                      messages.map((msg, i) => (
                        <li
                          key={`${field}-${i}`}
                          className="text-destructive/80 text-xs"
                        >
                          · {field}: {msg}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitClient)}
                className="space-y-6"
              >
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓名</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="请输入您的姓名"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>您的真实姓名或昵称</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>我们将通过此邮箱与您联系</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Subject - using shadcn Select */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>主题</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="请选择主题..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">一般咨询</SelectItem>
                          <SelectItem value="support">技术支持</SelectItem>
                          <SelectItem value="feedback">意见反馈</SelectItem>
                          <SelectItem value="business">商务合作</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>选择最符合您需求的主题类别</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>留言</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="请输入您的留言内容..."
                          className="min-h-30"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>详细描述您的问题或建议（至少 10 个字符）</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-linear-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      服务端处理中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      提交表单
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        {/* Explanation Panel */}
        <div className="space-y-5 lg:col-span-2">
          <div className="border-border bg-card rounded-xl border p-5">
            <div className="mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-rose-500" />
              <h3 className="text-sm font-semibold">技术栈总览</h3>
            </div>
            <div className="space-y-2">
              {[
                {
                  name: 'React Hook Form',
                  role: '表单状态管理与提交',
                  color: 'bg-blue-500',
                },
                {
                  name: 'Zod',
                  role: 'Schema 验证 + 类型推导',
                  color: 'bg-emerald-500',
                },
                {
                  name: 'Server Actions',
                  role: '服务端处理 + 二次验证',
                  color: 'bg-violet-500',
                },
                {
                  name: 'Shadcn UI',
                  role: '组件样式 + 可访问性',
                  color: 'bg-rose-500',
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="bg-muted/50 flex items-center gap-3 rounded-lg p-2.5"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${item.color}`} />
                  <div>
                    <span className="text-xs font-semibold">{item.name}</span>
                    <span className="text-muted-foreground ml-1 text-xs">— {item.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <div className="mb-3 flex items-center gap-2">
              <Code2 className="text-primary h-4 w-4" />
              <h3 className="text-sm font-semibold">Shadcn Form 组件</h3>
            </div>
            <pre className="bg-muted text-muted-foreground overflow-auto rounded-lg p-3 font-mono text-xs">
              {`<Form {...form}>
  <form onSubmit={...}>
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>姓名</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>
            描述文字
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>`}
            </pre>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <h3 className="mb-3 text-sm font-semibold">Shadcn 组件优势</h3>
            <ul className="text-muted-foreground space-y-2.5 text-sm">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span>
                  <strong className="text-foreground">FormField</strong> 将验证、 错误、描述统一封装
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span>
                  <strong className="text-foreground">Select</strong> 组件内置 动画和键盘导航
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span>
                  <strong className="text-foreground">Button</strong> 支持多种 变体（variant）和尺寸
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                <span>自动处理 aria 属性，提升可访问性</span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-rose-500/20 dark:border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 p-5">
            <h3 className="mb-2 text-sm font-semibold text-rose-700 dark:text-rose-400">生产就绪</h3>
            <p className="text-sm leading-relaxed text-rose-700/80 dark:text-rose-400/80">
              这套组合是目前 Next.js 生态中表单处理的最佳实践，
              兼具开发效率、类型安全、用户体验和可维护性。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
