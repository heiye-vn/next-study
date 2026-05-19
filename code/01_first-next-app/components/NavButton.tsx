'use client'; // 必须添加

import { useRouter } from 'next/navigation';

export default function NavButton() {
  const router = useRouter();

  const handleNavigate = () => {
    // 编程式导航
    router.push('/dashboard');
  };

  return (
    <button onClick={handleNavigate} className="px-4 py-2 bg-blue-500 text-white rounded">
      去 Dashboard
    </button>
  );
}

/*
    useRouter(): Next.js 提供的路由导航 hook，用于编程式导航。包含（push、replace、back、forward 等方法）

    这些操作依赖于浏览器的 History API 和客户端路由状态，而服务端组件（Server Components）在服务器渲染，没有浏览器环境，因此无法使用 useRouter

    常用方法：

        1. router.push(href): 导航到新页面，并在历史栈中添加新记录（用户可以点击后退按钮返回）

        2. router.replace(href): 导航到新页面，但替换当前历史纪录（用户点击后退按钮不会回到原页面）

        3. router.back(): 返回上一页，相当于浏览器的后退按钮

        4. router.forward(): 前往下一页，相当于浏览器的前进按钮

        5. router.refresh(): 刷新当前路由，重新从服务器获取数据并重新渲染组件
*/