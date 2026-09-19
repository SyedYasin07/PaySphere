import React from 'react';

const StatusBadge = ({ status, size = 'md', className = '' }) => {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-medium',
  };

  const statusStyles = {
    // Account & Wallet statuses
    ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200 dot-emerald-500',
    BLOCKED: 'bg-rose-50 text-rose-700 border-rose-200 dot-rose-500',

    // Transaction statuses
    SUCCESS: 'bg-emerald-50 text-emerald-700 border-emerald-200 dot-emerald-500',
    FAILED: 'bg-rose-50 text-rose-700 border-rose-200 dot-rose-500',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200 dot-amber-500',

    // Transaction directions
    SENT: 'bg-indigo-50 text-indigo-700 border-indigo-200 dot-indigo-500',
    RECEIVED: 'bg-teal-50 text-teal-700 border-teal-200 dot-teal-500',
  };

  const currentStyle =
    statusStyles[normalized] || 'bg-slate-50 text-slate-700 border-slate-200 dot-slate-500';

  const dotColor = currentStyle.split(' ').find((cls) => cls.startsWith('dot-'))?.replace('dot-', 'bg-') || 'bg-slate-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${currentStyle} ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>{normalized}</span>
    </span>
  );
};

export default StatusBadge;
