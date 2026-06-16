import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
// 是否启用静态导出。在静态导出模式下，headers() 等服务器端动态特性将被禁用。
const isExport = process.env.NEXT_PUBLIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // 1. 静态导出与构建输出
  // standalone：生成独立的可部署 Node.js 服务（Docker 部署最推荐）
  // export：导出静态 HTML/CSS/JS（静态站点部署推荐）
  output: isExport ? 'export' : undefined,

  // 2. 静态资源 CDN 前缀 (assetPrefix) 与 子路径挂载 (basePath)
  assetPrefix: isProd ? 'https://cdn.yourcompany.com/assets' : undefined,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',

  // 3. 图片优化与安全策略 (Images)
  images: {
    // 允许加载的远程图片域名白名单（支持通配符路径）
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.yourcompany.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
    ],
    // 默认缓存时间（秒），减少重复请求
    minimumCacheTTL: 60,
    // 仅在私有网络下才允许本地 IP 优化
    dangerouslyAllowLocalIP: false,
    // 静态导出模式下必须禁用默认图片优化，除非配合自定义 loader
    unoptimized: isExport,
  },

  // 4. 关于国际化 (i18n) 在 App Router 中的配置说明
  // [注意] 在 Next.js App Router 架构中，i18n 属性不再在 next.config.ts 中配置（该配置仅适用于旧版 Pages Router）。
  // 企业级 App Router 国际化推荐通过多语言动态路由（如 app/[lang]/page.tsx）以及 Middleware 中间件来实现。

  // 5. 自定义响应头 (Headers) - 提升安全性与性能（静态导出模式下不支持 headers）
  ...(isExport ? {} : {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://trusted.cdn.com",
            },
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
          ],
        },
      ];
    },
  }),

  // 6. 环境变量注入 (Env)
  env: {
    APP_VERSION: process.env.APP_VERSION || '1.0.0',
  },

  // 7. 严格模式与路由类型安全
  typescript: {
    ignoreBuildErrors: false, // 生产构建时绝不忽略 TS 类型错误，保障交付质量
  },
  reactStrictMode: true, // 开启 React 严格模式，用于捕获潜在组件生命周期及副作用 Bug
  typedRoutes: true, // 开启类型安全的路由系统，确保本地跳转路径不会写错（Next.js v16 已成为一级属性）

  // 8. 性能与打包优化
  compress: true, // 启用 Gzip/Brotli 压缩（若前置 Nginx 已开启，可设为 false 减轻 Node 负载）
  generateEtags: true, // 自动为页面生成 Etag，节约二次访问流量
  transpilePackages: ['@your-company/ui-lib'], // 强制转译指定的 ESM NPM 包或私有 UI 库

  // 9. 页面扩展名匹配
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // 10. 开发环境行为配置
  devIndicators: {
    position: 'bottom-right', // 控制开发环境中编译状态指示器（金色闪电图标）的位置
  },

  // 11. 实验性特性 (Experimental)
  experimental: {
    // 可以在此处开启其他实验性配置
  },

  // 12. 企业级日志系统配置
  logging: {
    fetches: {
      fullUrl: true, // 在开发终端中打印所有 fetch 请求的完整 URL，极大方便接口联调
    },
  },

  // 13. 打包器与兼容性配置
  // Next.js v16 默认启用了极速构建工具 Turbopack。
  // [注意] 当 Turbopack 开启时，若配置了自定义 webpack 函数，编译器会抛出冲突错误。
  // 在 Turbopack 体系下，推荐使用下面的 turbopack 属性来配置加载器或别名，传统的 webpack 函数作为非 Turbopack 环境的退路或注释备用。
  turbopack: {
    // 如果需要设置别名或特定规则，可以在这里配置，例如：
    // resolveAlias: {
    //   '@ui': './components/ui',
    // }
  },

  /*
  // 自定义 Webpack 构建（若命令行显式传入 --webpack 停用 Turbopack，此配置可生效）
  webpack: (config, { dev, isServer }) => {
    // 例如：在此处可以配置特殊的 loaders/plugins
    return config;
  },
  */
};

export default nextConfig;

