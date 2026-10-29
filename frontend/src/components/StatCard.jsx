import React from 'react';

export const StatCard = ({ title, value, unit, subtitle, icon: Icon, accent = 'green', trend }) => {
  const accentStyles = {
    green: {
      border: 'hover:border-[#47C826]/40',
      iconBg: 'bg-[#47C826]/15 text-[#47C826]',
      glow: 'shadow-[#47C826]/10',
    },
    orange: {
      border: 'hover:border-[#D97706]/40',
      iconBg: 'bg-[#D97706]/15 text-[#D97706]',
      glow: 'shadow-[#D97706]/10',
    },
    emerald: {
      border: 'hover:border-emerald-400/40',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
      glow: 'shadow-emerald-500/10',
    },
  }[accent] || {
    border: 'hover:border-[#47C826]/40',
    iconBg: 'bg-[#47C826]/15 text-[#47C826]',
    glow: 'shadow-[#47C826]/10',
  };

  return (
    <div className={`glass-panel glass-panel-hover p-6 rounded-2xl ${accentStyles.border} ${accentStyles.glow} transition-all`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#AA8BAD]">
          {title}
        </span>
        {Icon && (
          <div className={`p-3 rounded-xl ${accentStyles.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          {value}
        </h3>
        {unit && <span className="text-sm font-semibold text-[#47C826]">{unit}</span>}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-[#AA8BAD] leading-normal flex items-center justify-between">
          <span>{subtitle}</span>
          {trend && <span className="text-[#47C826] font-medium">{trend}</span>}
        </p>
      )}
    </div>
  );
};
