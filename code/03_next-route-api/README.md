This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 路由处理程序（Route Handlers）

在 Next.js（特别是 App Router 架构）中，路由处理程序（Route Handlers） 让你能够使用 Web 请求（Request）和响应（Response）API 为给定的路由创建自定义的请求处理程序。



简单来说，它就是让你在 Next.js 应用里直接写 API 接口（类似于传统的 Express.js 路由或 Serverless 函数），用来处理数据提交、与数据库交互或对接第三方服务



路由处理程序必须在 app 目录下的 route.js 或 route.ts 文件中定义。



⚠️ 重要限制： route.js 不能和同级目录下的 page.js 共存。因为如果同一路径既是页面又是 API 接口，Next.js 就不知道该渲染网页还是返回数据了。

它支持常见的 HTTP 方法：GET、POST、PUT、PATCH、DELETE、HEAD 和 OPTIONS。只需要导出对应名称的异步函数即可
