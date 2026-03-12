import React from 'react';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  children: React.ReactNode;
}

export function GlassButton({ children, variant = 'primary', className = '', ...props }: GlassButtonProps) {
  const styles: Record<string, string> = {
    primary: 'bg-cluso-green/90 border-cluso-green/30 hover:bg-cluso-green text-white shadow-[0_4px_14px_rgba(92,184,92,0.3)]',
    secondary: 'bg-cluso-deep/80 border-cluso-mid/30 hover:bg-cluso-deep text-white shadow-[0_4px_14px_rgba(59,123,214,0.3)]',
    ghost: 'bg-white/60 border-gray-200 hover:bg-white text-gray-700',
    danger: 'bg-red-500/90 border-red-500/30 hover:bg-red-600 text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)]',
  };

  return (
    <button
      className={`border font-medium px-4 py-2 rounded-xl transition-all duration-300 text-sm ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
