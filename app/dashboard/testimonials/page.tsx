'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlassButton } from '@/components/ui/GlassButton';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface TestimonialItem {
  [key: string]: unknown;
  _id: string;
  name: string;
  company: string;
  status: string;
  rating: number;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    const res = await fetch('/api/testimonials');
    if (res.ok) setTestimonials(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/testimonials/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setTestimonials(testimonials.filter((t) => t._id !== deleteId));
    setDeleteId(null);
  }

  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'company' as const, label: 'Company' },
    {
      key: 'rating' as const,
      label: 'Rating',
      render: (val: unknown) => <span>{'★'.repeat(val as number)}{'☆'.repeat(5 - (val as number))}</span>,
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (val: unknown) => <StatusBadge status={val as string} />,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Testimonials</h1>
        <Link href="/dashboard/testimonials/new">
          <GlassButton variant="primary">
            <Plus size={18} className="mr-1" /> Add Testimonial
          </GlassButton>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={testimonials}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <Link href={`/dashboard/testimonials/${row._id}/edit`}>
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
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
