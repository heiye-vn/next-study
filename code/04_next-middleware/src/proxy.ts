// Next16.x 版本使用 proxy 代替 middleware

import { NextRequest, NextResponse } from "next/server";

// 必须导出名为 proxy 的函数（或使用 export default）
export default function proxy(request: NextRequest) {
    // return NextResponse.redirect(new URL('/home', request.url))

    console.log('Path: ', request.nextUrl.pathname)

    // 检查请求头
    const authHeader = request.headers.get('Authorization')
    const userId = request.nextUrl.searchParams.get('userId')
    const sessionCookie = request.cookies.get('session')?.value

    // 自定义判断条件
    if(request.nextUrl.pathname.startsWith('/api')) {
        if(authHeader !== 'Bearer Token' || userId !== '123' || sessionCookie === 'active') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }
    }

    return NextResponse.next()
}

// 配置文件过滤器（Matcher），指定哪些路由走这个 Proxy
export const config = {
    // matcher: '/about/:path*'

    // matcher: ['/about/:path*', '/dashboard/:path*']

//     matcher: [
//     /*
//      * 匹配所有的路径除了以这些作为开头的：
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],

    matcher: ['/api/:path*', '/dashboard/:path*']
}

/*
    关键规则

    1. 单文件限制：整个项目只允许存在一个 proxy.ts 文件。如果你有多个路由需要不同的代理逻辑，应当在 proxy.ts 
    内部通过模块化导入（Import）不同的子模块来聚合管理，从而避免多层中间件嵌套带来的性能损耗

    2. 信息传递：Proxy 与你的主应用代码是隔离运行的。如果你想把 Proxy 里的数据（比如解析出来的用户信息）传给下游的页面或 Layout，
    应该通过 Headers、Cookies、Rewrite 参数 或者 URL 来传递

*/