import React from 'react';
import { Lote } from '../../types';
import { DANAC_SEEDS } from '../../data/seeds';

interface SubmittedViewProps {
  producerName: string;
  lotes: Lote[];
  totalHa: number;
  danacPct: number;
  selections: Record<string, string>;
  customSeeds: Record<string, string>;
}

const SubmittedView: React.FC<SubmittedViewProps> = ({
  producerName,
  lotes,
  totalHa,
  danacPct,
  selections,
  customSeeds,
}) => (
  <div
    style={{
      textAlign: 'center',
      padding: '60px 20px',
      animation: 'fadeIn 0.5s',
    }}
  >
    <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
    <h2
      style={{
        fontSize: 24,
        fontWeight: 800,
        color: '#166534',
        marginBottom: 8,
      }}
    >
      ¡Respuesta Registrada!
    </h2>
    <p style={{ fontSize: 16, color: '#374151', marginBottom: 4 }}>
      {producerName}
    </p>
    <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 32 }}>
      {danacPct.toFixed(1)}% DANAC · {totalHa.toFixed(2)} Ha
    </p>
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: 20,
        border: '1px solid #e5e7eb',
        maxWidth: 420,
        margin: '0 auto',
        textAlign: 'left',
      }}
    >
      <h3
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: '#6b7280',
          marginBottom: 10,
        }}
      >
        Resumen de selección
      </h3>
      {lotes.map((lot: Lote) => {
        const k = String(lot.l);
        const seed = selections[k];
        const isDanac = DANAC_SEEDS.includes(seed);
        return (
          <div
            key={k}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '5px 0',
              borderBottom: '1px solid #f3f4f6',
              fontSize: 13,
            }}
          >
            <span style={{ fontWeight: 500, color: '#374151' }}>
              {k} <span style={{ color: '#9ca3af' }}>({lot.h} Ha)</span>
            </span>
            <span
              style={{
                padding: '2px 10px',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 600,
                background: isDanac ? '#dcfce7' : '#fef3c7',
                color: isDanac ? '#166534' : '#92400e',
              }}
            >
              {customSeeds[k] || seed}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

export default SubmittedView;
