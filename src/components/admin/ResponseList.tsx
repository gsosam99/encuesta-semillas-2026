import React from 'react';
import { StoredResponse, LoteResponse } from '../../types';
import { PRODUCERS_DATA } from '../../data/producers';

interface ResponseListProps {
  allResponses: StoredResponse[];
  onRefresh: () => void;
  onExportCSV: () => void;
}

const ResponseList: React.FC<ResponseListProps> = ({
  allResponses,
  onRefresh,
  onExportCSV,
}) => (
  <>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-extrabold text-gray-800">
        Respuestas ({allResponses.length}/{Object.keys(PRODUCERS_DATA).length})
      </h2>
      <div className="flex gap-2">
        <button
          onClick={onRefresh}
          className="py-[7px] px-4 rounded-lg border border-gray-300 bg-white cursor-pointer text-xs font-semibold font-sans"
        >
          &#x1F504; Actualizar
        </button>
        {allResponses.length > 0 && (
          <button
            onClick={onExportCSV}
            className="py-[7px] px-4 rounded-lg border-none bg-green-900 text-white cursor-pointer text-xs font-semibold font-sans"
          >
            &#x1F4E5; CSV
          </button>
        )}
      </div>
    </div>
    {allResponses.length === 0 ? (
      <div className="text-center py-10 text-gray-400">
        <div className="text-[40px] mb-2">&#x1F4CB;</div>
        <p>Aún no hay respuestas</p>
      </div>
    ) : (
      allResponses.map((r: StoredResponse, i: number) => {
        const d = r.data;
        return (
          <div
            key={i}
            className="bg-white rounded-[14px] p-[18px] mb-2.5 border border-gray-200"
            style={{ animation: `slideUp 0.3s ease ${i * 0.04}s both` }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-[15px] font-bold text-gray-800">
                  {r.producer}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {d.timestamp
                    ? new Date(d.timestamp).toLocaleString('es-VE')
                    : ''}
                </p>
              </div>
              <div
                className="text-xl font-extrabold"
                style={{
                  color: (d.danacPct || 0) >= 70 ? '#16a34a' : '#dc2626',
                }}
              >
                {(d.danacPct || 0).toFixed(1)}%
              </div>
            </div>
            <details className="mt-2.5">
              <summary className="cursor-pointer text-xs font-semibold text-gray-500">
                Ver {(d.lotes || []).length} lotes ·{' '}
                {(d.totalHa || 0).toFixed(2)} Ha
              </summary>
              <div className="mt-2 text-xs">
                {(d.lotes || []).map((lot: LoteResponse, j: number) => (
                  <div
                    key={j}
                    className="flex justify-between py-[5px] border-b border-gray-50"
                  >
                    <span>
                      {lot.lote}{' '}
                      <span className="text-gray-400">({lot.ha} Ha)</span>
                    </span>
                    <span
                      className="py-px px-2 rounded-lg text-[11px] font-semibold"
                      style={{
                        background:
                          lot.tipo === 'DANAC' ? '#dcfce7' : '#fef3c7',
                        color: lot.tipo === 'DANAC' ? '#166534' : '#92400e',
                      }}
                    >
                      {lot.customSeed || lot.semilla}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          </div>
        );
      })
    )}
  </>
);

export default ResponseList;
