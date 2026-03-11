import React from 'react';

const NotFound: React.FC = () => (
  <div style={{ textAlign: 'center', padding: 80, animation: 'fadeIn 0.4s' }}>
    <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
    <h2
      style={{
        fontSize: 22,
        fontWeight: 800,
        color: '#1f2937',
        marginBottom: 8,
      }}
    >
      Enlace no válido
    </h2>
    <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6 }}>
      Este enlace no corresponde a ningún productor registrado.
      <br />
      Verifique el enlace que le fue compartido.
    </p>
  </div>
);

export default NotFound;
