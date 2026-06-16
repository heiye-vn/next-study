# Next.js 配置指南：next.config.js/ts 全景解析

## 前言

Next.js 可以通过项目根目录下的配置文件进行高度定制。随着 Next.js 的演进（当前最新版本为 **Next.js 16.2.9**），配置文件的编写规范、工程构建、模块解析以及缓存架构都发生了重要变化。

本文将原有的配置内容进行深度整合，并全面对接 Next.js 16.2.9 的最新规范，为您提供一份详尽、现代且具备向后兼容性的配置全景指南。

---

## 0. 配置文件基础与类型推导

配置文件是常规的 Node.js 模块（运行在构建阶段与服务端，不会被打包到客户端浏览器中）。

### 0.1 配置文件格式
根据项目规范，支持以下三种主要格式：
1. **TypeScript 格式 (`next.config.ts`)** —— **最新版官方推荐**，提供完美的类型安全与 IDE 自动补全。
2. **ESM 格式 (`next.config.mjs`)**。
3. **CommonJS 格式 (`next.config.js`)**。

### 0.2 基础配置写法

#### TypeScript 规范 (`next.config.ts`)
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* 具体的配置项 */
};

export default nextConfig;
```

#### 函数式配置
根据不同的构建阶段（如开发服务器、生产构建等）加载不同的配置：
```javascript
// next.config.mjs
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

export default (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      /* 开发环境专属配置 */
    };
  }

  return {
    /* 其他环境配置 */
  };
};
```
*注：`phase` 包含：`phase-export`（导出阶段）、`phase-production-build`（生产构建）、`phase-production-server`（生产服务）、`phase-development-server`（开发服务）以及 `phase-test`（测试阶段）。*

---

## 1. 第一部分：路由与请求级配置

路由与请求级配置（`headers`, `redirects`, `rewrites`）在文件系统检查（包括 `public` 静态资源和页面路由）之前或期间触发，是控制流量的重要手段。

> [!TIP]
> **测试提示**：自 Next.js 15 起，支持在单元测试中通过导入 `next/experimental/testing/server` 中的 `unstable_getResponseFromNextConfig` 来直接对这些自定义路由逻辑进行单元测试，极大方便了复杂重写与重定向逻辑的回归验证。

### 1.1 自定义响应标头 (`headers`)

用于为匹配的请求路径注入自定义 HTTP 响应头。

#### 配置示例
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'x-custom-header',
            value: 'my custom header value',
          },
          {
            key: 'x-another-custom-header',
            value: 'my other custom header value',
          },
        ],
      },
    ];
  },
};
```

#### 关键匹配属性
每个匹配对象除了 `source` 和 `headers` 外，还可以设置：
- `basePath`：设置为 `false` 时，匹配路径时不包含全局配置的 `basePath`。
- `locale`：设置为 `false` 时，匹配时不自动添加 i18n 语言前缀（**主要用于 Pages Router**）。
- `has` / `missing`：根据特定的请求头、Cookie、主机名、查询参数来条件化应用这些标头（详见 1.4 节）。

#### 路径匹配规则
`source` 属性支持三种匹配模式：
1. **普通路径参数**：`/blog/:slug` 匹配 `/blog/hello-world`（单层路径，不匹配 `/blog/hello-world/about`）。在 `headers` 的 `key` 或 `value` 中可以使用 `:slug` 变量。
2. **通配符参数**：`/blog/:slug*` 匹配 `/blog/a/b/c/d/hello-world`。
3. **正则表达式参数**：`/blog/:post(\\d{1,})` 仅匹配数字型 ID（如 `/blog/123`），不匹配 `/blog/abc`。
   *注：对于特殊正则字符如 `(`, `)`, `{`, `}`, `:`, `*`, `+`, `?` 本身，需要使用 `\\` 进行转义（例如匹配 `/english(default)/:slug` 写作 `'/english\\(default\\)/:slug'`）。*

#### 覆盖机制
如果多个配置匹配了相同的路径且存在相同的 Header Key，则**数组中排在后面的配置会覆盖前面的配置**；若 Header Key 不冲突，则会叠加应用。

---

### 1.2 路由重定向 (`redirects`)

将请求重定向到另一个目标路径，并向浏览器返回相应的状态码。

#### 配置示例
```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true, // 返回 308 永久重定向；若为 false 则返回 307 临时重定向
      },
    ];
  },
};
```

#### 为什么使用 307 和 308？
传统的 302（临时）和 301（永久）重定向在许多旧浏览器中，会将原本的非 GET 请求（如 `POST`）重定向为 `GET` 请求。Next.js 强制使用 **307 临时重定向** 和 **308 永久重定向**，可以明确指示浏览器**保留原本的请求方法**。

#### 关键注意点
- 默认情况下，重定向规则**不会**应用于客户端路由导航（如 `<Link>` 或 `router.push`），除非通过 Middleware 实现了路径过滤。
- 当触发重定向时，未被捕获的额外查询参数（如 `/old-blog/post-1?hello=world`）会被自动传递并拼接到 `destination`。

---

### 1.3 路由重写与代理 (`rewrites`)

重写（Rewrites）相当于扮演了 **URL 代理** 的角色。它会屏蔽真实的目标地址——浏览器地址栏 URL 保持不变，但服务端实际渲染的是目标路由的逻辑。这在客户端导航（如 `<Link href="/about">`）中同样生效。

#### 单一数组形式
重写默认会在检查文件系统之后，但在动态路由之前应用。
```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/about',
        destination: '/',
      },
    ];
  },
};
```

#### 细粒度三阶段重写
若要精细控制与文件系统的优先级，可以返回一个对象：
```javascript
module.exports = {
  async rewrites() {
    return {
      beforeFiles: [
        // 在检查 public 静态文件和非动态页面之前触发
        { source: '/some-page', destination: '/somewhere-else' },
      ],
      afterFiles: [
        // 在 public 静态文件检查之后，但动态路由检查之前触发
        { source: '/non-existent', destination: '/somewhere-else' },
      ],
      fallback: [
        // 在静态文件与动态路由都未匹配，即将渲染 404 之前触发
        { source: '/:path*', destination: 'https://my-old-site.com/:path*' },
      ],
    };
  },
};
```

#### 路由检查完整顺序
1. `headers`
2. `redirects`
3. `beforeFiles` 重写
4. `public/` 静态文件、`_next/static`、非动态页面
5. `afterFiles` 重写
6. 动态路由检验
7. `fallback` 重写（可用于**增量迁移旧网站**至 Next.js 的过渡方案）
8. 渲染 404 页面

#### 重写参数传递规范
1. **自动作为 Query 传递**：如果 `destination` 没有显式引用 `source` 中的命名参数，这些命名参数会自动以查询字符串（Query）的形式追加到目标路径。
2. **手动绑定**：如果 `destination` 使用了部分命名参数，未使用的命名参数将不会自动追加，此时需要在目标 URL 中手动拼接（例如：`destination: '/:first?second=:second'`）。

---

### 1.4 条件匹配限制 (`has` 与 `missing`)

`headers`, `redirects`, `rewrites` 均支持 `has`（必须匹配）和 `missing`（必须不匹配）参数。支持基于请求头 (`header`)、Cookie (`cookie`)、主机名 (`host`)、查询参数 (`query`) 进行多维度过滤。

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          // 只有当 Host 为 'example.com' 且 Cookie 中 authorized=true 时才应用重写
          { type: 'host', value: 'example.com' },
          { type: 'cookie', key: 'authorized', value: 'true' },
        ],
        destination: '/another-page',
      },
      {
        source: '/:path*',
        has: [
          // 支持类似正则的命名捕获，并在 destination 中使用捕获变量
          { type: 'header', key: 'x-authorized', value: '(?<auth>yes|true)' }
        ],
        destination: '/home?auth=:auth',
      }
    ];
  }
};
```

---

## 2. 第二部分：工程构建与模块打包配置

在 Next.js 16.2.9 中，工程编译与外部包的依赖处理方案变得更加直接与成熟。

### 2.1 服务端不打包外部包 (`serverExternalPackages`)

Next.js 默认会自动打包 Server Components 和 Route Handlers 中的所有依赖项，以提升生产环境的加载速度。然而，对于一些包含原生二进制文件（Native Addons，如 `bcrypt`, `sharp` 等）或底层 Node.js 特有组件的库，打包往往会引起构建或运行期错误。

> [!IMPORTANT]
> **新版变动**：原有的实验性选项 `experimental.serverComponentsExternalPackages` 在最新版中已升级为顶层的正式配置项 **`serverExternalPackages`**。

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['@acme/ui', 'some-native-package'],
};

export default nextConfig;
```
配置后，这些包将被排除在 Webpack/Turbopack 打包之外，改为在运行时通过原生 Node.js 的 `require` 动态加载。

### 2.2 本地包自动转译 (`transpilePackages`)

当引用本地 Monorepos 模块、工作区（Workspaces）代码或外部尚未被转译成 ES5/ES6 兼容代码的包时，可直接列在此处，Next.js 会自动使用内置编译器进行转译。不再需要社区的 `next-transpile-modules` 插件。
```javascript
module.exports = {
  transpilePackages: ['@my-monorepo/ui', 'lodash-es'],
};
```

### 2.3 导入优化 (`optimizePackageImports`)

对于类似 UI 库或包含海量导出子模块的第三方包（例如 `@mui/material` 或 `date-fns`），默认在开发和构建时全部加载会导致严重的内存和速度问题。
通过该选项，Next.js 在检测到相关引用时，只加载您代码中实际 `import` 的模块，从而加快热更新与构建速度。
```javascript
module.exports = {
  experimental: {
    optimizePackageImports: ['my-giant-ui-library'],
  },
};
```
*注：像 `@mui/icons-material`, `lucide-react`, `lodash` 等常见库，Next.js 内部已默认进行了此类优化，无需重复声明。*

### 2.4 自定义 Webpack 配置 (`webpack`)

若内置的打包策略无法满足需求，可以通过 `webpack` 函数扩展底层配置：
```javascript
module.exports = {
  webpack: (config, { buildId, dev, isServer, nextRuntime, webpack }) => {
    // 区分服务端和客户端编译，进行特定的插件添加或 Loader 扩充
    if (isServer) {
      config.plugins.push(new webpack.DefinePlugin({ __SERVER__: true }));
    }
    return config;
  },
};
```

### 2.5 编译质量与编译目录配置
- **`distDir`**：自定义打包产物输出文件夹，默认是 `.next`。必须在项目目录内。
  ```javascript
  module.exports = { distDir: 'build' };
  ```
- **`eslint.ignoreDuringBuilds`**：设置为 `true` 可在生产构建时忽略 ESLint 报错以继续打包。
- **`typescript.ignoreBuildErrors`**：设置为 `true` 可在生产构建时强行忽略 TypeScript 类型检查错误。

---

## 3. 第三部分：图像优化配置 (`images`)

在 `next/image` 进行图像优化时，安全隔离至关重要。

### 3.1 严格的外部域名匹配 (`remotePatterns`)
> [!WARNING]
> **安全警示**：旧有的 `domains` 字段（只校验域名本身）在最新版中已被**废弃且移除**。您必须使用更加精确的 `remotePatterns` 进行匹配，以防应用被攻击者用作恶意图片的优化代理。

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com', // 匹配 example.com 及其所有子域名
        port: '',
        pathname: '/images/**',     // 严格限制图片 URL 路径
      },
    ],
  },
};
```

### 3.2 图像优化加速器 `sharp`
在最新版 Next.js 中，服务端进行高效率图片优化时，底层会自动识别并集成 **`sharp`** 引擎进行快速压缩，开发人员**无需在生产环境中手动安装 `sharp` 库**，这使得跨平台容器化部署更加顺畅。

---

## 4. 第四部分：缓存、渲染模式与最新部署实践

Next.js 16.2.9 在服务端缓存以及自托管（Self-Hosting）方面提供了目前最先进的架构支持。

### 4.1 新版缓存处理器 (`cacheHandlers`)

随着 `"use cache"` 缓存在最新版中的正式落地，Next.js 的数据与组件缓存机制经历了重大革新。

> [!IMPORTANT]
> **新版变动**：在以前版本中，自定义缓存使用 `experimental.incrementalCacheHandlerPath`。而在最新的 Next.js 16 中，已标准化升级为顶层的 **`cacheHandlers`** 映射关系，用以管理全局或分模块的缓存持久化方案（如接入外部 Redis、Memcached 共享缓存）。

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheHandlers: {
    default: require.resolve('./cache-handler.js'), // 引入自定义的 Redis 等缓存提供者
  },
};

export default nextConfig;
```

#### 缓存类结构示例
```javascript
// cache-handler.js
const redisClient = require('./redis-client');

module.exports = class CacheHandler {
  constructor(options) {
    this.options = options;
  }

  async get(key) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key, value, ttl) {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
  }
};
```

### 4.2 开启新版缓存组件与渲染模型 (`cacheComponents`)
在最新 Next.js 16.2.9 中，**`cacheComponents`** 配置项用于激活最新架构的组件缓存指令（`"use cache"` 缓存指令支持）。

```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
};
export default nextConfig;
```

#### 💡 版本演进对比：局部预渲染 (PPR)
- **15.x 时代**：主要采用实验性配置 `experimental: { ppr: true }` 开启，并在路由页面中定义 `export const experimental_ppr = true`。
- **16.x 时代**：推荐全面启用 `cacheComponents` 模式，在细粒度组件或数据获取上直接通过 `"use cache"` 来实现极其灵活的数据、组件缓存与静态切片隔离。

### 4.3 Standalone 独立构建部署 (`output`)

对于容器化（Docker）等自托管场景，推荐使用 `output: 'standalone'`。
```javascript
module.exports = {
  output: 'standalone',
};
```
在执行 `next build` 时，Next.js 会自动追踪并拷贝生产环境必需的所有依赖文件（包括 `node_modules` 的必要子集）到 `.next/standalone/` 目录下。这允许您在目标服务器上**完全不需要安装 node_modules** 即可通过 `node server.js` 启动极速运行，极大地缩减了 Docker 镜像的体积。

---

## 5. 第五部分：网络、路径与其它基础配置

### 5.1 资源与路径前缀
- **`assetPrefix`**：静态资源 CDN 前缀。在生产环境下，可以将 JS/CSS 静态资源的获取地址代理到外部 CDN 上。
  ```javascript
  const isProd = process.env.NODE_ENV === 'production';
  module.exports = {
    assetPrefix: isProd ? 'https://cdn.my-site.com' : undefined,
  };
  ```
  *注意：只有 `.next/static/` 中的构建产物应该上传至 CDN。`public/` 目录下的静态资源依然通过本地服务器访问，`assetPrefix` 对它们不生效。*

- **`basePath`**：应用路由的前缀路径。例如配置为 `/docs`，则原本路由 `/about` 自动映射为 `/docs/about`，所有的 `<Link>` 和 `router` 路由导航均会自动附加前缀。
  ```javascript
  module.exports = {
    basePath: '/docs',
  };
  ```

### 5.2 其它工程控制项
- **`reactStrictMode`**：严格模式（在 App Router 模式下最新版默认启用），有助于捕捉非安全生命周期和不推荐 API 的使用。
- **`poweredByHeader`**：默认会在响应头带上 `x-powered-by: Next.js`，设为 `false` 可移除该头以保障安全性。
  ```javascript
  module.exports = { poweredByHeader: false };
  ```
- **`trailingSlash`**：URL 尾部斜杠控制。设为 `true` 时，Next.js 会自动将 `/about` 重定向到 `/about/`。
- **`productionBrowserSourceMaps`**：设为 `true` 将允许在生产打包时输出 SourceMap。若非排查线上疑难 Bug，通常建议保持 `false` 以防源码泄露。

---

## 6. 第六部分：开发调试与性能指标

### 6.1 开发日志控制 (`logging`)
配置开发环境下数据获取（Fetch）的详细控制台日志。
```javascript
module.exports = {
  logging: {
    fetches: {
      fullUrl: true, // 打印 fetch 请求的完整 URL，便于排查数据接口问题
    },
  },
};
```

### 6.2 开发指示器 (`devIndicators`)
在开发调试阶段，右下角编译状态指示器以及 ISR/页面的静态渲染指示器。可控制其隐藏或显示位置：
```javascript
module.exports = {
  devIndicators: {
    buildActivityPosition: 'bottom-right', // 可选 'bottom-left', 'top-right', 'top-left'
    buildActivity: true,                  // 设为 false 可彻底关闭编译提示器
  },
};
```

### 6.3 页面性能归因 (`webVitalsAttribution`)
在采集 Web 性能指标（Web Vitals，如 CLS 最大布局偏移、LCP 最大内容渲染时间等）时，可指定获取深层元素归因（如 PerformanceEventTiming），以精细化定位性能瓶颈（例如定位是哪个具体的图片或 DIV 造成了 CLS 布局抖动）：
```javascript
module.exports = {
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
};
```

---

## 7. 版本演进与废弃总结对照表

| 配置项 (旧版或 Transition 版) | Next.js 16.2.9 最新标准 | 说明与迁移建议 |
| :--- | :--- | :--- |
| `i18n` (i18n.locales) | **淡化/由 Middleware 替代** | Pages Router 下保留，在 App Router 下已被 Middleware 级动态路由完全接管 |
| `experimental.serverComponentsExternalPackages` | **`serverExternalPackages`** | 已标准化，直接作为顶层配置使用，无需 experimental 前缀 |
| `experimental.incrementalCacheHandlerPath` | **`cacheHandlers`** | 演进为顶层多处理器映射关系，适用于 `"use cache"` 自定义共享存储 |
| `experimental.ppr` | **`cacheComponents: true`** | 实验性 PPR 演进为 `"use cache"` 组件级缓存模型，通过本配置启用 |
| `experimental.turbo` | **`turbopack`** | 提升为顶层配置项，并支持更丰富的 alias 与 rules 转换规则 |
| `images.domains` | **`images.remotePatterns`** | **已彻底移除**。出于安全考虑，必须使用 remotePatterns 描述完整路径与协议 |
| AMP 支持 | **彻底移除** | 架构升级，不再支持 AMP 组件的生成与配置 |
| `next lint` | **从构建核心移除** | 移除了内置构建管道的 lint 集成，建议在 CI 或 Pre-commit 阶段独立运行 |

---

## 参考链接
- [Next.js 官方配置文档](https://nextjs.org/docs/app/api-reference/next-config-js)
- [Next.js 16 架构与全新缓存机制](https://nextjs.org/docs/app/building-your-application/caching)
