import React from 'react';
import { Stats } from '../../types';

interface SubmitButtonProps {
  stats: Stats;
  canSubmit: boolean;
  submitting: boolean;
  onSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  stats,
  canSubmit,
  submitting,
  onSubmit,
}) => (
  <div className="mt-6 sticky bottom-4 z-50">
    <button
      onClick={onSubmit}
      disabled={!canSubmit || submitting}
      className="w-full p-4 rounded-[14px] border-none text-base font-bold font-sans transition-all"
      style={{
        background: canSubmit
          ? 'linear-gradient(135deg,#14532d,#16a34a)'
          : '#e5e7eb',
        color: canSubmit ? '#fff' : '#9ca3af',
        cursor: canSubmit ? 'pointer' : 'not-allowed',
        boxShadow: canSubmit ? '0 8px 30px rgba(22,163,74,0.3)' : 'none',
        animation:
          canSubmit && !submitting ? 'pulse 2s infinite' : 'none',
      }}
    >
      {submitting
        ? 'Enviando...'
        : !stats.allDone
          ? `Faltan ${stats.total - stats.assigned} lotes`
          : stats.danacPct < 70
            ? `DANAC insuficiente (${stats.danacPct.toFixed(1)}%)`
            : '\u2713 Enviar Respuesta'}
    </button>
  </div>
);

export default SubmitButton;
