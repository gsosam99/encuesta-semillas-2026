import React from 'react';
import { PRODUCERS_DATA } from '../../data/producers';
import { StoredResponse } from '../../types';

interface ProducerStatusListProps {
  allResponses: StoredResponse[];
  adminSearch: string;
  onSearchChange: (val: string) => void;
}

const ProducerStatusList: React.FC<ProducerStatusListProps> = ({
  allResponses,
  adminSearch,
  onSearchChange,
}) => (
  <div
    style={{
      background: '#fff',
      borderRadius: 16,
      padding: 24,
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      marginBottom: 24,
    }}
  >
    <h2
      style={{
        fontSize: 20,
        fontWeight: 800,
        color: '#1f2937',
        marginBottom: 4,
      }}
    >
      👥 Estado por Productor
    </h2>
    <p
      style={{
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 16,
        lineHeight: 1.5,
      }}
    >
      Seguimiento del estado de respuestas por productor.
    </p>
    <input
      type="text"
      placeholder="Buscar productor..."
      value={adminSearch}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onSearchChange(e.target.value)
      }
      style={{
        width: '100%',
        padding: '10px 14px',
        border: '2px solid #e5e7eb',
        borderRadius: 10,
        fontSize: 14,
        fontFamily: 'inherit',
        marginBottom: 14,
        outline: 'none',
      }}
      onFocus={(e) =>
        ((e.target as HTMLInputElement).style.borderColor = '#16a34a')
      }
      onBlur={(e) =>
        ((e.target as HTMLInputElement).style.borderColor = '#e5e7eb')
      }
    />
    <div style={{ maxHeight: 420, overflowY: 'auto' }}>
      {Object.keys(PRODUCERS_DATA)
        .sort()
        .filter((n: string) =>
          n.toLowerCase().includes(adminSearch.toLowerCase())
        )
        .map((name: string, i: number) => {
          const ha = PRODUCERS_DATA[name].reduce((s, l) => s + l.h, 0);
          const responded = allResponses.some((r) => r.producer === name);
          return (
            <div
              key={name}
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                marginBottom: 6,
                border: `1px solid ${responded ? '#bbf7d0' : '#f3f4f6'}`,
                background: responded ? '#f0fdf4' : '#fff',
                animation: `slideUp 0.2s ease ${i * 0.015}s both`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: '#1f2937',
                  }}
                >
                  {responded && (
                    <span style={{ color: '#16a34a', marginRight: 4 }}>
                      ✓
                    </span>
                  )}
                  {name}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: '#9ca3af',
                    marginLeft: 10,
                  }}
                >
                  {PRODUCERS_DATA[name].length} lotes · {ha.toFixed(1)} Ha
                </span>
              </div>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: responded ? '#dcfce7' : '#f3f4f6',
                  color: responded ? '#166534' : '#9ca3af',
                }}
              >
                {responded ? 'Respondido' : 'Pendiente'}
              </span>
            </div>
          );
        })}
    </div>
  </div>
);

export default ProducerStatusList;
