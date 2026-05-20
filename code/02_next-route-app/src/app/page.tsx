"use client";

import React from 'react';
import Link from 'next/link';

const products = [
  { id: '1', name: '极客定制机械键盘', price: '¥599', image: '/images/keyboard.png' },
  { id: '2', name: '智静无线降噪耳机', price: '¥1,299', image: '/images/headphones.png' },
  { id: '3', name: '极智商务运动手表', price: '¥1,899', image: '/images/watch.png' }
];

export default function HomePage() {
  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* 标题部分 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#0f172a',
          margin: '0 0 10px 0',
          letterSpacing: '-0.5px'
        }}>
          🛍️ 潮流科技数码商城
        </h2>
        <p style={{
          color: '#64748b',
          fontSize: '16px',
          margin: 0
        }}>
          点击下方商品卡片，体验 Next.js <strong>拦截路由 (Intercepting Routes)</strong> 实现的无缝模态框预览。
        </p>
      </div>

      {/* 商品网格画廊 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginBottom: '50px'
      }}>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/photo/${product.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
            // passHref can be omitted in Next.js 13+
          >
            <div style={{
              background: 'white',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
              cursor: 'pointer',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
            }}
          >
            {/* 商品图片 */}
            <div style={{
              background: '#f8fafc',
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  maxHeight: '100%',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 12px rgba(0,0,0,0.05))',
                  transition: 'transform 0.3s ease'
                }}
              />
            </div>

            {/* 商品信息 */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#1e293b'
                }}>
                  {product.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#64748b',
                  margin: '0 0 16px 0',
                  lineHeight: '1.4'
                }}>
                  体验流畅操作，享受最新硬核科技的独特魅力。
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 800,
                  color: '#e11d48'
                }}>
                  {product.price}
                </span>
                <span style={{
                  fontSize: '13px',
                  color: '#2563eb',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  查看详情 →
                </span>
              </div>
            </div>
          </div>
        </Link>
        ))}
      </div>

      {/* 说明区域 */}
      <div style={{
        background: '#f1f5f9',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        fontSize: '14px',
        color: '#475569',
        lineHeight: '1.6'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#0f172a', fontWeight: 700 }}>💡 交互与路由原理解释：</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>模态框交互（客户端跳转）</strong>：当你在商城首页点击任意一个商品卡片时，页面不会发生传统的整页刷新，而是以模态框的形式从上方浮出展示。观察地址栏，你会发现 URL 改变了（例如变为 <code>/photo/1</code>）。这是由 <code>src/app/@modal/(.)photo/[id]/page.tsx</code> 拦截路由处理的。</li>
          <li><strong>独立页面交互（直接访问）</strong>：如果你复制并分享 <code>/photo/1</code> 这一链接给朋友，或者在地址栏直接回车刷新该页面，Next.js 将不会拦截该路由，而是通过 <code>src/app/photo/[id]/page.tsx</code> 渲染出完整排版的产品独立详情页面。</li>
        </ul>
      </div>
    </div>
  );
}