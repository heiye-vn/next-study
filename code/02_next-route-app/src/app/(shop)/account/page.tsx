// app/(shop)/account/page.js
// 这个页面在 (shop) 组内，因此它拥有“双层布局”
export default function AccountPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>我的账户</h2>
      <p>这里可以看到商店专用的导航栏（包含购物车链接）。</p>
    </div>
  );
}