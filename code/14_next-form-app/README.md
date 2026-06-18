# Next.js 渐进式表单与主题演示项目 (Next.js Form Demo)

这是一个基于 **Next.js 16**、**React 19** 和 **Tailwind CSS v4** 的渐进式表单开发和主题管理演示项目。本项目通过五个递进式的方案，展示了现代 Web 应用中表单从原生实现到企业级全栈的最佳演进路线。

---

## 🚀 启动项目 (Getting Started)

首先，在项目根目录下运行开发服务器：

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

使用浏览器打开 [http://localhost:3000](http://localhost:3000) 即可访问项目。

---

## 📋 五种表单模式对比与实现细节

项目内置了五种经典的表单处理方式，由浅入深展示了表单开发模式的演变：

### 1. 传统受控表单 (Traditional Form)
* **路径**: `/traditional`
* **技术实现**: 使用 React 的原生 `useState` 进行状态绑定，并用手写的 `validate()` 函数和 `onSubmit` 做表单校验和拦截。
* **优缺点**:
  * **优点**: 零外部依赖，易于理解表单最底层的运作机理。
  * **缺点**: 字段增加时，样板代码成倍增长；由于是完全受控组件，**用户每次击键输入都会触发整个页面的全量重渲染**，在超大表单场景下会产生明显的性能抖动。

### 2. 基础 React Hook Form (RHF Basic)
* **路径**: `/rhf`
* **技术实现**: 引入 `react-hook-form` 库，通过 `register` 和 `handleSubmit` 托管表单。
* **优缺点**:
  * **优点**: 采用**非受控组件（Uncontrolled Component）**配合 `ref` 的设计，消除了输入过程中的不必要重渲染；内置状态机制（如 `isSubmitting`）大幅减少了状态样板代码。
  * **缺点**: 验证规则以内联方式写在 input 的属性中，不够直观，无法进行复杂的跨字段联合校验，且缺乏类型安全。

### 3. 类型安全模式 (RHF + Zod)
* **路径**: `/rhf-zod`
* **技术实现**: 结合声明式校验库 `Zod` 和 `@hookform/resolvers/zod`。
* **优缺点**:
  * **优点**: **单源信度设计（Single Source of Truth）**。通过 Zod 定义强类型的验证 Schema（`contactFormSchema`），并利用 `z.infer` 自动推导出前端所需的 TypeScript 接口，实现严格的类型安全校验。
  * **缺点**: 属于纯客户端拦截。若用户浏览器禁用 JavaScript，或者遭到恶意请求直连 API 接口，客户端拦截将无能为力。

### 4. 全栈双重校验 (+ Server Actions)
* **路径**: `/rhf-zod-server`
* **技术实现**: 在客户端校验的基础上，利用 Next.js 的 **Server Actions** (`"use server"`) 机制以及 React 19 全新的 `useActionState` 钩子处理服务端提交。
* **优缺点**:
  * **优点**: **全栈闭环校验**。在客户端拦截的同时，服务端利用相同的 Schema 进行二次兜底校验，防范一切越权或篡改攻击。服务端校验通过后执行业务逻辑，若未通过则将格式化后的错误状态回传给前端，在输入框下方高亮显示。

### 5. 生产级体验 (+ Shadcn UI)
* **路径**: `/rhf-zod-shadcn`
* **技术实现**: 集成 `Shadcn UI`（基于 Radix UI 的无障碍组件）。
* **优缺点**:
  * **优点**: 完美的语义化和无障碍体验。`FormField` 自动帮开发者处理了组件的 `aria-describedby`、错误态转换及高亮，提供键盘无障碍导航（A11y）。组件自带精致的平滑微动画，是目前 Next.js 社区的黄金标准方案。

---

## 🎨 主题切换实现机制 (Theme Switch)

本项目不仅包含表单，还搭载了一套高兼容性的主题管理系统：

### 1. 技术底座
使用 `next-themes` 提供底座，将当前的主题状态（`light` / `dark` / `system`）映射为 `html` 节点的 `class="dark"`，进而驱动 Tailwind CSS v4 渲染出对应的颜色和阴影变体。

### 2. 解决浏览器同步痛点：`SystemThemeSync` 组件
系统默认的主题监听在一些特定浏览器（如 Windows 下的 Chrome）或者在浏览器处于后台切换主题时，容易发生 `prefers-color-scheme` 侦听丢失或响应迟缓的问题。
项目在 [components/theme-provider.tsx](file:///d:/ZSP/Study/next-study/code/14_next-form-app/components/theme-provider.tsx) 中专门实现了一个 `SystemThemeSync` 组件：
* **实时媒体查询监听**: 使用 `window.matchMedia` 显式订阅系统颜色偏好变化。
* **多边界情况兜底**: 监听 `visibilitychange`（从设置切回应用）和 `window.focus`（重新激活窗口）事件，在这些关键时间节点自动触发 `next-themes` 强制刷新主题态，确保系统主题切换零延迟。

### 3. 主题切换与防抖：`ThemeToggle` 组件
在 [components/theme-toggle.tsx](file:///d:/ZSP/Study/next-study/code/14_next-form-app/components/theme-toggle.tsx) 中：
* **顺序循环机制**: 点击按钮会在 `浅色 (light) -> 深色 (dark) -> 自动 (system)` 之间单向循环切换，并展示对应的 Lucide 图标。
* **防水合冲突 (Hydration Mismatch)**: 针对 Next.js SSR 特性，页面在服务端渲染时不知道客户端最终的偏好主题，容易造成 HTML 结构不匹配。`ThemeToggle` 内部维护了 `mounted` 挂载状态，在客户端水合完成前只渲染骨架占位，彻底解决了水合报错和闪烁问题。

---

## ⚙️ 近期架构重构说明 (Refactoring Updates)

为了让演示项目更贴近真实的工业级开发，我们对代码进行了重构：

1. **统一前后端 Schema 校验**:
   将校验规则提取至唯一的 [lib/schemas.ts](file:///d:/ZSP/Study/next-study/code/14_next-form-app/lib/schemas.ts)。服务端 Action ([app/actions/submit.ts](file:///d:/ZSP/Study/next-study/code/14_next-form-app/app/actions/submit.ts)) 不再使用手动硬编码校验，而是调用 `contactFormSchema.safeParse`，通过一行代码自动完成解析，并将错误精准映射至字段。
2. **自动状态重置**:
   在 `rhf-zod-server` 和 `rhf-zod-shadcn` 的客户端页面中，利用 `useEffect` 追踪 Server Action 返回的 `state.success` 信号。当服务端提交成功后，客户端会自动触发表单重置（`reset()` / `form.reset()`），清空残留的表单输入，确保用户交互体验连贯顺畅。
