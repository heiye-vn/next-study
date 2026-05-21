// Next.js 15+ 版本的路由处理程序默认不会被缓存

// 设置缓存，仅限当前文件，其他路由文件不受影响
export const dynamic = 'force-static'

export async function GET() {
  console.log('GET /api/time')
  return Response.json(({ data: new Date().toLocaleTimeString() }))
}