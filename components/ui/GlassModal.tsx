'use client';

import React from 'react';

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function GlassModal({ open, onClose, children }: GlassModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
}
