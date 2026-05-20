// 动态路由参数
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {

    // 使用 await 解析 params，也可以使用 React.use(params)
    // 官方推荐使用 await
    const result = await params

    console.log(result)

    return <div>My Post: {result.slug}</div>
}