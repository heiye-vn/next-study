"use client";

import React, { use } from 'react';
import Link from 'next/link';

const products = [
  { id: '1', name: '极客定制机械键盘', price: '¥599', desc: 'CNC全铝机身，热插拔轴体，定制PBT键帽，全键无冲突，配合炫酷RGB背光效果。', image: '/images/keyboard.png' },
  { id: '2', name: '智静无线降噪耳机', price: '¥1,299', desc: '40dB混合主动降噪，Hi-Res高解析音质，40小时超长复合续航，蛋白皮耳罩舒适佩戴。', image: '/images/headphones.png' },
  { id: '3', name: '极智商务运动手表', price: '¥1,899', desc: '全天候视网膜屏幕，精细心率血氧睡眠监测，内置双频多星GPS，5ATM专业级防水。', image: '/images/watch.png' }
];

interface PhotoPageProps {
  params: Promise<{ id: string }>;
}

export default function PhotoPage({ params }: PhotoPageProps) {
  const { id } = use(params);
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div style={{
        padding: '50px',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <h2>⚠️ 产品未找到</h2>
        <p style={{ color: '#64748b' }}>该产品不存在或已被下架。</p>
        <Link href="/" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>
          返回商城首页
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      background: '#f8fafc',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
      }}>
        {/* 左侧大图 */}
        <div style={{
          background: '#f1f5f9',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* 标识这是一个普通页面 */}
          <div style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            background: '#e2e8f0',
            color: '#475569',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}>
            🌎 独立详情页面渲染 (非拦截)
          </div>

          <img
            src={product.image}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
              borderRadius: '16px',
              filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.08))'
            }}
          />
        </div>

        {/* 右侧详情 */}
        <div style={{
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{
            margin: '0 0 16px 0',
            fontSize: '32px',
            color: '#0f172a',
            fontWeight: 800,
            lineHeight: 1.2
          }}>
            {product.name}
          </h2>
          <div style={{
            fontSize: '36px',
            fontWeight: 900,
            color: '#e11d48',
            marginBottom: '24px'
          }}>
            {product.price}
          </div>
          <div style={{
            borderTop: '1px solid #edf2f7',
            borderBottom: '1px solid #edf2f7',
            padding: '20px 0',
            marginBottom: '32px'
          }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#334155', fontSize: '15px' }}>产品特征：</h4>
            <p style={{
              margin: 0,
              fontSize: '15px',
              color: '#475569',
              lineHeight: 1.7
            }}>
              {product.desc}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <button style={{
              flex: 1,
              padding: '14px 28px',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              立即付款
            </button>
            <button style={{
              padding: '14px 24px',
              background: '#f1f5f9',
              color: '#475569',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              加入购物车
            </button>
          </div>

          <Link href="/" style={{
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            alignSelf: 'flex-start',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
          >
            ← 返回商城首页
          </Link>
        </div>
      </div>
    </div>
  );
}
