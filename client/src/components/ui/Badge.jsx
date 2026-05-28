import React from 'react';

const Badge = ({ children, status = 'default', className = '' }) => {
  const styles = {
    default: 'bg-zinc-800 text-zinc-300 border border-zinc-700/50',
    pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    accepted: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    in_progress: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
    rejected: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${styles[status]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
