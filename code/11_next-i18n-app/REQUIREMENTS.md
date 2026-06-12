## Next.js i18n 国际化学习项目 — 需求分析

### 项目概述

基于 Next.js 16 (App Router) + next-intl 构建一个多语言学习示范项目，支持中文、英文、日文三种语言切换。项目以"技术文档 / 产品官网"为模拟场景，全面覆盖 Next.js 国际化开发中的核心知识点。

### 技术选型

框架采用 Next.js 16.2.9 + React 19 + TypeScript，i18n 方案使用 next-intl（Next.js 官方首推的国际化库），样式使用 Tailwind CSS v4，所有页面默认使用 React Server Components，客户端组件按需标记 `"use client"`。

### 支持语言

| 语言 | Locale 标识 | 说明 |
|------|------------|------|
| 简体中文 | zh | 默认语言 |
| English | en | 完整翻译 |
| 日本語 | ja | 完整翻译 |

默认语言为中文，访问根路径 `/` 自动重定向到 `/zh`。

### 页面规划

项目包含 4 个页面，各自演示不同的国际化场景：

**首页 `/`** — 演示静态翻译文本、ICU 插值（变量替换）、pluralization（复数规则）、以及富文本翻译（带 HTML 标签的消息）。

**产品页 `/products`** — 演示服务端组件翻译加载、客户端组件翻译（交互按钮）、数字和货币的本地化格式化（如 ¥1,299 vs $179.99）。包含产品列表和产品详情两个视图。

**博客页 `/blog`** — 演示长文本翻译、日期本地化（"2026年6月12日" vs "June 12, 2026"）、以及带参数的路由翻译。包含文章列表和文章详情。

**关于页 `/about`** — 演示团队介绍等结构化内容翻译、国际化日期/数字展示、以及 metadata（页面标题/描述）的多语言 SEO 配置。

### 功能特性清单

**核心 i18n 功能：** 路由前缀方式的多语言 URL（`/zh/...`、`/en/...`、`/ja/...`），基于浏览器 Accept-Language 的自动语言检测，cookie 持久化用户语言偏好，类型安全的翻译 key 引用。

**UI 组件：** 全局导航栏（含响应式移动端菜单）、语言切换器（下拉菜单 + 国旗图标）、暗色/亮色模式切换（带 localStorage 持久化）、面包屑导航、页脚。

**SEO 优化：** 每个页面输出多语言 alternate link 标签（hreflang），动态生成多语言 metadata（title / description），Open Graph 标签的本地化。

**交互体验：** 语言切换时的平滑过渡动画，页面切换时的加载过渡，翻译文本中的 ICU 消息语法演示（变量插值、复数规则、日期时间格式化）。

### 项目结构

```
app/
  [locale]/
    layout.tsx          # 根布局（NextIntlClientProvider、暗色模式）
    page.tsx            # 首页
    products/
      page.tsx          # 产品列表
      [id]/
        page.tsx        # 产品详情
    blog/
      page.tsx          # 博客列表
      [slug]/
        page.tsx        # 文章详情
    about/
      page.tsx          # 关于页
    components/
      Navbar.tsx        # 导航栏
      Footer.tsx        # 页脚
      LocaleSwitcher.tsx# 语言切换器
      ThemeToggle.tsx   # 暗色模式切换
      Breadcrumb.tsx    # 面包屑
src/
  i18n/
    request.ts          # next-intl 请求配置
    routing.ts          # 路由定义
    navigation.ts       # 导航工具（Link, useRouter 等）
  proxy.ts              # 语言检测与重定向
messages/
  zh.json               # 中文翻译
  en.json               # 英文翻译
  ja.json               # 日文翻译
```

### 核心知识点覆盖

通过完成本项目，将系统学习以下 Next.js i18n 核心知识：

1. **App Router 下的 i18n 路由架构** — 动态段 `[locale]` + proxy 重定向
2. **Server Components 翻译** — `getTranslations()` 服务端加载，零客户端 bundle 影响
3. **Client Components 翻译** — `useTranslations()` hook，用于交互式组件
4. **ICU 消息语法** — 变量插值 `{name}`、复数 `{count, plural, ...}`、日期时间格式化
5. **本地化格式化** — `Intl.NumberFormat`、`Intl.DateTimeFormat` 按 locale 格式化
6. **多语言 SEO** — `generateMetadata()` 输出 hreflang、多语言 title/description
7. **静态生成** — `generateStaticParams()` 预渲染所有语言版本
8. **语言持久化** — cookie 存储用户偏好，proxy 读取 cookie 跳过检测
9. **导航工具封装** — 基于 next-intl 的 `createNavigation` 封装 locale-aware Link

### 设计风格

采用现代编辑风格（Editorial / Magazine）的设计方向——大字号标题、留白呼吸感、精致的排版层次。配色以深靛蓝 (#1a1a2e) 为主色调，搭配暖珊瑚色 (#e94560) 作为强调色，支持暗色模式。字体选用 Noto Sans 系列（覆盖中日韩 + 拉丁字符），确保三种语言下的阅读体验。
