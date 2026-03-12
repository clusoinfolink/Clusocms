import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark' | 'blue';
  className?: string;
}

export function GlassCard({ children, variant = 'light', className = '' }: GlassCardProps) {
  const base = variant === 'dark'
    ? 'glass-dark'
    : variant === 'blue'
    ? 'glass-blue'
    : 'glass';

  return (
    <div className={`${base} p-6 ${className}`}>
      {children}
    </div>
  );
}
