export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-100 text-gray-900">
        {/* 后台特有的侧边栏 */}
        <aside>后台侧边栏...</aside>
        {children}
      </body>
    </html>
  );
}