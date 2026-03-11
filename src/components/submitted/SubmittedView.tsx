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
  <div className="text-center py-[60px] px-5 animate-fadeIn">
    <div className="text-[64px] mb-4">&#x1F389;</div>
    <h2 className="text-2xl font-extrabold text-green-800 mb-2">
      ¡Respuesta Registrada!
    </h2>
    <p className="text-base text-gray-700 mb-1">{producerName}</p>
    <p className="text-sm text-gray-400 mb-8">
      {danacPct.toFixed(1)}% DANAC · {totalHa.toFixed(2)} Ha
    </p>
    <div className="bg-white rounded-[14px] p-5 border border-gray-200 max-w-[420px] mx-auto text-left">
      <h3 className="text-[13px] font-bold text-gray-500 mb-2.5">
        Resumen de selección
      </h3>
      {lotes.map((lot: Lote) => {
        const k = String(lot.l);
        const seed = selections[k];
        const isDanac = DANAC_SEEDS.includes(seed);
        return (
          <div
            key={k}
            className="flex justify-between items-center py-[5px] border-b border-gray-100 text-[13px]"
          >
            <span className="font-medium text-gray-700">
              {k} <span className="text-gray-400">({lot.h} Ha)</span>
            </span>
            <span
              className="py-0.5 px-2.5 rounded-[10px] text-[11px] font-semibold"
              style={{
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
