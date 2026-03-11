import React from 'react';
import { PRODUCERS_DATA } from '../../data/producers';
import { PRODUCER_TOKENS } from '../../utils/tokens';
import { StoredResponse } from '../../types';

interface ProducerLinkListProps {
  allResponses: StoredResponse[];
  adminSearch: string;
  onSearchChange: (val: string) => void;
  copied: string;
  onCopyLink: (token: string) => void;
}

const ProducerLinkList: React.FC<ProducerLinkListProps> = ({
  allResponses,
  adminSearch,
  onSearchChange,
  copied,
  onCopyLink,
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
      🔗 Enlaces por Productor
    </h2>
    <p
      style={{
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 16,
        lineHeight: 1.5,
      }}
    >
      Cada productor tiene un enlace único y privado. Solo puede ver sus propios
      lotes. Copie y envíe por WhatsApp el enlace correspondiente.
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
          const token = PRODUCER_TOKENS[name];
          const ha = PRODUCERS_DATA[name].reduce((s, l) => s + l.h, 0);
          const responded = allResponses.some((r) => r.producer === name);
          const base = window.location.origin + window.location.pathname;
          const link = `${base}#${token}`;
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
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 6,
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
                <button
                  onClick={() => onCopyLink(token)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 8,
                    border: `1px solid ${copied === token ? '#16a34a' : '#d1d5db'}`,
                    background: copied === token ? '#16a34a' : '#f9fafb',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: 'inherit',
                    color: copied === token ? '#fff' : '#374151',
                    transition: 'all 0.2s',
                    minWidth: 110,
                  }}
                >
                  {copied === token ? '✓ Copiado!' : '📋 Copiar enlace'}
                </button>
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  background: '#f9fafb',
                  padding: '6px 10px',
                  borderRadius: 6,
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {link}
              </div>
            </div>
          );
        })}
    </div>
  </div>
);

export default ProducerLinkList;
