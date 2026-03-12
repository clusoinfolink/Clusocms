'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlassButton } from '@/components/ui/GlassButton';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ServiceItem {
  [key: string]: unknown;
  _id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const res = await fetch('/api/services');
    if (res.ok) setServices(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/services/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setServices(services.filter((s) => s._id !== deleteId));
    setDeleteId(null);
  }

  const columns = [
    { key: 'title' as const, label: 'Title' },
    {
      key: 'description' as const,
      label: 'Description',
      render: (val: unknown) => <span className="line-clamp-1">{val as string}</span>,
    },
    { key: 'icon' as const, label: 'Icon' },
    { key: 'order' as const, label: 'Order' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Services</h1>
        <Link href="/dashboard/services/new">
          <GlassButton variant="primary">
            <Plus size={18} className="mr-1" /> Add Service
          </GlassButton>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <Link href={`/dashboard/services/${row._id}/edit`}>
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
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
