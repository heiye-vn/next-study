import Link from 'next/link';
import { use } from 'react';
import { notFound } from 'next/navigation';
import CurrentPath from '@/components/CurrentPath';

// 定义 params 的类型
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostPage({ params }: PageProps) {

    // 使用 await 或 React.use 解包 params
    const id = use(params).id;


  // 在实际应用中，这里通常会从数据库或 API 获取数据
  const post = {
    id: id,
    title: `Post ${id}`,
    content: `Content for post ${id}`,
  };

  // 如果没找到数据，可以返回 404
  if (!post) notFound();

  return (
    <div className="p-10">
      {/* 使用客户端组件显示路径 */}
      <CurrentPath />

      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700">{post.content}</p>
      <Link href="/" className="mt-4 inline-block text-blue-500 hover:underline">
        返回首页
      </Link>
    </div>
  );
}