// app/checkout/page.js
export default function CheckoutPage() {
  return (
    <div style={{ padding: '20px', background: '#f9f9f9' }}>
      <h2>结账页面</h2>
      <p>注意：这里没有商店专用的导航栏（没有购物车图标），界面更干净。</p>
      <button style={{ padding: '10px 20px', background: 'blue', color: 'white' }}>
        立即支付
      </button>
    </div>
  );
}