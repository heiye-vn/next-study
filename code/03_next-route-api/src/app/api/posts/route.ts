import { NextRequest, NextResponse } from "next/server"

// 注：这里的函数不能使用 default 导出，必须使用命名导出，否则 Next 无法识别这是一个请求处理器
export async function GET(request: NextRequest) {
    const pathname = request.nextUrl.pathname
    console.log(pathname)   // /api/posts

    const searchParsm = request.nextUrl.searchParams
    console.log(searchParsm)   // URLSearchParams { 'name' => '张三', 'age' => '20' }

    const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    const data = await res.json()

    return NextResponse.json({ data })

    // 使用原生 Response 也可以，但 NextResponse 提供了更多操作
    // return Response.json({ data })
}

export async function POST(request: Request) {
    const article = await request.json()

    return NextResponse.json({
        id: Math.random().toString(36).slice(-8),
        data: article
    }, { status: 201 })
}


/*
    每个请求方法的处理函数有两个可选参数（request，context）

*/