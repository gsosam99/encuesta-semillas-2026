import React from 'react';
import { AppMode } from '../../types';

interface HeaderProps {
  mode: AppMode;
}

const Header: React.FC<HeaderProps> = ({ mode }) => (
  <div className="relative overflow-hidden px-5 pt-[22px] pb-4 text-white bg-gradient-to-br from-green-950 via-green-800 to-lime-700">
    <div className="absolute -top-[50px] -right-[30px] w-[180px] h-[180px] rounded-full bg-white/[0.06]" />
    <div className="max-w-[680px] mx-auto relative">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl">&#x1F33E;</span>
        <h1 className="font-display text-[21px] font-extrabold">
          Encuesta de Semillas
        </h1>
      </div>
      {mode === 'form' && (
        <p className="text-[13px] opacity-80 mt-0.5">
          Selección de semilla por Lote Muestreo
        </p>
      )}
      {mode === 'admin' && (
        <p className="text-[13px] opacity-80 mt-0.5">
          Panel de administración
        </p>
      )}
    </div>
  </div>
);

export default Header;
