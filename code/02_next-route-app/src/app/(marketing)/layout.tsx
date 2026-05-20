export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="bg-white text-black">
        {/* 前台特有的导航栏 */}
        <nav>前台导航...</nav>
        {children}
      </body>
    </html>
  );
}