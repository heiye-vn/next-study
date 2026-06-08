import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 bg-zinc-950 text-zinc-50 font-sans">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center animate-slide-up border border-indigo-500/20">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-400 mb-6 border border-indigo-500/30">
          <svg
            className="w-8 h-8 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-2">安全重定向成功</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          这是一个演示 Server Action 重定向 (Redirect) 的后台页面。当留言内容触发了{" "}
          <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs">
            /admin
          </code>{" "}
          时，服务端成功通过特殊的{" "}
          <code className="bg-zinc-900 px-1.5 py-0.5 rounded text-indigo-300 font-mono text-xs">
            redirect()
          </code>{" "}
          路由机制将用户重定向至此。
        </p>

        <Link
          href="/"
          className="btn-primary inline-flex items-center justify-center w-full px-5 py-3 rounded-xl font-medium text-white transition-all text-sm"
        >
          返回留言板
        </Link>
      </div>
    </div>
  );
}
