import React from 'react';

const Spinner: React.FC = () => (
  <div style={{ textAlign: 'center', padding: 80 }}>
    <div
      style={{
        width: 36,
        height: 36,
        border: '4px solid #e5e7eb',
        borderTopColor: '#16a34a',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
        margin: '0 auto 12px',
      }}
    />
  </div>
);

export default Spinner;
