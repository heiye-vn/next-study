# Next.js 16.x 数据获取、缓存与重新验证实战指南

本项目是基于 **Next.js 16.2.7 (React 19)** 构建的交互式数据获取与缓存演示系统。旨在通过可视化的方式直观展现 Next.js 核心的缓存状态管理（Data Cache）与重新验证机制。

---

## 🛠️ 项目演示结构

- **[主页/中控台](./app/page.tsx)**：汇总 4 种缓存场景的技术特性，提供直观的指标矩阵对比。
- **[动态不缓存](./app/demo-no-cache/page.tsx)**：演示 `no-store` 请求，展示高频更新的动态数据行为。
- **[强静态缓存](./app/demo-force-cache/page.tsx)**：演示 `force-cache` 请求，体验毫秒级响应的数据持久化。
- **[时间重验证](./app/demo-time-revalidate/page.tsx)**：演示 `revalidate: 10`，解析 Stale-While-Revalidate (SWR) 双异步机制。
- **[按需重验证](./demo-on-demand/page.tsx)**：演示 `tags: ['time-data']`，体验结合 Server Action 瞬间驱逐缓存的交互。
- **[API 时间路由](./app/api/time/route.ts)**：后端高精度时间数据生成器，模拟 200~500ms 延迟以增强前台缓存体验。

---

## 💡 Next.js 16.x 核心缓存与获取机制知识库

### 1. 默认数据获取行为的重大变更 (Data Fetching Defaults)

- **默认不缓存**：在 Next.js 15/16 中，在 Server Component 内发起 `fetch` 请求时，默认的缓存策略为 `no-store`（即不缓存）。而 Next.js 14 的默认行为是永久缓存（`force-cache`）。
- **异步 Server API**：所有与请求相关的上下文 API（如 `headers()`、`cookies()` 以及页面组件的 `params`、`searchParams`）现在都是**异步 Promise**，读取前必须显式执行 `await`。

### 2. 强静态缓存 (Static Data Cache)

- **配置方式**：
  ```typescript
  fetch(url, { cache: 'force-cache' });
  ```
- **原理解析**：Next.js 将抓取结果固化于服务端的本地硬盘中。任何后续对同一资源的 fetch 请求均会拦截并瞬间返回缓存，消耗耗时接近 `0ms`。
- **适用**：商品规格库、非敏感系统配置、静态公共文本。

### 3. 基于时间的重新验证 (Time-based Revalidation)

- **配置方式**：
  ```typescript
  fetch(url, { next: { revalidate: 10 } }); // 缓存 10 秒
  ```
- **SWR（Stale-While-Revalidate）双异步响应机制**：
  1. 在设定的有效时间内（如 10 秒内），访问该数据直接命中缓存，瞬间返回，数据不变。
  2. 超过有效期后访问（**首次刷新**）：Next.js **不会**阻塞本次渲染，而是**直接返回过期的旧数据**（Stale），同时在后台发起 fetch 以静默刷新 Data Cache。
  3. 再次访问（**二次刷新**）：此时后台已更新成功，用户看到最新数据。

### 4. 按需手动重新验证 (On-demand Revalidation)

- **配置方式**：
  ```typescript
  // 1. 发起请求并绑定标签
  fetch(url, { next: { tags: ['time-data'] } });
  ```
- **清除机制**：在服务端（如 Server Action、API Route 中）调用 Next.js 的缓存清除 API：

  ```typescript
  'use server';
  import { revalidateTag, revalidatePath } from 'next/cache';

  // 按 Tag 清除
  await revalidateTag('time-data');
  // 或按 URL 路由路径清除
  await revalidatePath('/demo-on-demand');
  ```

- **效果**：执行后，与对应 Tag 或 Path 绑定的所有 Data Cache 均会被瞬间驱逐并失效。下次页面重载（配合客户端组件的 `router.refresh()`）即可渲染并同步最新数据。

---

## 🚀 本地运行与调试

1. **安装依赖**：
   ```bash
   pnpm install
   ```
2. **启动本地开发服务器**：
   ```bash
   pnpm run dev
   ```
3. **访问系统**：
   打开浏览器访问 [http://localhost:3000](http://localhost:3000) 即可使用中控台进行调试。
