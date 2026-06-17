'use client';

import Image from 'next/image';
import { useState } from 'react';
import { UserButton, SignInButton, SignUpButton, useUser, useAuth } from '@clerk/nextjs';

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { sessionId, userId } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. 加载中状态骨架屏 (Skeleton Loading State)
  if (!isLoaded) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] font-sans">
        {/* 背景光晕 */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="z-10 flex flex-col items-center gap-6">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-2 border-purple-500/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-t-purple-500" />
          </div>
          <p className="animate-pulse text-sm font-medium tracking-widest text-zinc-500 uppercase">
            Initializing secure portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#09090b] font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* 复杂的背景光晕与网格背景 */}
      <div className="bg-size[4rem_4rem] pointer-events-none absolute inset-0 top-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.07]" />
      <div
        className="pointer-events-none absolute top-[-10%] left-[-10%] h-150 w-150 animate-pulse rounded-full bg-cyan-500/10 blur-[140px]"
        style={{ animationDuration: '8s' }}
      />
      <div
        className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-150 w-150 animate-pulse rounded-full bg-purple-500/10 blur-[140px]"
        style={{ animationDuration: '12s' }}
      />

      {/* 顶部导航栏 (Glassmorphic Header) */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-[#09090b]/60 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="group flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-px shadow-lg shadow-purple-900/20 transition-transform duration-300 group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-zinc-950">
                <svg
                  className="h-5 w-5 text-purple-400 transition-colors group-hover:text-cyan-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <span className="bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-lg font-semibold tracking-tight text-transparent transition-colors group-hover:from-purple-200 group-hover:to-cyan-200">
              ClerkNexus
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              GitHub
            </a>
            <div className="h-4 w-px bg-zinc-800" />

            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <span className="rounded-full border border-emerald-500/10 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                  已安全连接
                </span>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox:
                        'w-9 h-9 border border-zinc-800 rounded-lg hover:border-purple-500 transition-all shadow-md shadow-black/50',
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="rounded-xl border border-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:bg-zinc-900/60 hover:text-white">
                    登录
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-xl border border-purple-500/20 bg-linear-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-950/30 transition-all hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98]">
                    开启免费注册
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 主体内容 (Main Workspace) */}
      <main className="z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 py-12">
        {isSignedIn ? (
          /* 已登录状态：仪表盘 (Dashboard Panel) */
          <div className="animate-fade-in space-y-10">
            {/* 欢迎卡片 */}
            <div className="relative overflow-hidden rounded-3xl border border-zinc-900 bg-linear-to-b from-zinc-900/50 to-zinc-950/80 p-8 backdrop-blur-md md:p-10">
              <div className="pointer-events-none absolute top-0 right-0 h-75 w-75 rounded-full bg-purple-500/5 blur-[80px]" />
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <h1 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                    欢迎回来，{' '}
                    <span className="bg-linear-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                      {user?.firstName || user?.username || '探索者'}
                    </span>{' '}
                    👋
                  </h1>
                  <p className="max-w-xl text-sm text-zinc-400 md:text-base">
                    您的 Clerk 身份会话已成功建立。以下是提取自 JWT 和 Clerk Context
                    的实时安全数据。
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCopy(sessionId || '')}
                    className="group flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-800 active:scale-95"
                  >
                    <svg
                      className="h-3.5 w-3.5 text-zinc-400 transition-colors group-hover:text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                    {copied ? '已复制会话' : '复制会话 ID'}
                  </button>
                </div>
              </div>
            </div>

            {/* 三栏网格卡片 */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* 卡片 1: 个人属性档案 */}
              <div className="flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 transition-all duration-300 hover:border-zinc-800">
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl border border-purple-500/10 bg-purple-500/10 p-2.5 text-purple-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-base font-semibold text-zinc-200">用户安全属性</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 rounded-xl border border-zinc-900/50 bg-zinc-900/30 p-3">
                      {user?.imageUrl && (
                        <Image
                          src={user.imageUrl}
                          alt="Avatar"
                          width={44}
                          height={44}
                          className="rounded-lg border border-zinc-800"
                          unoptimized
                        />
                      )}
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {user?.fullName || '未设置姓名'}
                        </div>
                        <div className="text-xs text-zinc-500">
                          {user?.primaryEmailAddress?.emailAddress}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-xs text-zinc-400">
                      <div className="flex justify-between border-b border-zinc-900 py-1.5">
                        <span className="text-zinc-500">外部关联</span>
                        <span className="font-mono text-zinc-300">
                          {user?.externalAccounts.map((acc) => acc.provider).join(', ') || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-900 py-1.5">
                        <span className="text-zinc-500">注册时间</span>
                        <span className="text-zinc-300">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-zinc-500">二次验证 (2FA)</span>
                        <span
                          className={`font-semibold ${user?.twoFactorEnabled ? 'text-emerald-400' : 'text-zinc-500'}`}
                        >
                          {user?.twoFactorEnabled ? '已启用' : '未开启'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 卡片 2: 会话及 JWT 监控 */}
              <div className="flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 transition-all duration-300 hover:border-zinc-800">
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl border border-cyan-500/10 bg-cyan-500/10 p-2.5 text-cyan-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-base font-semibold text-zinc-200">会话监测面板</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3 rounded-xl border border-zinc-900/80 bg-zinc-900/20 p-4 font-mono text-[11px] leading-relaxed break-all">
                      <div>
                        <span className="text-cyan-500">USER_ID:</span>
                        <p className="mt-1 text-zinc-300 select-all">{userId}</p>
                      </div>
                      <div className="border-t border-zinc-900 pt-2.5">
                        <span className="text-cyan-500">SESSION_ID:</span>
                        <p className="mt-1 text-zinc-300 select-all">{sessionId}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-1 text-xs">
                      <span className="text-zinc-500">验证协议</span>
                      <span className="font-mono text-zinc-300">JWT / HTTPS Cookies</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 卡片 3: 开发与集成代码 */}
              <div className="flex flex-col justify-between rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 transition-all duration-300 hover:border-zinc-800">
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/10 p-2.5 text-indigo-400">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <h2 className="text-base font-semibold text-zinc-200">Next.js 服务端集成</h2>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs leading-relaxed text-zinc-400">
                      你可以直接在 Server Component 或 Route Handler 中利用安全 API 读取数据：
                    </p>
                    <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-3.5 font-mono text-[11px] leading-normal text-zinc-400">
                      <span className="text-purple-400">import</span> &#123; auth, currentUser
                      &#125; <span className="text-purple-400">from</span>{' '}
                      <span className="text-emerald-400">"@clerk/nextjs/server"</span>;
                      <br />
                      <br />
                      <span className="text-zinc-500">// 在 Server Component 中：</span>
                      <br />
                      <span className="text-purple-400">const</span> &#123; userId &#125; ={' '}
                      <span className="text-purple-400">await</span> auth();
                      <br />
                      <span className="text-purple-400">const</span> user ={' '}
                      <span className="text-purple-400">await</span> currentUser();
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* 未登录状态：炫酷落地页 (Landing Showcase) */
          <div className="animate-fade-in mx-auto max-w-4xl space-y-12 py-12 text-center">
            {/* 徽标 / 标签 */}
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 text-xs font-semibold tracking-wider text-purple-300 uppercase">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-purple-400" />
              基于 Next.js 16 + Clerk v7 构建
            </div>

            {/* 广告语 */}
            <div className="space-y-6">
              <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-6xl">
                为全栈项目打造的
                <br />
                <span className="bg-linear-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  极致身份验证门户
                </span>
              </h1>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                无需繁琐的数据库配置和 JWT 逻辑。几行代码，即可在 Next.js App Router
                中接入顶级的账号安全保障与精美 UI。
              </p>
            </div>

            {/* 卡片式的呼吁操作 */}
            <div className="group relative mx-auto max-w-sm rounded-2xl bg-linear-to-br from-zinc-800 via-zinc-900 to-zinc-800 p-px shadow-2xl">
              <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-purple-500 to-indigo-500 opacity-15 blur-md transition-opacity group-hover:opacity-25" />
              <div className="relative rounded-[15px] bg-zinc-950 p-6">
                <h3 className="mb-2 font-semibold text-zinc-200">欢迎体验安全认证网关</h3>
                <p className="mb-6 text-xs leading-relaxed text-zinc-500">
                  选择以下入口进入测试。支持 GitHub 社交登录、多因素验证等。
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <SignInButton mode="modal">
                    <button className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition-all hover:bg-zinc-800/80 active:scale-[0.98]">
                      安全登录
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98]">
                      创建新账号
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </div>

            {/* 特性栅格介绍 (Feature Cards) */}
            <div className="grid grid-cols-1 gap-6 pt-12 text-left md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-950/40">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/10 bg-purple-500/10 text-purple-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 font-semibold text-zinc-200">安全代理网关保护</h4>
                <p className="text-xs leading-relaxed text-zinc-500">
                  通过根目录 proxy.ts 接管 Next.js 请求代理，对敏感路由实施毫秒级的 JWT 校验。
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-950/40">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/10 bg-cyan-500/10 text-cyan-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 font-semibold text-zinc-200">全功能身份控制台</h4>
                <p className="text-xs leading-relaxed text-zinc-500">
                  包含完整的 SignIn 与 SignUp 模块化挂载，无需自行设计繁复的登录表单和错误提示逻辑。
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/20 p-6 transition-all hover:border-zinc-800 hover:bg-zinc-950/40">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/10 bg-indigo-500/10 text-indigo-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h4 className="mb-2 font-semibold text-zinc-200">即开即用的高吞吐性能</h4>
                <p className="text-xs leading-relaxed text-zinc-500">
                  配合 Next.js Edge 边缘网络和 Clerk 缓存，让登录和鉴权体验如同静态页面一样飞速。
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部版权信息 (Footer) */}
      <footer className="border-t border-zinc-900 bg-[#09090b] py-6 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} ClerkNexus. Powered by Next.js 16 and Clerk.
      </footer>
    </div>
  );
}
