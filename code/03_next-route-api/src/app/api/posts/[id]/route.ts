/*
    需求：目前 GET 请求 /api/posts 时会返回所有文章数据，现在希望 GET 请求 /api/posts/1?dataField=title 时获取 post id = 1 的文章数据
    dataField 用于指定返回哪些字段数据
*/

import { NextRequest, NextResponse } from "next/server";


// ✅ Service 层（业务逻辑）- 类似 NestJS Service
async function getPostById(id: string, field?: string | null) {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    const data = await res.json()

    return field && data[field] !== undefined ? { [field]: data[field] } : data
}

// ✅ Controller 层（路由处理）- 类似 NestJS Controller
export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ id: string }> }
) {
    // 1. 解析参数（类似 NestJS 中的 @Param、@Query）
    const { id } = await params
    const field = request.nextUrl.searchParams.get('dataField')

    // 2. 调用方法获取数据（调用 Service 层处理业务逻辑）
    const result = await getPostById(id, field)

    // 3. 返回响应（类似 NestJS 中的 return）
    return NextResponse.json(result)
}