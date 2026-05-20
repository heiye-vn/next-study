import React from 'react';

export default function AnalyticsPage() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      border: '1px solid #e2e8f0',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h4 style={{ margin: 0, fontSize: '16px', color: '#2d3748', fontWeight: 600 }}>
          📈 数据分析 (@analytics)
        </h4>
        <span style={{
          fontSize: '11px',
          background: '#e6fffa',
          color: '#319795',
          padding: '2px 8px',
          borderRadius: '12px',
          fontWeight: 600
        }}>
          +12.4%
        </span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <span style={{ fontSize: '12px', color: '#a0aec0' }}>今日访客数</span>
        <div style={{ fontSize: '28px', fontWeight: 700, color: '#1a202c', marginTop: '2px' }}>
          28,450
        </div>
      </div>

      {/* 极简的模拟趋势图表 (SVG) */}
      <div style={{ height: '60px', width: '100%', marginTop: '10px' }}>
        <svg viewBox="0 0 100 30" width="100%" height="100%" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3182ce" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3182ce" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M0,25 Q15,10 30,18 T60,8 T90,15 L100,5 L100,30 L0,30 Z"
            fill="url(#chartGradient)"
          />
          <path
            d="M0,25 Q15,10 30,18 T60,8 T90,15 L100,5"
            fill="none"
            stroke="#3182ce"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div style={{
        marginTop: '15px',
        fontSize: '12px',
        color: '#718096',
        borderTop: '1px solid #edf2f7',
        paddingTop: '10px',
        textAlign: 'center'
      }}>
        🔍 此卡片是一个独立的 Parallel Route 插槽
      </div>
    </div>
  );
}
