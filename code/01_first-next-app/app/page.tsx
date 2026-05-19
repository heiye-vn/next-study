import Link from "next/link"
import NavButton from "@/components/NavButton"
import { redirect } from "next/navigation"


{/* 路由重定向 */ }
function redirectUrl() {
  console.log('执行路由重定向')
  redirect('/dashboard')
}

export default function Page() {

  const posts = [
    { id: 1, title: "Post 1", content: "Content 1" },
    { id: 2, title: "Post 2", content: "Content 2" },
    { id: 3, title: "Post 3", content: "Content 3" },
  ]

  // redirectUrl()

  return (
    <div className="p-5">
      <h1 className="text-4xl font-semibold text-red-500 px-2.5 py-5">Hello, Next.js!</h1>

      {/* 静态路由示例 */}
      <div className="mb-5">
        <Link href="/dashboard" className="text-blue-600 hover:underline mr-4">
          Dashboard (静态路由)
        </Link>
      </div>

      {/* 客户端组件编程式导航 */}
      <div className="mb-5">
        <NavButton />
      </div>

      {/* 动态路由列表渲染 */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold mb-2">文章列表 (动态路由):</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="py-1">
              <Link
                href={`/post/${post.id}`}
                className="text-green-600 hover:text-green-800 hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/*
  跳转行为设置：

  1. App Router 的默认行为是滚动到新路由的顶部，或者在前进后退导航时维持之前的滚动距离。

  2. 如果你想要禁用这个行为，你可以给 `<Link>` 组件传递一个 `scroll={false}`属性，或者在使用 `router.push`和 `router.replace`的时候，

     设置 `scroll: false`


  redirect(): Next.js 提供的路由重定向函数。只能用于服务端组件或服务器的操作（比如获取登录信息，失败则重定向到登录页），并且仅用于同步渲染逻辑
*/