import React from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  stroke?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 86,
  stroke = 7,
}) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(percentage, 100) / 100) * circ;
  const color =
    percentage >= 68.5 ? '#16a34a' : percentage >= 50 ? '#d97706' : '#dc2626';
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#f3f4f6"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'all 0.5s ease' }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: 'center',
          fontSize: size * 0.22,
          fontWeight: 800,
          fill: color,
        }}
      >
        {percentage.toFixed(1)}%
      </text>
    </svg>
  );
};

export default ProgressRing;
