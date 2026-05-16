'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlassButton } from '@/components/ui/GlassButton';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';

interface JobPost {
  [key: string]: unknown;
  _id: string;
  title: string;
  slug: string;
  status: string;
  department: string;
  location: string;
  type: string;
  jobId?: string;
  expiryDate?: string;
  createdAt: string;
}

export default function CareersListPage() {
  const [posts, setPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const res = await fetch('/api/careers');
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteSlug) return;
    const res = await fetch(`/api/careers/${deleteSlug}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts(posts.filter((p) => p.slug !== deleteSlug));
    }
    setDeleteSlug(null);
  }

  const columns = [
    { key: 'jobId' as const, label: 'Job ID' },
    { key: 'title' as const, label: 'Title' },
    { key: 'department' as const, label: 'Department' },
    { key: 'type' as const, label: 'Type' },
    {
      key: 'status' as const,
      label: 'Status',
      render: (val: unknown, row: any) => {
        let isExpired = false;
        if (row.expiryDate && new Date(row.expiryDate).getTime() < Date.now()) {
          isExpired = true;
        }
        return (
          <div className="flex gap-2 items-center">
            <StatusBadge status={val as string} />
            {isExpired && <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-medium">Archived</span>}
          </div>
        );
      },
    },
    {
      key: 'createdAt' as const,
      label: 'Created',
      render: (val: unknown) => new Date(val as string).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Careers</h1>
        <Link href="/dashboard/careers/new">
          <GlassButton variant="primary">
            <Plus size={18} className="mr-1" /> New Job
          </GlassButton>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <a 
              href={`http://localhost:3001/careers/${row.slug}`} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="View live">
                <Eye size={16} />
              </button>
            </a>
            <Link href={`/dashboard/careers/${row.slug}/edit`}>
              <button className="p-1.5 text-cluso-deep hover:bg-cluso-deep/10 rounded-lg transition-colors" title="Edit">
                <Pencil size={16} />
              </button>
            </Link>
            <button
              onClick={() => setDeleteSlug(row.slug)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!deleteSlug}
        title="Delete Job Post"
        message="Are you sure you want to delete this job post? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteSlug(null)}
      />
    </div>
  );
}
