import React from 'react';
import { Stats } from '../../types';
import ProgressRing from '../ui/ProgressRing';

interface StatsPanelProps {
  producerName: string;
  lotCount: number;
  totalHa: number;
  stats: Stats;
}

const statLabelStyle: React.CSSProperties = {
  fontSize: 10,
  color: '#9ca3af',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};

const StatsPanel: React.FC<StatsPanelProps> = ({
  producerName,
  lotCount,
  totalHa,
  stats,
}) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 16,
      padding: 22,
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      marginBottom: 18,
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 14,
      }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#1f2937',
            marginBottom: 4,
          }}
        >
          {producerName}
        </h2>
        <div
          style={{
            display: 'flex',
            gap: 14,
            fontSize: 13,
            color: '#6b7280',
            flexWrap: 'wrap',
          }}
        >
          <span>📍 {lotCount} lotes</span>
          <span>📐 {totalHa.toFixed(2)} Ha</span>
          <span>
            ✅ {stats.assigned}/{stats.total}
          </span>
        </div>
        <p
          style={{
            fontSize: 13,
            color: '#6b7280',
            marginTop: 10,
            lineHeight: 1.5,
          }}
        >
          Asigne un tipo de semilla a cada lote. Mínimo{' '}
          <strong style={{ color: '#166534' }}>70%</strong> de su superficie debe
          ser <strong style={{ color: '#166534' }}>DANAC</strong>.
        </p>
      </div>
      <div style={{ textAlign: 'center', flexShrink: 0 }}>
        <ProgressRing percentage={stats.danacPct} />
        <div
          style={{
            fontSize: 11,
            color: '#6b7280',
            marginTop: 2,
            fontWeight: 700,
          }}
        >
          DANAC
        </div>
      </div>
    </div>
    <div
      style={{
        marginTop: 14,
        background: '#f9fafb',
        borderRadius: 10,
        padding: '12px 16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))',
        gap: 12,
      }}
    >
      <div>
        <div style={statLabelStyle}>Ha DANAC</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#16a34a' }}>
          {stats.danacHa.toFixed(2)}
        </div>
      </div>
      <div>
        <div style={statLabelStyle}>Ha Otros</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#d97706' }}>
          {stats.otrosHa.toFixed(2)}
        </div>
      </div>
      <div>
        <div style={statLabelStyle}>Mín. DANAC</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#374151' }}>
          {(totalHa * 0.7).toFixed(2)}
        </div>
      </div>
      <div>
        <div style={statLabelStyle}>Máx. Otros</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#374151' }}>
          {(totalHa * 0.3).toFixed(2)}
        </div>
      </div>
    </div>
    {stats.allDone && stats.danacPct < 70 && (
      <div
        style={{
          marginTop: 12,
          padding: '10px 14px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 10,
          fontSize: 13,
          color: '#dc2626',
          fontWeight: 500,
        }}
      >
        ⛔ DANAC: {stats.danacPct.toFixed(1)}% — necesita{' '}
        {(totalHa * 0.7 - stats.danacHa).toFixed(2)} Ha más para alcanzar 70%.
      </div>
    )}
  </div>
);

export default StatsPanel;
