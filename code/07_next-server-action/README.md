# 🚀 Next.js Server Actions 核心教程与最佳实践

本目录为 `07_next-server-action` 示例项目，通过构建一个**暗黑玻璃拟物化留言板 (Guestbook)** 完整地演示了 **Server Actions** 的设计模式与核心知识点。

---

## 📖 Server Actions 深度技术讲解

### 1. 常见搭配 Server Actions 使用的 API 和库

编写现代 Next.js 应用程序时，通常将 Server Actions 与以下核心 API/库搭配使用：

| API / 库              | 所属环境                   | 主要用途                                                                                         |
| :-------------------- | :------------------------- | :----------------------------------------------------------------------------------------------- |
| **`useActionState`**  | React 19 (Client)          | 表单状态管理的基石，绑定 Action 并接收服务端返回的验证错误、提交状态等。                         |
| **`useFormStatus`**   | React 19 (Client)          | 用于嵌套的子组件中，无须通过 Props 传参，直接读取父级表单的 `pending` 状态（加载中/非加载中）。  |
| **`useOptimistic`**   | React 19 (Client)          | 用于实现乐观更新（Optimistic UI），在请求还没响应前，先让界面“假装”成功。                        |
| **`zod`**             | 外部依赖库 (Server/Client) | 强类型数据 schema 校验，在服务端进行表单字段数据清洗与安全过滤。                                 |
| **`next/headers`**    | Next.js (Server)           | 提供 `cookies()` 和 `headers()` 接口以读写 Cookie 并获取 Headers 数据（如 `User-Agent`、`IP`）。 |
| **`next/navigation`** | Next.js (Server/Client)    | 提供 `redirect()` 和 `notFound()`，在 Action 完毕后做服务器端硬跳转或 404 定位。                 |
| **`next/cache`**      | Next.js (Server)           | 提供 `revalidatePath()` 和 `revalidateTag()` 用于按路径或标签使数据缓存失效，触发页面刷新。      |

---

### 2. 核心模式的实现方式

#### 💡 如何获取 Cookies 与 Headers 等数据？

在带有 `"use server"` 的函数内部，可直接调用 `cookies()` 和 `headers()`。

> [!IMPORTANT]
> 在 **Next.js 15+ 和 Next.js 16** 中，`cookies()` 和 `headers()` 已转变为**异步**方法，必须使用 `await` 进行调用。

```typescript
import { cookies, headers } from 'next/headers';

export async function myAction() {
  const cookieStore = await cookies();
  const headersList = await headers();

  const token = cookieStore.get('session_token')?.value;
  const userAgent = headersList.get('user-agent');
}
```

#### 💡 错误处理（Error Handling）的最佳实践

1. **防止敏感信息泄漏**：当 Server Action 内部发生未捕获的常规 `throw new Error()` 时，Next.js 在生产环境中会自动屏蔽具体的错误堆栈，将其转化为通用的 `500 Internal Server Error` 以防代码逻辑或数据库结构泄露。
2. **结构化业务错误返回**：为了将预期的业务错误（例如：字段验证失败、频控触发）平滑渲染给用户，我们**不应直接 throw**，而是应当像 API 响应一样返回一个包含错误信息的结构化 JSON 对象。

```typescript
export async function addCommentAction(prevState: any, formData: FormData) {
  try {
    // 预期内的业务校验失败
    if (!name) {
      return { success: false, errors: { name: ['姓名不能为空'] } };
    }
  } catch (err) {
    // 预期外的系统级错误
    return { success: false, errors: { form: ['系统开小差了，请稍后再试'] } };
  }
}
```

#### 💡 重定向（Redirect）的底层逻辑与避坑指南

在 Server Action 中可以通过调用 `redirect(path)` 立即将用户重定向到另一个页面。

> [!CAUTION]
> `redirect()` 的底层逻辑是**抛出一个特定的 Next.js 内部重定向路由 Error**（`NEXT_REDIRECT`）。如果我们将 `redirect()` 裹在常规的 `try...catch` 语句内，该错误会被 `catch` 吞掉，从而导致重定向失效。
>
> **正确做法**：在 `try...catch` 外部执行重定向，或者在 `catch` 里识别并重新抛出它。

```typescript
// ✅ 正确做法示例：
export async function addCommentAction(prevState: any, formData: FormData) {
  let shouldRedirect = false;
  try {
    // 写入数据库...
    shouldRedirect = true;
  } catch (error) {
    return { success: false, errors: { form: ['保存失败'] } };
  }

  // 必须在 try-catch 块外部调用
  if (shouldRedirect) {
    redirect('/admin');
  }
}
```

#### 💡 如何进行乐观更新（Optimistic Updates）？

React 19 的 `useOptimistic` hook 能显著提升用户交互体验。它的核心流向如下：

1. 页面声明客户端容器组件，接收服务端获取的 `initialData`。
2. 使用 `const [optimisticState, addOptimistic] = useOptimistic(initialData, (currentState, optimisticValue) => { ... })`。
3. 表单提交时，先调用 `addOptimistic(newValue)` 立即在前端渲染假数据（通常会加上 `isPending: true` 的视觉效果）。
4. 调用 Server Action，等待服务端持久化完毕。
5. 一旦 Action 完成，Next.js 会自动将页面数据拉新，`useOptimistic` 内部检测到 `initialData` 更新后，会自动丢弃之前的临时假数据，无缝切换为最新的服务端真实数据。如果 Action 报错，假数据也会被自动回滚，界面恢复原状。

---

### 3. 表单等待状态与 Zod 服务端验证

#### 💡 获取表单提交的等待状态

在 React 19 中，我们拥有两种方式感知等待状态：

1. **`useFormStatus` (推荐子组件提取)**：
   - 可以解构出 `{ pending, data, method, action }`。
   - **使用限制**：必须在 `<form>` **内部**的子组件中调用。如果在包裹 `<form>` 标签的同一级组件中调用，则永远无法监听到 `pending` 状态。
2. **`useActionState` (父组件监听)**：
   - 它的第三个返回值直接就是 `isPending`，可在包含 `<form>` 的当前级组件直接使用。

#### 💡 Zod 字段验证

我们在 Action 内部使用 `safeParse` 对 `FormData` 提取出的普通对象进行校验。

```typescript
import { z } from 'zod';

const mySchema = z.object({
  email: z.string().email('无效邮箱'),
});

export async function action(prevState: any, formData: FormData) {
  const result = mySchema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    // result.error.flatten().fieldErrors 将返回类似 { email: ["无效邮箱"] } 的键值对
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
}
```

---

## ⚠️ 写一个 Server Actions 的注意事项有哪些？

1. **安全第一：Server Action 本质是公开的 POST 接口**
   - 每一个使用 `export async function` 导出的带有 `"use server"` 的 Action，编译后都会被 Next.js 打包公开为一个**唯一的 HTTP POST 接口**（形如 `http://localhost:3000/?_rsc=...`）。
   - **绝对不要假定这些函数只能被前端表单点击触发**！恶意用户可以用 Postman 直接构造请求。
   - **铁律**：在 Action 内部必须像编写传统 API 接口一样进行**身份鉴权（Authentication）、越权检查（Authorization）以及 Zod 数据校验**。
2. **参数与返回值必须可序列化 (Serializable)**
   - 传输的数据需要通过网络传输（JSON 化），因此参数和返回值**不能**包含 Promise、React Element、类实例、函数或非标准的 JS 对象。
3. **不要把敏感数据暴露在 Action 的参数中**
   - 如果你在客户端把用户的密码或敏感 ID 作为 Hidden Input 参数传给 Action，会有被嗅探和篡改的安全隐患。
4. **配合缓存失效**
   - 服务端数据变动后，记得配合 `revalidatePath` 或 `revalidateTag` 强制让 CDN / 客户端路由缓存失效，否则页面不会刷新为最新数据。

---

## 🚀 留言板示例运行与代码索引

你可以在本地通过 `pnpm run dev` 运行本项目并亲自体验：

- 📂 **模拟数据库**：[`app/lib/db.ts`](./app/lib/db.ts)（使用文件存储留言）
- 📂 **服务端 Action**：[`app/actions/guestbook.ts`](./app/actions/guestbook.ts)（核心 Action，包含 Zod，Cookies，Headers，重定向，频控，缓存刷新）
- 📂 **乐观更新绑定容器**：[`app/components/GuestbookContainer.tsx`](./app/components/GuestbookContainer.tsx)（使用 `useOptimistic`）
- 📂 **表单状态与错误提示**：[`app/components/CommentForm.tsx`](./app/components/CommentForm.tsx)（使用 `useActionState`）
- 📂 **等待状态**：[`app/components/SubmitButton.tsx`](./app/components/SubmitButton.tsx)（使用 `useFormStatus`）
- 📂 **重定向演示页面**：[`app/admin/page.tsx`](./app/admin/page.tsx)
- 📂 **主页面**：[`app/page.tsx`](./app/page.tsx)（服务端渲染初次拉取数据）
