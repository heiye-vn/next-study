// app/(shop)/layout.js
// 这个布局只会应用在 (shop) 文件夹内的页面（即 /account 和 /cart）
export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* 商店专用导航：只有 account 和 cart 会显示 */}
      <nav style={{ padding: '10px', background: '#e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <a href="/cart">🛒 购物车</a>
          <a href="/account" style={{ marginLeft: '10px' }}>👤 我的账户</a>
        </div>
        <div>🔍 搜索商品...</div>
      </nav>

      {/* 页面内容渲染在这里 */}
      {children}
    </div>
  );
}