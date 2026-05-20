import React from 'react';

const members = [
  { name: 'Alice Lee', role: '管理员', status: 'online', color: '#319795', bg: '#e6fffa' },
  { name: 'Bob Smith', role: '开发者', status: 'away', color: '#d69e2e', bg: '#fefcbf' },
  { name: 'Charlie Wu', role: '产品经理', status: 'offline', color: '#718096', bg: '#edf2f7' }
];

export default function TeamPage() {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      border: '1px solid #e2e8f0',
    }}>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#2d3748', fontWeight: 600 }}>
        👥 团队成员 (@team)
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {members.map((member, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: '10px',
            background: '#f8fafc',
            border: '1px solid #edf2f7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: member.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {member.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#2d3748' }}>{member.name}</div>
                <div style={{ fontSize: '11px', color: '#718096' }}>{member.role}</div>
              </div>
            </div>
            <span style={{
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: '12px',
              background: member.bg,
              color: member.color,
              fontWeight: 500
            }}>
              {member.status}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '15px',
        fontSize: '12px',
        color: '#718096',
        borderTop: '1px solid #edf2f7',
        paddingTop: '10px',
        textAlign: 'center'
      }}>
        💡 另一个独立的 Parallel Route 插槽
      </div>
    </div>
  );
}
