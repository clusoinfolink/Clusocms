'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlassButton } from '@/components/ui/GlassButton';
import { DataTable } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Member {
  [key: string]: unknown;
  _id: string;
  name: string;
  role: string;
  email: string;
  order: number;
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    const res = await fetch('/api/team');
    if (res.ok) setMembers(await res.json());
    setLoading(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/team/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setMembers(members.filter((m) => m._id !== deleteId));
    setDeleteId(null);
  }

  const columns = [
    { key: 'name' as const, label: 'Name' },
    { key: 'role' as const, label: 'Role' },
    { key: 'email' as const, label: 'Email' },
    { key: 'order' as const, label: 'Order' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Team Members</h1>
        <Link href="/dashboard/team/new">
          <GlassButton variant="primary">
            <Plus size={18} className="mr-1" /> Add Member
          </GlassButton>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        actions={(row) => (
          <div className="flex gap-2">
            <Link href={`/dashboard/team/${row._id}/edit`}>
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
        title="Delete Member"
        message="Are you sure you want to remove this team member?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
