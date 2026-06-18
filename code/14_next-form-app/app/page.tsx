import Link from "next/link";
import {
  ArrowRight,
  FileCode,
  FormInput,
  ShieldCheck,
  Server,
  Sparkles,
} from "lucide-react";

const modes = [
  {
    num: "01",
    title: "传统表单",
    subtitle: "Traditional HTML Form",
    description:
      "使用原生 HTML 表单元素和 React 状态管理，理解表单的基本工作原理。",
    href: "/traditional",
    icon: FileCode,
    color: "from-amber-500 to-orange-600",
    tags: ["useState", "onSubmit", "手动验证"],
  },
  {
    num: "02",
    title: "React Hook Form",
    subtitle: "RHF Basic",
    description:
      "引入 React Hook Form 库，简化表单状态管理和事件处理，减少样板代码。",
    href: "/rhf",
    icon: FormInput,
    color: "from-blue-500 to-cyan-600",
    tags: ["useForm", "register", "handleSubmit"],
  },
  {
    num: "03",
    title: "RHF + Zod",
    subtitle: "Schema Validation",
    description:
      "结合 Zod 模式验证库，实现声明式的表单验证规则，提供类型安全的验证。",
    href: "/rhf-zod",
    icon: ShieldCheck,
    color: "from-emerald-500 to-teal-600",
    tags: ["zodResolver", "z.object", "Schema"],
  },
  {
    num: "04",
    title: "+ Server Actions",
    subtitle: "Full-Stack Form",
    description:
      "在 Zod 验证基础上使用 Next.js Server Actions 处理服务端逻辑，实现完整的全栈表单。",
    href: "/rhf-zod-server",
    icon: Server,
    color: "from-violet-500 to-purple-600",
    tags: ["use server", "useActionState", "Server Validation"],
  },
  {
    num: "05",
    title: "+ Shadcn UI",
    subtitle: "Production Ready",
    description:
      "集成 Shadcn UI 组件库，使用精心设计的表单组件和样式，构建生产级别的表单体验。",
    href: "/rhf-zod-shadcn",
    icon: Sparkles,
    color: "from-rose-500 to-pink-600",
    tags: ["Form Component", "Label", "Select", "UI Polish"],
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Next.js 16.2.9 + React 19
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">
          表单模式
          <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            {" "}渐进式演示
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed">
          从最基础的 HTML 原生表单到生产级的全栈表单方案，通过五个递进式示例，
          全面掌握 Next.js 中的表单处理技术。
        </p>
      </section>

      {/* Cards Grid */}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className="group relative flex flex-col rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5"
          >
            {/* Gradient accent */}
            <div
              className={`absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r ${mode.color} opacity-0 transition-opacity group-hover:opacity-100`}
            />

            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${mode.color} text-white shadow-sm`}
              >
                <mode.icon className="h-5 w-5" />
              </div>
              <span className="text-3xl font-bold text-muted-foreground/20 font-mono">
                {mode.num}
              </span>
            </div>

            <h2 className="text-lg font-semibold text-foreground mb-1">
              {mode.title}
            </h2>
            <p className="text-xs text-muted-foreground/70 font-mono mb-3">
              {mode.subtitle}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
              {mode.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {mode.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-mono text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              查看示例
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </section>

      {/* Progression indicator */}
      <section className="mt-16 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="rounded bg-secondary px-2 py-1 font-mono">
            简单
          </span>
          <div className="h-px w-24 bg-gradient-to-r from-amber-400 via-emerald-400 to-rose-400" />
          <span className="rounded bg-secondary px-2 py-1 font-mono">
            完整
          </span>
        </div>
      </section>
    </div>
  );
}
