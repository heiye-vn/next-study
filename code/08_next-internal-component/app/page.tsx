'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Form from 'next/form';
import Script from 'next/script';
import heroImg from '../public/hero.png'; // 静态导入，支持自动计算宽高与模糊占位

export default function Home() {
  const [scriptStatus, setScriptStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [clicks, setClicks] = useState(0);

  // 模拟脚本载入后触发的方法
  const handleTrackClick = () => {
    setClicks((prev) => prev + 1);
    if (typeof window !== 'undefined' && (window as any).mockAnalytics) {
      (window as any).mockAnalytics.trackEvent('button_click', {
        count: clicks + 1,
        timestamp: Date.now(),
      });
    } else {
      console.warn('⚠️ [Analytics] 脚本尚未就绪，无法上报埋点数据！');
    }
  };

  return (
    <div className="bg-grid scanline-overlay relative min-h-screen overflow-hidden bg-zinc-50 pb-24 font-sans transition-colors duration-300 dark:bg-zinc-950">
      {/* 科技蓝/紫/绿背光氛围 (Mesh Gradients) */}
      <div className="pointer-events-none absolute -top-40 -right-40 -z-10 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute top-1/3 -left-40 -z-10 h-150 w-150 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,rgba(6,182,212,0.03)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute right-10 bottom-10 -z-10 h-100 w-100 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.05)_0%,transparent_70%)] blur-3xl" />

      {/* Script 组件演示 */}
      <Script
        src="/mock-analytics.js"
        strategy="lazyOnload" // 浏览器空闲时延迟加载，避免影响首屏性能
        onLoad={() => {
          setScriptStatus('loaded');
        }}
        onError={() => {
          setScriptStatus('error');
        }}
      />

      {/* 头部导航区域 (Glassmorphism 毛玻璃 & 精细边框) */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/60 bg-white/70 backdrop-blur-md transition-all duration-300 dark:border-zinc-800/80 dark:bg-zinc-950/70">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center rounded border border-zinc-200/80 bg-white p-1.5 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900">
              <Image
                src="/next.svg"
                alt="Next.js logo"
                width={72}
                height={15}
                className="dark:invert"
                priority // 首屏导航 Logo 开启优先级加载
              />
            </div>
            <span className="rounded border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest text-purple-600 uppercase dark:text-purple-400">
              SYS.V16_LAB
            </span>
          </div>

          {/* Link 组件演示 */}
          <nav className="flex items-center gap-6 font-mono text-xs tracking-wider uppercase">
            <Link
              href="/"
              className="relative py-1 font-bold text-purple-600 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-purple-500 dark:text-purple-400"
            >
              [ 首页 ]
            </Link>
            {/* 默认 prefetch */}
            <Link
              href="/search?query=React"
              className="py-1 text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              React 专栏
            </Link>
            {/* prefetch={false} */}
            <Link
              href="/search?query=Next.js"
              prefetch={false}
              className="group relative py-1 text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Next.js 专栏
              <span className="py-0.2 absolute -top-3.5 -right-7 scale-90 rounded-sm border border-zinc-200 bg-zinc-100 px-1 text-[7px] font-bold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-500">
                NO_PREFETCH
              </span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pt-16">
        {/* 实验室大标题 (双色及指示标) */}
        <div className="relative mb-16 border-l-2 border-purple-500/60 pl-6 sm:pl-8">
          <div className="absolute top-0 -left-1.25 h-2 w-2 rounded-full bg-purple-500" />
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
            <span>[ SYSTEM SPECIFICATION REPORT ]</span>
            <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-emerald-500">SYSTEM_READY</span>
          </div>

          <h1 className="font-title text-4xl leading-none font-extrabold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Next.js Internal{' '}
            <span className="relative inline-block bg-linear-to-r from-purple-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-cyan-400">
              Components
            </span>{' '}
            Manual
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            本页集中展示 Next.js 内置核心性能优化组件。标题使用高精显示字体{' '}
            <span className="font-title font-semibold text-zinc-900 dark:text-zinc-100">
              Outfit
            </span>
            ，数据标签与状态文本使用等宽字体{' '}
            <span className="rounded bg-zinc-200/50 px-1 font-mono text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
              Geist Mono
            </span>
            ，实现精密科学的手册排版美学。
          </p>
        </div>

        {/* 1. Image 组件演示 (静态导入) */}
        <section className="lab-panel lab-corners mb-12 overflow-hidden rounded-md border border-zinc-200/80 bg-white/70 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 p-1 font-mono text-[8px] text-zinc-400/60 select-none">
            [ REG_ID // IMG_OPTIMIZER ]
          </div>

          <div className="mb-6 flex flex-col gap-2 border-b border-zinc-200/50 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/40">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded border border-purple-500/20 bg-purple-500/5 text-sm">
                🖼️
              </span>
              <div>
                <h2 className="font-title text-base font-bold text-zinc-900 dark:text-zinc-50">
                  01 // Image 组件
                </h2>
                <p className="font-mono text-[10px] text-zinc-400">NEXT/IMAGE PERFORMANCE LAB</p>
              </div>
            </div>
            <span className="self-start rounded border border-purple-500/20 bg-purple-500/5 px-2.5 py-0.5 font-mono text-xs font-semibold text-purple-700 sm:self-auto dark:text-purple-400">
              import Image from &apos;next/image&apos;
            </span>
          </div>

          <div className="space-y-6">
            {/* Banner 容器：应用圆角以符合现代设计审美 */}
            <div className="relative aspect-video w-full overflow-hidden rounded border border-zinc-200 bg-zinc-100/50 sm:aspect-[2.4/1] dark:border-zinc-800 dark:bg-zinc-950">
              {/* 四角十字标装饰 */}
              <div className="py-0.2 absolute top-2 left-2 z-10 rounded bg-black/40 px-1 font-mono text-[9px] text-white/50 backdrop-blur-xs select-none">
                SYS_PRIORITY_LOAD = TRUE
              </div>
              <Image
                src={heroImg}
                alt="Tech Portal Banner"
                placeholder="blur"
                className="object-cover transition-all duration-750 hover:scale-105"
                priority // 提高首屏大图加载优先级，防止延迟闪烁
              />
            </div>

            <div className="rounded border border-zinc-200/60 bg-zinc-100/30 p-4 font-mono text-xs leading-relaxed text-zinc-600 dark:border-zinc-800/60 dark:bg-zinc-950/20 dark:text-zinc-400">
              <span className="font-bold text-purple-500">ℹ️ PERFORMANCE_DETAILS //</span> Banner
              图片采用静态导入。构建时，Next.js 会自动分析原始宽高以防止布局抖动 (CLS)，并生成轻量级
              Base64 模糊图片用于加载前占位。针对首屏渲染大图，开启{' '}
              <code className="rounded bg-purple-500/5 px-1 font-bold text-purple-600 dark:text-purple-400">
                priority
              </code>{' '}
              规避延迟闪烁。
            </div>

            <div className="border-t border-dashed border-zinc-200 pt-6 dark:border-zinc-800">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded border border-zinc-200 bg-zinc-100/30 p-2 shadow-inner dark:border-zinc-800 dark:bg-zinc-950/30">
                  <Image
                    src="/vercel.svg"
                    alt="Vercel Icon"
                    fill
                    sizes="80px"
                    className="object-contain p-4 dark:invert"
                  />
                  <div className="absolute bottom-0 w-full bg-zinc-200/80 text-center font-mono text-[7px] font-bold text-zinc-500 dark:bg-zinc-900/80">
                    fill = true
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wide text-zinc-800 uppercase dark:text-zinc-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                    绝对定位填充模式 (fill mode)
                  </h4>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    在图片尺寸动态或高度无法预估时，配合父级{' '}
                    <code className="py-0.2 rounded bg-zinc-100 px-1 font-mono text-[11px] text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      relative
                    </code>{' '}
                    容器，使用{' '}
                    <code className="py-0.2 rounded bg-zinc-100 px-1 font-mono text-[11px] text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      fill
                    </code>{' '}
                    自适应，并通过{' '}
                    <code className="py-0.2 rounded bg-zinc-100 px-1 font-mono text-[11px] text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      sizes
                    </code>{' '}
                    参数限制下载尺寸。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Form 组件演示 */}
        <section className="lab-panel lab-corners mb-12 overflow-hidden rounded-md border border-zinc-200/80 bg-white/70 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 p-1 font-mono text-[8px] text-zinc-400/60 select-none">
            [ REG_ID // FORM_ROUTER ]
          </div>

          <div className="mb-6 flex flex-col gap-2 border-b border-zinc-200/50 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/40">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded border border-emerald-500/20 bg-emerald-500/5 text-sm">
                🔍
              </span>
              <div>
                <h2 className="font-title text-base font-bold text-zinc-900 dark:text-zinc-50">
                  02 // Form 组件
                </h2>
                <p className="font-mono text-[10px] text-zinc-400">CLIENT-SIDE ROUTING LAB</p>
              </div>
            </div>
            <span className="self-start rounded border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-0.5 font-mono text-xs font-semibold text-emerald-700 sm:self-auto dark:text-emerald-400">
              import Form from &apos;next/form&apos;
            </span>
          </div>

          <p className="mb-6 font-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            <span className="font-bold text-emerald-500">ℹ️ ROUTER_PREFETCH //</span> 传统 HTML
            表单在提交 GET 时会刷新整页。Next.js 提供的{' '}
            <code className="rounded bg-emerald-500/5 px-1 text-emerald-600 dark:text-emerald-400">
              Form
            </code>{' '}
            组件在前台拦截提交，执行高效的客户端路由跳转。同时，一旦该表单进入可视区域，Next.js
            会自动静默预加载目标地址的路由文件。
          </p>

          <Form
            action="/search"
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <div className="absolute top-3.5 left-3 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <input
                type="text"
                name="query"
                placeholder="键入检索词，例如 'React' 或 'Next'..."
                required
                className="h-11 w-full rounded border border-zinc-200/80 bg-zinc-50/50 pr-10 pl-8 font-mono text-xs tracking-wider text-zinc-900 placeholder-zinc-400 transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-emerald-400 dark:focus:bg-zinc-900"
              />
              <span className="absolute top-3 right-4 rounded border border-zinc-200 bg-zinc-100 px-1 py-0.5 font-mono text-[9px] text-zinc-400/80 select-none dark:border-zinc-800 dark:bg-zinc-900">
                ENTER
              </span>
            </div>
            <button
              type="submit"
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded border border-emerald-600 bg-emerald-600/90 px-6 font-mono text-xs font-bold tracking-wider text-white shadow-sm transition-all hover:bg-emerald-600 active:translate-y-px"
            >
              EXEC_QUERY [检索]
            </button>
          </Form>
        </section>

        {/* 3. Script 组件演示 */}
        <section className="lab-panel lab-corners mb-12 overflow-hidden rounded-md border border-zinc-200/80 bg-white/70 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 p-1 font-mono text-[8px] text-zinc-400/60 select-none">
            [ REG_ID // SCRIPT_MANAGER ]
          </div>

          <div className="mb-6 flex flex-col gap-2 border-b border-zinc-200/50 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800/40">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded border border-amber-500/20 bg-amber-500/5 text-sm">
                ⚡
              </span>
              <div>
                <h2 className="font-title text-base font-bold text-zinc-900 dark:text-zinc-50">
                  03 // Script 组件
                </h2>
                <p className="font-mono text-[10px] text-zinc-400">LAZY LOADING CONTROL PANEL</p>
              </div>
            </div>
            <span className="self-start rounded border border-amber-500/20 bg-amber-500/5 px-2.5 py-0.5 font-mono text-xs font-semibold text-amber-700 sm:self-auto dark:text-amber-400">
              import Script from &apos;next/script&apos;
            </span>
          </div>

          <p className="mb-6 font-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            <span className="font-bold text-amber-500">ℹ️ ASYNC_LIFECYCLE //</span>{' '}
            页面加载了外部脚本 <code>/mock-analytics.js</code>。使用{' '}
            <code className="rounded bg-amber-500/5 px-1 text-amber-600 dark:text-amber-400">
              strategy=&quot;lazyOnload&quot;
            </code>{' '}
            在浏览器空闲时延迟加载非关键统计模块，绑定 <code>onLoad</code>{' '}
            钩子监控完成状态，以进行触发调用。
          </p>

          <div className="flex flex-col items-stretch justify-between gap-5 rounded border border-zinc-200/60 bg-zinc-100/30 p-5 sm:flex-row sm:items-center dark:border-zinc-800/60 dark:bg-zinc-950/20">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs text-zinc-500 uppercase">脚本装载状态：</span>

                {scriptStatus === 'loading' && (
                  <span className="inline-flex animate-pulse items-center gap-1.5 rounded border border-zinc-300 bg-zinc-200/50 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                    <span className="h-1.5 w-1.5 animate-ping rounded-full bg-zinc-400" />
                    PENDING [装载中]
                  </span>
                )}
                {scriptStatus === 'loaded' && (
                  <span className="led-glow-green inline-flex items-center gap-1.5 rounded border border-green-500/20 bg-green-500/5 px-2 py-0.5 font-mono text-[10px] font-semibold text-green-600 dark:text-green-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                    READY [加载就绪]
                  </span>
                )}
                {scriptStatus === 'error' && (
                  <span className="inline-flex items-center gap-1.5 rounded border border-red-500/20 bg-red-500/5 px-2 py-0.5 font-mono text-[10px] font-semibold text-red-600 dark:text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    FAILURE [载入异常]
                  </span>
                )}
              </div>
              <p className="mt-2 font-sans text-xs leading-normal text-zinc-400">
                触发 <code>onLoad</code> 钩子后，挂载在全局 <code>window.mockAnalytics</code>{' '}
                变量上可立即被客户端行为函数安全调用。
              </p>
            </div>

            <button
              onClick={handleTrackClick}
              disabled={scriptStatus !== 'loaded'}
              className="relative flex cursor-pointer items-center justify-center gap-3 overflow-hidden rounded border border-zinc-800 bg-zinc-900 px-5 py-3 font-mono text-xs font-bold tracking-wider text-white uppercase shadow transition-all hover:bg-zinc-800 active:translate-y-px disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-200/50 disabled:text-zinc-400 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:border-zinc-800 dark:disabled:bg-zinc-900/50"
            >
              TRIGGER_ANALYTICS [模拟埋点]
              <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[10px] font-extrabold text-purple-600 dark:text-purple-400">
                {clicks} CLICKS
              </span>
            </button>
          </div>
        </section>

        {/* 4. Link & Font 导航测试 */}
        <section className="lab-panel lab-corners overflow-hidden rounded-md border border-zinc-200/80 bg-white/70 p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/40">
          <div className="absolute top-0 right-0 p-1 font-mono text-[8px] text-zinc-400/60 select-none">
            [ REG_ID // OPT_SUMMARY ]
          </div>

          <h2 className="mb-4 flex items-center gap-2 font-mono text-xs font-bold text-zinc-800 uppercase dark:text-zinc-200">
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            性能与 SEO 优化系统总结 (System Report Summary)
          </h2>

          <div className="grid gap-4 text-xs leading-relaxed text-zinc-600 sm:grid-cols-2 dark:text-zinc-400">
            <div className="rounded border border-zinc-200/60 bg-zinc-100/20 p-4 dark:border-zinc-800/60 dark:bg-zinc-950/10">
              <h4 className="mb-2 flex items-center gap-1.5 font-mono font-bold text-zinc-900 uppercase dark:text-zinc-200">
                <span className="font-bold text-purple-500">[01]</span> Client Navigation
              </h4>
              <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400">
                全站路由切换由 <code>Link</code> 和 <code>Form</code>{' '}
                在客户端渲染层接管，切换时仅拉取路由的差异协议数据，避免任何传统整页重载造成的白屏和重复网络下载。
              </p>
            </div>
            <div className="rounded border border-zinc-200/60 bg-zinc-100/20 p-4 dark:border-zinc-800/60 dark:bg-zinc-950/10">
              <h4 className="mb-2 flex items-center gap-1.5 font-mono font-bold text-zinc-900 uppercase dark:text-zinc-200">
                <span className="font-bold text-cyan-500">[02]</span> Zero CLS Fonts
              </h4>
              <p className="font-sans text-xs text-zinc-500 dark:text-zinc-400">
                使用 <code>next/font/google</code> 的 Outfit/Geist 字体在编译打包阶段直接内嵌在 HTML
                头部输出，规避网络下载字体渲染时产生的页面文本二次抖动 (CLS)。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
