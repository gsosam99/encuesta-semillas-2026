import React, { useState, useRef, useCallback } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { DANAC_SEEDS, SEED_OPTIONS } from '../../data/seeds';
import { SeedGroup } from '../../types';

interface SeedSelectorProps {
  value: string;
  customValue?: string;
  onChange: (seed: string) => void;
  onCustomChange: (val: string) => void;
  zIndex: number;
}

const SeedSelector: React.FC<SeedSelectorProps> = ({
  value,
  customValue,
  onChange,
  onCustomChange,
  zIndex,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const isDanac = DANAC_SEEDS.includes(value);
  const cat: 'DANAC' | 'Otros' | null = isDanac
    ? 'DANAC'
    : value
      ? 'Otros'
      : null;

  useClickOutside(ref, useCallback(() => setOpen(false), []));

  return (
    <div
      ref={ref}
      style={{ position: 'relative', zIndex: open ? 9999 : zIndex }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '11px 14px',
          border: `2px solid ${cat === 'DANAC' ? '#22c55e' : cat === 'Otros' ? '#f59e0b' : '#e5e7eb'}`,
          borderRadius: 10,
          background:
            cat === 'DANAC' ? '#f0fdf4' : cat === 'Otros' ? '#fffbeb' : '#fff',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'inherit',
          fontSize: 14,
          color: '#1f2937',
          transition: 'all 0.2s',
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {value === 'Otro (especificar)' && customValue
            ? customValue
            : value || 'Seleccionar semilla...'}
        </span>
        <span
          style={{ fontSize: 10, opacity: 0.4, flexShrink: 0, marginLeft: 8 }}
        >
          {open ? '▲' : '▼'}
        </span>
      </button>
      {cat && (
        <span
          style={{
            position: 'absolute',
            top: -9,
            right: 12,
            background: cat === 'DANAC' ? '#16a34a' : '#d97706',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '2px 10px',
            borderRadius: 20,
            letterSpacing: 0.5,
          }}
        >
          {cat}
        </span>
      )}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: 12,
            boxShadow: '0 20px 60px rgba(0,0,0,0.28)',
            maxHeight: 280,
            overflowY: 'auto',
            zIndex: 99999,
          }}
        >
          {SEED_OPTIONS.map((g: SeedGroup) => (
            <div key={g.category}>
              <div
                style={{
                  padding: '9px 14px',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  color: g.category === 'DANAC' ? '#16a34a' : '#d97706',
                  background: g.category === 'DANAC' ? '#f0fdf4' : '#fffbeb',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  borderBottom: `1px solid ${g.category === 'DANAC' ? '#dcfce7' : '#fef3c7'}`,
                }}
              >
                {g.category === 'DANAC' ? '🌿 DANAC' : '📦 Otros'}
              </div>
              {g.seeds.map((seed: string) => (
                <div
                  key={seed}
                  onClick={() => {
                    onChange(seed);
                    setOpen(false);
                  }}
                  style={{
                    padding: '11px 14px',
                    cursor: 'pointer',
                    fontSize: 14,
                    background:
                      value === seed
                        ? g.category === 'DANAC'
                          ? '#dcfce7'
                          : '#fef3c7'
                        : 'transparent',
                    borderBottom: '1px solid #f9fafb',
                    transition: 'background 0.1s',
                    fontWeight: value === seed ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (value !== seed)
                      (e.currentTarget as HTMLDivElement).style.background =
                        '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      value === seed
                        ? g.category === 'DANAC'
                          ? '#dcfce7'
                          : '#fef3c7'
                        : 'transparent';
                  }}
                >
                  {value === seed && <span style={{ marginRight: 6 }}>✓</span>}
                  {seed}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {value === 'Otro (especificar)' && (
        <input
          type="text"
          placeholder="Escriba el nombre de la semilla..."
          value={customValue || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onCustomChange(e.target.value)
          }
          style={{
            marginTop: 8,
            width: '100%',
            padding: '9px 12px',
            border: '2px solid #f59e0b',
            borderRadius: 8,
            fontSize: 13,
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
      )}
    </div>
  );
};

export default SeedSelector;
