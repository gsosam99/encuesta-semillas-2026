import React from 'react';
import { Lote } from '../../types';
import { DANAC_SEEDS } from '../../data/seeds';
import SeedSelector from './SeedSelector';

interface LotCardProps {
  lot: Lote;
  index: number;
  totalLots: number;
  seed: string;
  customSeed?: string;
  onSeedChange: (seed: string) => void;
  onCustomChange: (val: string) => void;
}

const LotCard: React.FC<LotCardProps> = ({
  lot,
  index,
  seed,
  customSeed,
  onSeedChange,
  onCustomChange,
}) => {
  const k = String(lot.l);
  const isDanac = DANAC_SEEDS.includes(seed);

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: '16px 18px',
        marginBottom: 10,
        border: `2px solid ${seed ? (isDanac ? '#bbf7d0' : '#fde68a') : '#f3f4f6'}`,
        animation: `slideUp 0.3s ease ${Math.min(index * 0.03, 0.5)}s both`,
        transition: 'border-color 0.3s',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1f2937' }}>
            {k}
          </div>
          {lot.f && (
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>
              Finca: {lot.f}
            </div>
          )}
        </div>
        <div
          style={{
            padding: '4px 14px',
            borderRadius: 20,
            background: seed
              ? isDanac
                ? '#dcfce7'
                : '#fef3c7'
              : '#f3f4f6',
            fontSize: 13,
            fontWeight: 700,
            color: seed
              ? isDanac
                ? '#166534'
                : '#92400e'
              : '#374151',
            transition: 'all 0.3s',
          }}
        >
          {lot.h} Ha
        </div>
      </div>
      <SeedSelector
        value={seed || ''}
        customValue={customSeed}
        onChange={onSeedChange}
        onCustomChange={onCustomChange}
      />
    </div>
  );
};

export default LotCard;
