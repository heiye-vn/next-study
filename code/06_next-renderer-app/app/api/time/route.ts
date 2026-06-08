import { NextResponse } from 'next/server';
import crypto from 'node:crypto';

// 确保该 API 路由本身不会被静态固化，以便它总能生成最新的随机数据
export const dynamic = 'force-dynamic';

const QUOTES = [
  "There are only two hard things in Computer Science: cache invalidation and naming things. — Phil Karlton",
  "Any violation of simple design should be justified by a significant performance benefit. — Kent Beck",
  "Premature optimization is the root of all evil. — Donald Knuth",
  "Simplifying cache management simplifies your whole life. — Next.js 16 App Router",
  "Static content is fast. Dynamic content is fresh. Hybrid content is Next.js."
];

export async function GET() {
  // 模拟真实网络延迟（200ms - 500ms），方便我们在前端直观对比缓存带来的瞬间加载体验
  const delay = Math.floor(Math.random() * 300) + 200;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const now = new Date();
  const timestamp = now.toLocaleTimeString('zh-CN', { hour12: false }) + '.' + String(now.getMilliseconds()).padStart(3, '0');
  const uuid = crypto.randomUUID();
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  return NextResponse.json({
    timestamp,
    uuid,
    quote,
    fetchedAt: now.toISOString(),
    latencyMs: delay
  });
}
