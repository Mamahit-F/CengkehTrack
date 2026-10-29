import React from 'react';

export const LoadingSpinner = ({ text = 'Memuat data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#47C826] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#47C826]"></div>
        </div>
      </div>
      <p className="text-sm font-medium text-[#AA8BAD] animate-pulse">{text}</p>
    </div>
  );
};
