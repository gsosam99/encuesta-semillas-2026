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
  <div
    style={{
      marginTop: 24,
      position: 'sticky',
      bottom: 16,
      zIndex: 50,
    }}
  >
    <button
      onClick={onSubmit}
      disabled={!canSubmit || submitting}
      style={{
        width: '100%',
        padding: 16,
        borderRadius: 14,
        border: 'none',
        background: canSubmit
          ? 'linear-gradient(135deg,#14532d,#16a34a)'
          : '#e5e7eb',
        color: canSubmit ? '#fff' : '#9ca3af',
        fontSize: 16,
        fontWeight: 700,
        cursor: canSubmit ? 'pointer' : 'not-allowed',
        fontFamily: 'inherit',
        boxShadow: canSubmit
          ? '0 8px 30px rgba(22,163,74,0.3)'
          : 'none',
        transition: 'all 0.3s',
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
            : '✓ Enviar Respuesta'}
    </button>
  </div>
);

export default SubmitButton;
