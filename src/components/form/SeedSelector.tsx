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
      className="relative"
      style={{ zIndex: open ? 9999 : zIndex }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-[11px] px-3.5 rounded-[10px] cursor-pointer flex justify-between items-center font-sans text-sm text-gray-800 transition-all"
        style={{
          border: `2px solid ${cat === 'DANAC' ? '#22c55e' : cat === 'Otros' ? '#f59e0b' : '#e5e7eb'}`,
          background:
            cat === 'DANAC' ? '#f0fdf4' : cat === 'Otros' ? '#fffbeb' : '#fff',
        }}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {value === 'Otro (especificar)' && customValue
            ? customValue
            : value || 'Seleccionar semilla...'}
        </span>
        <span className="text-[10px] opacity-40 shrink-0 ml-2">
          {open ? '\u25B2' : '\u25BC'}
        </span>
      </button>
      {cat && (
        <span
          className="absolute -top-[9px] right-3 text-white text-[10px] font-bold py-0.5 px-2.5 rounded-full tracking-wide"
          style={{
            background: cat === 'DANAC' ? '#16a34a' : '#d97706',
          }}
        >
          {cat}
        </span>
      )}
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-300 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.28)] max-h-[280px] overflow-y-auto z-[99999]">
          {SEED_OPTIONS.map((g: SeedGroup) => (
            <div key={g.category}>
              <div
                className="py-[9px] px-3.5 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-[1]"
                style={{
                  color: g.category === 'DANAC' ? '#16a34a' : '#d97706',
                  background:
                    g.category === 'DANAC' ? '#f0fdf4' : '#fffbeb',
                  borderBottom: `1px solid ${g.category === 'DANAC' ? '#dcfce7' : '#fef3c7'}`,
                }}
              >
                {g.category === 'DANAC' ? '\uD83C\uDF3F DANAC' : '\uD83D\uDCE6 Otros'}
              </div>
              {g.seeds.map((seed: string) => (
                <div
                  key={seed}
                  onClick={() => {
                    onChange(seed);
                    setOpen(false);
                  }}
                  className="py-[11px] px-3.5 cursor-pointer text-sm border-b border-gray-50 transition-colors"
                  style={{
                    background:
                      value === seed
                        ? g.category === 'DANAC'
                          ? '#dcfce7'
                          : '#fef3c7'
                        : 'transparent',
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
                  {value === seed && <span className="mr-1.5">{'\u2713'}</span>}
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
          className="mt-2 w-full py-[9px] px-3 border-2 border-amber-500 rounded-lg text-[13px] font-sans outline-none"
          style={{ boxSizing: 'border-box' }}
        />
      )}
    </div>
  );
};

export default SeedSelector;
