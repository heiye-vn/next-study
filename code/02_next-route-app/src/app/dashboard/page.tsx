import React from 'react';

export default function DashboardPage() {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.6)'
    }}>
      <h3 style={{
        marginTop: 0,
        color: '#1a202c',
        fontSize: '20px',
        fontWeight: 600
      }}>👋 欢迎回来，管理员！</h3>
      
      <p style={{
        color: '#4a5568',
        lineHeight: 1.6,
        fontSize: '15px'
      }}>
        这里是仪表盘的<strong>主内容区域（渲染为 layout.tsx 中的 children）</strong>。
        你可以通过平行路由，在右侧同时看到 <strong>数据分析 (@analytics)</strong> 和 <strong>团队管理 (@team)</strong> 两个独立的视图。
      </p>

      <div style={{
        marginTop: '24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>🚀 快速开始</h4>
          <span style={{ fontSize: '12px', opacity: 0.9 }}>配置您的电商首选项</span>
        </div>

        <div style={{
          padding: '16px',
          background: 'white',
          color: '#2d3748',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
        }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#4a5568' }}>⚙️ 系统设置</h4>
          <span style={{ fontSize: '12px', color: '#718096' }}>管理全局权限与缓存</span>
        </div>
      </div>
    </div>
  );
}
