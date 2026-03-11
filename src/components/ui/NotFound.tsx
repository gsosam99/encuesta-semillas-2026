import React from 'react';

const NotFound: React.FC = () => (
  <div className="text-center py-20 animate-fadeIn">
    <div className="text-6xl mb-4">&#x1F512;</div>
    <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
      Enlace no válido
    </h2>
    <p className="text-[15px] text-gray-500 leading-relaxed">
      Este enlace no corresponde a ningún productor registrado.
      <br />
      Verifique el enlace que le fue compartido.
    </p>
  </div>
);

export default NotFound;
