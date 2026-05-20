// app/(shop)/cart/page.js
// 同样也继承了商店布局
export default function CartPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>购物车</h2>
      <p>您有 3 件商品在购物车中。</p>
      <a href="/checkout">💰 去结算</a>
    </div>
  );
}