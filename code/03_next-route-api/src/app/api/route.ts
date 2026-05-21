import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";

// cookies 实例只读，通过在 headers 中使用 Set-Cookie 来设置
export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')

    if (!token) {
        return new Response('No token found', { status: 401 })
    }

    // 刷新 token（示例：延长过期时间）
    const refreshedToken = token.value // 实际项目中可能需要生成新 token

    return new Response('Token refreshed', {
        status: 200,
        headers: { 
            'Set-Cookie': `token=${refreshedToken}; Path=/; HttpOnly; Secure; Max-Age=3600; SameSite=Strict`
        }
    })
}

/*
    Next.js App Router 中，headers 的使用有两种场景

    1. 读取请求头（从客户端发来的请求）
    2. 设置响应头（返回给客户端的响应）

    注：这里方便测试写的 GET1,实际只能写 GET，且同一文件中只能有一个同名请求方法
*/
export async function GET1(request: NextRequest) {
    // 1. 使用 headers() 获取所以请求头
    // const headersList = await headers()

    // 2. 使用 request.headers 获取
    const headersList = request.headers

    // 读取特定的请求头
  const userAgent = headersList.get("user-agent");
  const contentType = headersList.get("content-type");
  const authorization = headersList.get("authorization");
  const referer = headersList.get("referer");
  
  console.log("User-Agent:", userAgent);
  console.log("Content-Type:", contentType);
  console.log("referer:", referer);
  
  return Response.json({
    userAgent,
    contentType,
    authorization: authorization ? "Present" : "Not present"
  });
}