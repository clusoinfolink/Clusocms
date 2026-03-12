import React from 'react';

export interface StatusBadgeProps {
  status?: string;
  active?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({ status, active, activeLabel = 'Published', inactiveLabel = 'Draft' }: StatusBadgeProps) {
  const isActive = status ? status === 'published' || status === 'active' : !!active;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive
          ? 'bg-cluso-green/10 text-cluso-green'
          : 'bg-gray-100 text-gray-500'
      }`}
    >
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
}
