'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassCard } from '@/components/ui/GlassCard';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditTeamMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    role: '',
    bio: '',
    email: '',
    phone: '',
    photo: '',
    order: 0,
    socials: { linkedin: '', twitter: '' },
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/team/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || '',
          role: data.role || '',
          bio: data.bio || '',
          email: data.email || '',
          phone: data.phone || '',
          photo: data.photo || '',
          order: data.order || 0,
          socials: {
            linkedin: data.socials?.linkedin || '',
            twitter: data.socials?.twitter || '',
          },
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'order' ? Number(value) : value }));
  }

  function handleSocial(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, socials: { ...prev.socials, [name]: value } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/dashboard/team');
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to update member');
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/team">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Edit Team Member</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <GlassInput label="Name" name="name" value={form.name} onChange={handleChange} required />
                  <GlassInput label="Role / Position" name="role" value={form.role} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cluso-deep/30"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <GlassInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                  <GlassInput label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <GlassInput label="Display Order" name="order" type="number" value={String(form.order)} onChange={handleChange} />
                <div className="grid grid-cols-2 gap-4">
                  <GlassInput label="LinkedIn URL" name="linkedin" value={form.socials.linkedin} onChange={handleSocial} />
                  <GlassInput label="Twitter URL" name="twitter" value={form.socials.twitter} onChange={handleSocial} />
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                <ImageUploader
                  value={form.photo}
                  onChange={(url) => setForm((prev) => ({ ...prev, photo: url }))}
                  folder="cluso/team"
                />
              </div>
            </GlassCard>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}

            <GlassButton type="submit" variant="primary" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Update Member'}
            </GlassButton>
          </div>
        </div>
      </form>
    </div>
  );
}
