import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


// 模拟登陆成功后设置 cookie
export async function POST(request: NextRequest) {
    const body = await request.json()
    
    if(body.username === 'admin' && body.password === '123456') {
        const cookieStore = await cookies() // 获取 cookie
        cookieStore.set('token', 'login-token', {
            httpOnly: true, // 只允许在服务器端访问
            maxAge: 60 * 60 * 24 * 30, // 30 天
        })
        return NextResponse.json({ code: 1 }, { status: 200 })
    } else {
        return NextResponse.json({ code: 0 }, { status: 401 })
    }
}

// 检查登录状态
export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")
    
    if(token && token.value === 'login-token') {
        return NextResponse.json({ code: 1 }, { status: 200 })
    } else {
        return NextResponse.json({ code: 0 }, { status: 401 })
    }
}