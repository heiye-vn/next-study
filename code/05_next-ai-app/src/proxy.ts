import { NextRequest, NextResponse, ProxyConfig } from "next/server";

// 处理跨域请求，只要是 /api 下的接口都可以被任意访问
export async function proxy(request: NextRequest) {
    const response = NextResponse.next()

    Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    return response;

}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export const config: ProxyConfig = {
    matcher: '/api/:path*'
}