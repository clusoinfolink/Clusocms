'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlassButton } from '@/components/ui/GlassButton';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Notice {
  [key: string]: unknown;
  _id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    const res = await fetch('/api/notices');
    if (res.ok) setNotices(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/notices/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setNotices(notices.filter((n) => n._id !== deleteId));
    setDeleteId(null);
  }

  const columns = [
    { key: 'title' as const, label: 'Title' },
    { key: 'priority' as const, label: 'Priority' },
    {
      key: 'status' as const,
      label: 'Status',
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
    {
      key: 'createdAt' as const,
      label: 'Date',
      render: (val: unknown) => new Date(val as string).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Notices</h1>
        <Link href="/dashboard/notices/new">
          <GlassButton variant="primary">
            <Plus size={18} className="mr-1" /> New Notice
          </GlassButton>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={notices}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <Link href={`/dashboard/notices/${row._id}/edit`}>
              <button className="p-1.5 text-cluso-deep hover:bg-cluso-deep/10 rounded-lg transition-colors">
                <Pencil size={16} />
              </button>
            </Link>
            <button
              onClick={() => setDeleteId(row._id)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Notice"
        message="Are you sure you want to delete this notice?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
