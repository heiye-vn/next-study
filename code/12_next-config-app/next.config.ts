import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  /* ── 路由与请求级配置 ── */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/guide',
        permanent: false,
      },
    ];
  },

  /* ── 工程构建配置 ── */
  poweredByHeader: false,
  reactStrictMode: true,

  /* ── 图像优化 ── */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
        port: '',
        pathname: '/images/**',
      },
    ],
  },

  /* ── 开发调试 ── */
  logging: {
    fetches: { fullUrl: true },
  },

  devIndicators: {
    position: 'top-right' as const,
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [['remark-gfm', {}]],
    rehypePlugins: [['rehype-pretty-code', { theme: 'one-dark-pro', keepBackground: true }]],
  },
});

export default withMDX(nextConfig);
