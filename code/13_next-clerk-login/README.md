# Next.js 16 + Clerk 身份验证集成指南

本项目是一个基于 **Next.js 16 (App Router)** 和 **Clerk v7** 构建的身份验证门户示例项目。采用 `frontend-design` 规范构建了高阶的、体验良好的暗黑极简科技风 UI 界面。

---

## 🚀 Clerk 核心集成与使用步骤

### 1. 安装依赖

首先，在 Next.js 项目中安装 Clerk 官方 SDK：

```bash
pnpm add @clerk/nextjs
```

### 2. 配置环境变量 `.env.local`

在项目根目录下创建 [.env.local](file:///d:/ZSP/Study/next-study/code/13_next-clerk-login/.env.local) 并配置你从 Clerk 得到的 Key，以及本项目的认证路由回退规则：

```env
# Clerk 凭证 (来自 Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# 自定义认证页面路径
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# 登录/注册成功后的重定向路径（默认回退主页）
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

### 3. 全局包裹 `ClerkProvider`

在根布局 [app/layout.tsx](file:///d:/ZSP/Study/next-study/code/13_next-clerk-login/app/layout.tsx) 中引入 `ClerkProvider`，将子组件包裹起来，以启用全局的 Auth Context：

```tsx
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
```

### 4. 配置 Next.js 16 代理中间件 `proxy.ts`

> [!NOTE]
> 在 Next.js 15 及更早版本中，中间件文件名需为 `middleware.ts`。在 **Next.js 16** 中，为了更好对应其请求拦截及代理的角色，官方将其命名规范变更为 **`proxy.ts`**。

在根目录下创建 [proxy.ts](file:///d:/ZSP/Study/next-study/code/13_next-clerk-login/proxy.ts) 接管请求拦截，设置受保护的路由与公开路由（Public Routes）：

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 将主页、登录页、注册页设为公开可访问路由
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect(); // 拦截非法访问，强制重定向至登录页
  }
});

export const config = {
  matcher: [
    // 忽略 Next.js 静态文件与图片资源
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // 强制对 API 路由进行拦截
    '/(api|trpc)(.*)',
  ],
};
```

### 5. 自定义注册与登录页面 (Catch-All Routes)

Clerk 允许你将登录/注册表单直接内嵌在自己的 Next.js 路由中。通过 App Router 的可选捕获组（Optional Catch-All Routes）配置：

- 创建 [app/sign-in/[[...sign-in]]/page.tsx](file:///d:/ZSP/Study/next-study/code/13_next-clerk-login/app/sign-in/%5B%5B...sign-in%5D%5D/page.tsx) 挂载 `<SignIn />` 组件。
- 创建 [app/sign-up/[[...sign-up]]/page.tsx](file:///d:/ZSP/Study/next-study/code/13_next-clerk-login/app/sign-up/%5B%5B...sign-up%5D%5D/page.tsx) 挂载 `<SignUp />` 组件。

### 6. 在页面中读取登录态 (Client-side / Server-side)

#### 客户端组件 (Client Component)

使用 `"use client"`，配合 `useUser()` 和 `useAuth()` 钩子：

```tsx
'use client';

import { useUser, useAuth, UserButton } from '@clerk/nextjs';

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { sessionId, userId } = useAuth();

  if (!isLoaded) return <div>加载中...</div>;

  return isSignedIn ? (
    <div>
      <p>你好，{user.fullName}</p>
      <UserButton />
    </div>
  ) : (
    <p>请先登录</p>
  );
}
```

#### 服务端组件 (Server Component)

直接在异步服务端组件中使用 `auth()` 和 `currentUser()` 安全地读取会话：

```tsx
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <div>
      <h1>服务端渲染数据</h1>
      <p>User ID: {userId}</p>
      <p>用户名: {user?.firstName}</p>
    </div>
  );
}
```

---

## ⚠️ 本地开发常见问题与避坑指南 (Troubleshooting)

### 问题 1：国内网络下登录/注册加载转圈，提示 Turnstile 报错

- **现象**：点击登录按钮后，弹窗一直处于白屏加载状态，浏览器控制台打印 `net::ERR_CONNECTION_CLOSED` (请求 `challenges.cloudflare.com` 失败)。
- **原因**：Clerk 默认启用了 Cloudflare Turnstile 防机器人验证，其脚本在中国大陆部分网络环境下无法正常加载。
- **解决办法**：
  1. 开启本地网络代理代理该域名。
  2. **在开发环境关闭人机检测**：登录 [Clerk Dashboard](https://dashboard.clerk.com/) -> 选择项目 -> 点击左侧 **Security** -> 找到 **Bot Detection** -> 将 **Turnstile** 功能**关闭**。

### 问题 2：登录后头像加载失败并报 `Invalid src prop` (400 Bad Request)

- **现象**：登录成功后控制台报错 `Invalid src prop (https://img.clerk.com) on 'next/image'`，且在 Terminal 中打印 `upstream image resolved to private ip`。
- **原因**：
  1. Next.js 限制了外部图片域名白名单。
  2. 当本地使用代理（如 Clash TUN 模式 / Fake-IP 模式）时，Next.js 服务端进行 `img.clerk.com` 的 DNS 解析时会返回一个本地保留的 Fake-IP（如 `198.18.x.x`）。Next.js 安全机制（防 SSRF）会直接封禁此类私有 IP 请求。
- **解决办法**：
  1. 在 [next.config.ts](file:///d:/ZSP/Study/next-study/code/13_next-clerk-login/next.config.ts) 中配置 `remotePatterns` 授信域名：
     ```typescript
     const nextConfig = {
       images: {
         remotePatterns: [{ protocol: 'https', hostname: 'img.clerk.com' }],
       },
     };
     ```
  2. 在 `<Image />` 组件上添加 **`unoptimized`** 属性，迫使图片由客户端浏览器直接向 Clerk 请求，不经过 Next.js 服务端代理：
     ```tsx
     <Image
       src={user.imageUrl}
       alt="Avatar"
       width={44}
       height={44}
       unoptimized
     />
     ```

---

## 🛠️ 项目运行与构建

运行开发服务器：

```bash
pnpm run dev
```

构建生产环境版本：

```bash
pnpm run build
```
