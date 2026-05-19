'use client';

import { usePathname } from 'next/navigation';

export default function CurrentPath() {
  const pathname = usePathname();
  
  return (
    <p className="text-sm text-gray-500 mb-4">
      当前路径: {pathname}
    </p>
  );
}


/*
    usePathname(): Next.js 提供的一个 Hook，用于在 客户端组件 中获取当前 URL 的路径名(pathname)

    注：由于 usePathname 依赖于浏览器的路由状态，它不能直接在服务端组件(Server Component)中使用。 

*/