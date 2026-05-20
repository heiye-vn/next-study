import Link from "next/link";

// 这是所有页面共有的最外层布局，通常包含网站的头部和全局样式
export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        {/* 全局导航：所有页面都会显示 */}
        <header style={{ padding: '20px', background: '#333', color: 'white' }}>
          <h1>🛒 我的电商网站</h1>
          <nav>
            <Link href="/" style={{ color: 'white', marginRight: '10px', textDecoration: 'none' }}>首页</Link>
            <Link href="/account" style={{ color: 'white', marginRight: '10px', textDecoration: 'none' }}>账户</Link>
            <Link href="/dashboard" style={{ color: 'white', marginRight: '10px', textDecoration: 'none' }}>📊 仪表盘 (平行路由)</Link>
          </nav>
        </header>

        <main>{children}</main>
        {modal}
      </body>
    </html>
  );
}