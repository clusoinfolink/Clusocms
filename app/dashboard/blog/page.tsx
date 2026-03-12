'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlassButton } from '@/components/ui/GlassButton';
import { DataTable } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface BlogPost {
  [key: string]: unknown;
  _id: string;
  title: string;
  slug: string;
  status: string;
  author: string;
  createdAt: string;
}

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const res = await fetch('/api/blog');
    if (res.ok) setPosts(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteSlug) return;
    const res = await fetch(`/api/blog/${deleteSlug}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts(posts.filter((p) => p.slug !== deleteSlug));
    }
    setDeleteSlug(null);
  }

  const columns = [
    { key: 'title' as const, label: 'Title' },
    { key: 'author' as const, label: 'Author' },
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
        <h1 className="font-heading text-2xl font-bold text-gray-900">Blog Posts</h1>
        <Link href="/dashboard/blog/new">
          <GlassButton variant="primary">
            <Plus size={18} className="mr-1" /> New Post
          </GlassButton>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <Link href={`/dashboard/blog/${row.slug}/edit`}>
              <button className="p-1.5 text-cluso-deep hover:bg-cluso-deep/10 rounded-lg transition-colors">
                <Pencil size={16} />
              </button>
            </Link>
            <button
              onClick={() => setDeleteSlug(row.slug)}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      <ConfirmDialog
        open={!!deleteSlug}
        title="Delete Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteSlug(null)}
      />
    </div>
  );
}
