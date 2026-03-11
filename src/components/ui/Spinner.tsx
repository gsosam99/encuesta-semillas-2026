import React from 'react';

const Spinner: React.FC = () => (
  <div className="text-center py-20">
    <div
      className="w-9 h-9 border-4 border-gray-200 border-t-green-600 rounded-full mx-auto mb-3"
      style={{ animation: 'spin 0.7s linear infinite' }}
    />
  </div>
);

export default Spinner;
