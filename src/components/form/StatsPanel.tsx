import React from 'react';
import { Stats } from '../../types';
import ProgressRing from '../ui/ProgressRing';

interface StatsPanelProps {
  producerName: string;
  lotCount: number;
  totalHa: number;
  stats: Stats;
}

const StatLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
    {children}
  </div>
);

const StatsPanel: React.FC<StatsPanelProps> = ({
  producerName,
  lotCount,
  totalHa,
  stats,
}) => (
  <div className="bg-white rounded-2xl p-[22px] border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] mb-[18px]">
    <div className="flex justify-between items-start flex-wrap gap-3.5">
      <div className="flex-1 min-w-[200px]">
        <h2 className="text-xl font-extrabold text-gray-800 mb-1">
          {producerName}
        </h2>
        <div className="flex gap-3.5 text-[13px] text-gray-500 flex-wrap">
          <span>&#x1F4CD; {lotCount} lotes</span>
          <span>&#x1F4D0; {totalHa.toFixed(2)} Ha</span>
          <span>
            &#x2705; {stats.assigned}/{stats.total}
          </span>
        </div>
        <p className="text-[13px] text-gray-500 mt-2.5 leading-relaxed">
          Asigne un tipo de semilla a cada lote. Mínimo{' '}
          <strong className="text-green-800">70%</strong> de su superficie debe
          ser <strong className="text-green-800">DANAC</strong>.
        </p>
      </div>
      <div className="text-center shrink-0">
        <ProgressRing percentage={stats.danacPct} />
        <div className="text-[11px] text-gray-500 mt-0.5 font-bold">DANAC</div>
      </div>
    </div>
    <div className="mt-3.5 bg-gray-50 rounded-[10px] py-3 px-4 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-3">
      <div>
        <StatLabel>Ha DANAC</StatLabel>
        <div className="text-lg font-extrabold text-green-600">
          {stats.danacHa.toFixed(2)}
        </div>
      </div>
      <div>
        <StatLabel>Ha Otros</StatLabel>
        <div className="text-lg font-extrabold text-amber-600">
          {stats.otrosHa.toFixed(2)}
        </div>
      </div>
      <div>
        <StatLabel>Mín. DANAC</StatLabel>
        <div className="text-lg font-extrabold text-gray-700">
          {(totalHa * 0.7).toFixed(2)}
        </div>
      </div>
      <div>
        <StatLabel>Máx. Otros</StatLabel>
        <div className="text-lg font-extrabold text-gray-700">
          {(totalHa * 0.3).toFixed(2)}
        </div>
      </div>
    </div>
    {stats.allDone && stats.danacPct < 70 && (
      <div className="mt-3 py-2.5 px-3.5 bg-red-50 border border-red-200 rounded-[10px] text-[13px] text-red-600 font-medium">
        &#x26D4; DANAC: {stats.danacPct.toFixed(1)}% — necesita{' '}
        {(totalHa * 0.7 - stats.danacHa).toFixed(2)} Ha más para alcanzar 70%.
      </div>
    )}
  </div>
);

export default StatsPanel;
