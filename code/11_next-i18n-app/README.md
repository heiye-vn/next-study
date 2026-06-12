# Next.js i18n 国际化学习项目

基于 Next.js 16 (App Router) + [next-intl](https://next-intl.dev) 构建的多语言示范项目，支持简体中文、English、日本語三种语言。

## 快速开始

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)，会根据浏览器语言自动跳转到对应的语言版本。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 16.2.9 | App Router 模式 |
| React | 19.2.4 | Server Components 优先 |
| next-intl | 4.x | 国际化核心库 |
| Tailwind CSS | 4.x | CSS-first 配置（无 tailwind.config） |
| TypeScript | 5.x | 严格模式 |

## 项目结构

```
app/
  [locale]/                   # 动态路由段，捕获语言参数
    layout.tsx                # 根布局：加载翻译、注入 Provider
    page.tsx                  # 首页：翻译插值、ICU 语法演示
    ClientProvider.tsx        # 客户端 Provider + 暗色模式管理
    components/
      Navbar.tsx              # 导航栏（响应式）
      LocaleSwitcher.tsx      # 语言切换器（下拉菜单）
      Footer.tsx              # 页脚
      Breadcrumb.tsx          # 面包屑导航
    products/
      page.tsx                # 产品列表：货币本地化
      [id]/
        page.tsx              # 产品详情：服务端组件翻译
        AddToCartButton.tsx   # 加入购物车按钮：客户端组件翻译
    blog/
      page.tsx                # 博客列表：日期本地化
      [slug]/
        page.tsx              # 文章详情：长文本翻译
    about/
      page.tsx                # 关于页：结构化内容翻译
i18n/
  routing.ts                  # 定义支持的语言列表和默认语言
  request.ts                  # 请求级配置：加载翻译文件、设置时区
  navigation.ts               # 封装 locale-aware 导航工具
messages/
  zh.json                     # 中文翻译
  en.json                     # 英文翻译
  ja.json                     # 日文翻译
proxy.ts                      # 语言检测与自动重定向（Next.js 16 新规范）
```

## 国际化方案核心架构

### 1. 路由策略：URL 前缀

采用路径前缀方式区分语言版本，每种语言拥有独立的 URL：

```
/zh/products    → 中文产品页
/en/products    → 英文产品页
/ja/products    → 日文产品页
/               → 自动重定向到匹配的语言版本
```

通过 `app/[locale]/` 这个动态路由段实现，Next.js 自动将 URL 中的第一段（如 `zh`、`en`）捕获为 `locale` 参数。

### 2. 语言检测与重定向：Proxy

`proxy.ts`（Next.js 16 中替代了原来的 `middleware.ts`）负责处理首次访问的语言检测：

```
用户访问 /
  → proxy 读取 Accept-Language 请求头
  → 匹配支持的语言列表
  → 重定向到 /zh、/en 或 /ja
```

next-intl 的 `createMiddleware` 还内置了 cookie 记忆功能——用户切换语言后，偏好会被存储到 `NEXT_LOCALE` cookie，后续访问直接跳转。

### 3. 翻译加载机制

```
i18n/request.ts（请求配置）
  ↓ 根据 locale 参数
动态 import(`messages/${locale}.json`)
  ↓
layout.tsx 中通过 getMessages() 获取
  ↓
<NextIntlClientProvider> 注入到客户端组件树
```

翻译文件只在服务端加载，不会全量打入客户端 bundle。Server Components 通过 `getTranslations()` 直接读取，Client Components 通过 Provider 上下文访问。

### 4. Server Components vs Client Components

这是 next-intl 中最重要的区分：

**Server Components**（默认，无需标注）：
```tsx
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("products");
  return <h1>{t("title")}</h1>;
}
```

翻译在服务端完成，HTML 直接包含翻译后的文本，零客户端 JS 开销。

**Client Components**（需要 `"use client"`）：
```tsx
"use client";
import { useTranslations } from "next-intl";

export default function Button() {
  const t = useTranslations("products.detail");
  return <button>{t("addToCart")}</button>;
}
```

翻译数据通过 Provider 传递到客户端，适用于需要交互的组件。

### 5. ICU 消息语法

翻译文件中使用了 ICU 语法来处理动态内容：

**变量插值：**
```json
"greeting": "你好，{name}！欢迎来到我们的网站。"
```
```tsx
t("greeting", { name: "Developer" })  // → "你好，Developer！欢迎来到我们的网站。"
```

**复数规则（pluralization）：**
```json
"items": "你有 {count, plural, =0 {没有消息} =1 {一条消息} other {# 条消息}}。"
```
```tsx
t("items", { count: 0 })   // → "你有 没有消息。"
t("items", { count: 1 })   // → "你有 一条消息。"
t("items", { count: 42 })  // → "你有 42 条消息。"
```

不同语言的复数规则不同（如日语没有复数形式，阿拉伯语有 6 种），ICU 语法自动处理这些差异。

### 6. 本地化格式化

通过 `getFormatter()` 实现数字、货币、日期的本地化显示：

```tsx
const format = await getFormatter();

// 货币格式化（自动适配 locale）
format.number(8999, { style: "currency", currency: "CNY" })
// zh → "¥8,999.00"    en → "CN¥8,999.00"    ja → "￥8,999"

// 日期格式化
format.dateTime(new Date(), { year: "numeric", month: "long", day: "numeric" })
// zh → "2026年6月12日"  en → "June 12, 2026"  ja → "2026年6月12日"
```

### 7. 多语言 SEO

每个页面通过 `generateMetadata()` 导出本地化的 meta 信息：

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}
```

### 8. 静态生成

`layout.tsx` 中的 `generateStaticParams()` 预渲染所有语言版本：

```tsx
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
// 生成: [{ locale: "zh" }, { locale: "en" }, { locale: "ja" }]
```

构建时会为每个语言 × 每个页面的组合生成静态 HTML。

### 9. 导航工具封装

`i18n/navigation.ts` 基于 next-intl 的 `createNavigation` 封装了一套 locale-aware 的导航 API：

```tsx
import { Link, useRouter, usePathname } from "@/i18n/navigation";

// Link 自动添加语言前缀
<Link href="/about">    // 渲染为 <a href="/zh/about">

// useRouter 自动保持当前语言
router.push("/products") // 跳转到 /zh/products

// usePathname 返回不含语言前缀的路径
usePathname()            // 返回 "/" 而不是 "/zh/"
```

### 10. 语言切换

`LocaleSwitcher` 组件实现了带国旗图标的下拉菜单，切换时调用 `router.replace(pathname, { locale })` 保持当前页面路径不变，仅替换语言前缀。

## 知识点速查表

| 知识点 | 涉及文件 | 说明 |
|--------|----------|------|
| 动态路由段 | `app/[locale]/` | URL 中捕获语言参数 |
| Proxy 重定向 | `proxy.ts` | 替代 Next.js 15 的 middleware |
| 翻译加载 | `i18n/request.ts` | 按 locale 动态 import JSON |
| 服务端翻译 | 各 `page.tsx` | `getTranslations()` |
| 客户端翻译 | `AddToCartButton.tsx` | `useTranslations()` |
| ICU 语法 | `messages/*.json` + 首页 | 插值、复数、格式化 |
| 货币格式化 | `products/page.tsx` | `format.number()` |
| 日期格式化 | `blog/page.tsx` | `format.dateTime()` |
| SEO 元数据 | 各 `page.tsx` | `generateMetadata()` |
| 静态生成 | `layout.tsx` | `generateStaticParams()` |
| 语言切换 | `LocaleSwitcher.tsx` | `router.replace()` + cookie |
| 暗色模式 | `ClientProvider.tsx` | cookie 持久化 + class 切换 |
