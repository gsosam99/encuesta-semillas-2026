import React from 'react';
import { Lote, Stats } from '../../types';
import StatsPanel from './StatsPanel';
import LotCard from './LotCard';
import SubmitButton from './SubmitButton';

interface ProducerFormProps {
  producerName: string;
  lotes: Lote[];
  totalHa: number;
  stats: Stats;
  selections: Record<string, string>;
  customSeeds: Record<string, string>;
  canSubmit: boolean;
  submitting: boolean;
  onSeedChange: (lotKey: string, seed: string) => void;
  onCustomChange: (lotKey: string, val: string) => void;
  onSubmit: () => void;
}

const ProducerForm: React.FC<ProducerFormProps> = ({
  producerName,
  lotes,
  totalHa,
  stats,
  selections,
  customSeeds,
  canSubmit,
  submitting,
  onSeedChange,
  onCustomChange,
  onSubmit,
}) => (
  <div style={{ animation: 'fadeIn 0.4s' }}>
    <StatsPanel
      producerName={producerName}
      lotCount={lotes.length}
      totalHa={totalHa}
      stats={stats}
    />

    {lotes.map((lot: Lote, i: number) => {
      const k = String(lot.l);
      return (
        <LotCard
          key={k}
          lot={lot}
          index={i}
          totalLots={lotes.length}
          seed={selections[k] || ''}
          customSeed={customSeeds[k]}
          onSeedChange={(s) => onSeedChange(k, s)}
          onCustomChange={(v) => onCustomChange(k, v)}
        />
      );
    })}

    <SubmitButton
      stats={stats}
      canSubmit={canSubmit}
      submitting={submitting}
      onSubmit={onSubmit}
    />
  </div>
);

export default ProducerForm;
