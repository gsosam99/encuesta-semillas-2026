import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (cedula: string) => void;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, error }) => {
  const [cedula, setCedula] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cedula.trim()) onLogin(cedula);
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '60px auto 0',
        animation: 'fadeIn 0.4s',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌾</div>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#1f2937',
              marginBottom: 4,
            }}
          >
            Bienvenido
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
            Ingrese su número de cédula para acceder a la encuesta de semillas.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <label
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 700,
              color: '#374151',
              marginBottom: 6,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            }}
          >
            Cédula de Identidad
          </label>
          <input
            type="text"
            placeholder="V-12345678"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            autoFocus
            style={{
              width: '100%',
              padding: '12px 14px',
              border: `2px solid ${error ? '#fecaca' : '#e5e7eb'}`,
              borderRadius: 10,
              fontSize: 16,
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => {
              if (!error)
                (e.target as HTMLInputElement).style.borderColor = '#16a34a';
            }}
            onBlur={(e) => {
              if (!error)
                (e.target as HTMLInputElement).style.borderColor = '#e5e7eb';
            }}
          />
          {error && (
            <p
              style={{
                fontSize: 13,
                color: '#dc2626',
                marginTop: 8,
                fontWeight: 500,
              }}
            >
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={!cedula.trim()}
            style={{
              width: '100%',
              padding: 14,
              marginTop: 16,
              borderRadius: 12,
              border: 'none',
              background: cedula.trim()
                ? 'linear-gradient(135deg,#14532d,#16a34a)'
                : '#e5e7eb',
              color: cedula.trim() ? '#fff' : '#9ca3af',
              fontSize: 15,
              fontWeight: 700,
              cursor: cedula.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              boxShadow: cedula.trim()
                ? '0 6px 20px rgba(22,163,74,0.25)'
                : 'none',
              transition: 'all 0.3s',
            }}
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
