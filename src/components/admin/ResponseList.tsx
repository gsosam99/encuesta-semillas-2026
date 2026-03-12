import React from 'react';
import { StoredResponse, LoteResponse } from '../../types';
import { PRODUCERS_DATA } from '../../data/producers';

interface ResponseListProps {
  allResponses: StoredResponse[];
  onRefresh: () => void;
  onExportCSV: () => void;
}

const ResponseList: React.FC<ResponseListProps> = ({
  allResponses,
  onRefresh,
  onExportCSV,
}) => (
  <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1f2937' }}>
        Respuestas ({allResponses.length}/{Object.keys(PRODUCERS_DATA).length})
      </h2>
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onRefresh}
          style={{
            padding: '7px 16px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            background: '#fff',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
            fontFamily: 'inherit',
          }}
        >
          🔄 Actualizar
        </button>
        {allResponses.length > 0 && (
          <button
            onClick={onExportCSV}
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              border: 'none',
              background: '#166534',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            📥 CSV
          </button>
        )}
      </div>
    </div>
    {allResponses.length === 0 ? (
      <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
        <p>Aún no hay respuestas</p>
      </div>
    ) : (
      allResponses.map((r: StoredResponse, i: number) => {
        const d = r.data;
        return (
          <div
            key={i}
            style={{
              background: '#fff',
              borderRadius: 14,
              padding: 18,
              marginBottom: 10,
              border: '1px solid #e5e7eb',
              animation: `slideUp 0.3s ease ${i * 0.04}s both`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#1f2937',
                  }}
                >
                  {r.producer}
                </h3>
                <p
                  style={{
                    fontSize: 11,
                    color: '#9ca3af',
                    marginTop: 2,
                  }}
                >
                  {d.timestamp
                    ? new Date(d.timestamp).toLocaleString('es-VE')
                    : ''}
                </p>
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: (d.danacPct || 0) >= 68.5 ? '#16a34a' : '#dc2626',
                }}
              >
                {(d.danacPct || 0).toFixed(1)}%
              </div>
            </div>
            <details style={{ marginTop: 10 }}>
              <summary
                style={{
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#6b7280',
                }}
              >
                Ver {(d.lotes || []).length} lotes ·{' '}
                {(d.totalHa || 0).toFixed(2)} Ha
              </summary>
              <div style={{ marginTop: 8, fontSize: 12 }}>
                {(d.lotes || []).map((lot: LoteResponse, j: number) => (
                  <div
                    key={j}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '5px 0',
                      borderBottom: '1px solid #f3f4f6',
                    }}
                  >
                    <span>
                      {lot.lote}{' '}
                      <span style={{ color: '#9ca3af' }}>({lot.ha} Ha)</span>
                    </span>
                    <span
                      style={{
                        padding: '1px 8px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        background:
                          lot.tipo === 'DANAC' ? '#dcfce7' : '#fef3c7',
                        color: lot.tipo === 'DANAC' ? '#166534' : '#92400e',
                      }}
                    >
                      {lot.customSeed || lot.semilla}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        );
      })
    )}
  </>
);

export default ResponseList;
