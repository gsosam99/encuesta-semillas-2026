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
  totalLots,
  seed,
  customSeed,
  onSeedChange,
  onCustomChange,
}) => {
  const k = String(lot.l);
  const isDanac = DANAC_SEEDS.includes(seed);

  return (
    <div
      className="bg-white rounded-[14px] py-4 px-[18px] mb-2.5 overflow-visible transition-colors"
      style={{
        border: `2px solid ${seed ? (isDanac ? '#bbf7d0' : '#fde68a') : '#f3f4f6'}`,
        animation: `slideUp 0.3s ease ${Math.min(index * 0.03, 0.5)}s both`,
        position: 'relative',
        zIndex: totalLots - index,
      }}
    >
      <div className="flex justify-between items-center mb-2.5">
        <div>
          <div className="font-bold text-[15px] text-gray-800">{k}</div>
          {lot.f && (
            <div className="text-xs text-gray-400 mt-px">Finca: {lot.f}</div>
          )}
        </div>
        <div
          className="py-1 px-3.5 rounded-full text-[13px] font-bold transition-all"
          style={{
            background: seed ? (isDanac ? '#dcfce7' : '#fef3c7') : '#f3f4f6',
            color: seed
              ? isDanac
                ? '#166534'
                : '#92400e'
              : '#374151',
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
        zIndex={totalLots - index}
      />
    </div>
  );
};

export default LotCard;
