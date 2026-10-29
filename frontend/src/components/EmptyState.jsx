import React from 'react';
import { Sprout } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Sprout,
  title = 'Belum Ada Data',
  description = 'Data belum tersedia untuk bagian ini. Tambahkan data baru untuk memulai.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="glass-panel p-10 rounded-2xl text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#47C826] mb-4">
        <Icon className="w-8 h-8 opacity-80" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#AA8BAD] leading-relaxed mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-lg shadow-[#47C826]/20 hover:scale-105 transition-transform"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
