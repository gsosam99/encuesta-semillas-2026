import React from 'react';
import { PRODUCERS_DATA } from '../../data/producers';
import { PRODUCER_TOKENS } from '../../utils/tokens';
import { StoredResponse } from '../../types';

interface ProducerLinkListProps {
  allResponses: StoredResponse[];
  adminSearch: string;
  onSearchChange: (val: string) => void;
  copied: string;
  onCopyLink: (token: string) => void;
}

const ProducerLinkList: React.FC<ProducerLinkListProps> = ({
  allResponses,
  adminSearch,
  onSearchChange,
  copied,
  onCopyLink,
}) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.04)] mb-6">
    <h2 className="text-xl font-extrabold text-gray-800 mb-1">
      &#x1F517; Enlaces por Productor
    </h2>
    <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">
      Cada productor tiene un enlace único y privado. Solo puede ver sus propios
      lotes. Copie y envíe por WhatsApp el enlace correspondiente.
    </p>
    <input
      type="text"
      placeholder="Buscar productor..."
      value={adminSearch}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full py-2.5 px-3.5 border-2 border-gray-200 rounded-[10px] text-sm font-sans mb-3.5 outline-none focus:border-green-600"
    />
    <div className="max-h-[420px] overflow-y-auto">
      {Object.keys(PRODUCERS_DATA)
        .sort()
        .filter((n) => n.toLowerCase().includes(adminSearch.toLowerCase()))
        .map((name, i) => {
          const token = PRODUCER_TOKENS[name];
          const ha = PRODUCERS_DATA[name].reduce((s, l) => s + l.h, 0);
          const responded = allResponses.some((r) => r.producer === name);
          const base = window.location.origin + window.location.pathname;
          const link = `${base}#${token}`;
          return (
            <div
              key={name}
              className="py-3 px-3.5 rounded-xl mb-1.5"
              style={{
                border: `1px solid ${responded ? '#bbf7d0' : '#f3f4f6'}`,
                background: responded ? '#f0fdf4' : '#fff',
                animation: `slideUp 0.2s ease ${i * 0.015}s both`,
              }}
            >
              <div className="flex justify-between items-center mb-1.5">
                <div>
                  <span className="font-semibold text-sm text-gray-800">
                    {responded && (
                      <span className="text-green-600 mr-1">{'\u2713'}</span>
                    )}
                    {name}
                  </span>
                  <span className="text-xs text-gray-400 ml-2.5">
                    {PRODUCERS_DATA[name].length} lotes · {ha.toFixed(1)} Ha
                  </span>
                </div>
                <button
                  onClick={() => onCopyLink(token)}
                  className="py-1.5 px-3.5 rounded-lg text-xs font-semibold font-sans transition-all min-w-[110px]"
                  style={{
                    border: `1px solid ${copied === token ? '#16a34a' : '#d1d5db'}`,
                    background: copied === token ? '#16a34a' : '#f9fafb',
                    color: copied === token ? '#fff' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  {copied === token
                    ? '\u2713 Copiado!'
                    : '\uD83D\uDCCB Copiar enlace'}
                </button>
              </div>
              <div className="text-[11px] text-gray-400 bg-gray-50 py-1.5 px-2.5 rounded-md font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                {link}
              </div>
            </div>
          );
        })}
    </div>
  </div>
);

export default ProducerLinkList;
