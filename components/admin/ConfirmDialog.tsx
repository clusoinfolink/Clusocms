'use client';

import React from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassModal } from '@/components/ui/GlassModal';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onCancel,
  onConfirm,
  title = 'Delete Item',
  message = 'Are you sure? This action cannot be undone.',
  loading = false,
}: ConfirmDialogProps) {
  const handleClose = onCancel || onClose || (() => {});
  return (
    <GlassModal open={open} onClose={handleClose}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={20} />
        </div>
        <h3 className="font-heading text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <GlassButton variant="ghost" onClick={handleClose} disabled={loading}>Cancel</GlassButton>
        <GlassButton variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </GlassButton>
      </div>
    </GlassModal>
  );
}
