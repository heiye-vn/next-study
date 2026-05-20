import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}

export default function DashboardLayout({
  children,
  analytics,
  team,
}: DashboardLayoutProps) {
  return (
    <div style={{
      padding: '30px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: 'calc(100vh - 120px)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* 仪表盘头部 */}
        <header style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '28px',
              color: '#2d3748',
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}>📊 仪表盘工作台</h2>
            <p style={{
              margin: '5px 0 0 0',
              color: '#718096',
              fontSize: '14px'
            }}>这是使用 Next.js 平行路由（Parallel Routes）构建的多视图面板</p>
          </div>
          <div style={{
            background: 'white',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#4a5568',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            🟢 实时同步中
          </div>
        </header>

        {/* 平行路由栅格布局 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 350px',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* 主内容区域 (children) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {children}
          </div>

          {/* 右侧插槽区域 (analytics & team) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* 插槽 1: @analytics */}
            <div>
              {analytics}
            </div>

            {/* 插槽 2: @team */}
            <div>
              {team}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
