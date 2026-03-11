import React from 'react';
import { AppMode } from '../../types';

interface HeaderProps {
  mode: AppMode;
}

const Header: React.FC<HeaderProps> = ({ mode }) => (
  <div
    style={{
      background: 'linear-gradient(135deg,#14532d 0%,#166534 40%,#4d7c0f 100%)',
      padding: '22px 20px 16px',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: -50,
        right: -30,
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)',
      }}
    />
    <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 24 }}>🌾</span>
        <h1
          style={{
            fontFamily: "'Playfair Display',serif",
            fontSize: 21,
            fontWeight: 800,
          }}
        >
          Encuesta de Semillas
        </h1>
      </div>
      {mode === 'form' && (
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 3 }}>
          Selección de semilla por Lote Muestreo
        </p>
      )}
      {mode === 'admin' && (
        <p style={{ fontSize: 13, opacity: 0.8, marginTop: 3 }}>
          Panel de administración
        </p>
      )}
    </div>
  </div>
);

export default Header;
