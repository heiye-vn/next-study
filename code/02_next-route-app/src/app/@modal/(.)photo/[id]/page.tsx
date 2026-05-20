"use client";

import React, { use } from 'react';
import { useRouter } from 'next/navigation';

const products = [
  { id: '1', name: '极客定制机械键盘', price: '¥599', desc: 'CNC全铝机身，热插拔轴体，定制PBT键帽，全键无冲突，配合炫酷RGB背光效果。', image: '/images/keyboard.png' },
  { id: '2', name: '智静无线降噪耳机', price: '¥1,299', desc: '40dB混合主动降噪，Hi-Res高解析音质，40小时超长复合续航，蛋白皮耳罩舒适佩戴。', image: '/images/headphones.png' },
  { id: '3', name: '极智商务运动手表', price: '¥1,899', desc: '全天候视网膜屏幕，精细心率血氧睡眠监测，内置双频多星GPS，5ATM专业级防水。', image: '/images/watch.png' }
];

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export default function PhotoModal({ params }: ParamsProps) {
  const { id } = use(params);
  const router = useRouter();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        产品未找到
      </div>
    );
  }

  const handleDismiss = () => {
    router.back();
  };

  return (
    <div
      onClick={handleDismiss}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease-out',
        padding: '20px'
      }}
    >
      {/* 注入动画样式 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()} // 阻止冒泡到背景遮罩
        style={{
          background: 'white',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '800px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(15, 23, 42, 0.05)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#475569',
            transition: 'background-color 0.2s',
            zIndex: 10
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.05)'}
        >
          ✕
        </button>

        {/* 左侧大图区域 */}
        <div style={{
          backgroundColor: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          borderRight: '1px solid #e2e8f0'
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              maxWidth: '100%',
              maxHeight: '350px',
              objectFit: 'contain',
              borderRadius: '12px',
              filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.06))'
            }}
          />
        </div>

        {/* 右侧详细说明信息 */}
        <div style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <span style={{
            fontSize: '12px',
            color: '#3b82f6',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px'
          }}>
            ⚡ 拦截路由渲染 (Modal)
          </span>
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '24px',
            color: '#0f172a',
            fontWeight: 700,
            lineHeight: 1.3
          }}>
            {product.name}
          </h3>
          <div style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#e11d48',
            marginBottom: '20px'
          }}>
            {product.price}
          </div>
          <p style={{
            margin: '0 0 30px 0',
            fontSize: '14px',
            color: '#475569',
            lineHeight: 1.6
          }}>
            {product.desc}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              flex: 1,
              padding: '12px 24px',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#0f172a'}
            >
              立即购买
            </button>
            <button style={{
              padding: '12px 20px',
              background: '#f1f5f9',
              color: '#475569',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
            >
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
