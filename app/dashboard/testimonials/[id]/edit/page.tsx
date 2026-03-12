'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassCard } from '@/components/ui/GlassCard';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    content: '',
    rating: 5,
    avatar: '',
    status: 'draft',
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/testimonials/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          name: data.name || '',
          company: data.company || '',
          role: data.role || '',
          content: data.quote || '',
          rating: data.rating || 5,
          avatar: data.avatar || '',
          status: data.active ? 'published' : 'draft',
        });
      }
      setLoading(false);
    }
    load();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const { content, status, ...rest } = form;
    const res = await fetch(`/api/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...rest, quote: content, active: status === 'published' }),
    });

    if (res.ok) {
      router.push('/dashboard/testimonials');
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to update testimonial');
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/testimonials">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Edit Testimonial</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <GlassInput label="Name" name="name" value={form.name} onChange={handleChange} required />
                  <GlassInput label="Company" name="company" value={form.company} onChange={handleChange} />
                </div>
                <GlassInput label="Role / Title" name="role" value={form.role} onChange={handleChange} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Content</label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cluso-deep/30"
                  />
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select
                    name="rating"
                    value={form.rating}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cluso-deep/30"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {'★'.repeat(n)} ({n})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cluso-deep/30"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar</label>
                <ImageUploader
                  value={form.avatar}
                  onChange={(url) => setForm((prev) => ({ ...prev, avatar: url }))}
                  folder="cluso/testimonials"
                />
              </div>
            </GlassCard>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}

            <GlassButton type="submit" variant="primary" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Update Testimonial'}
            </GlassButton>
          </div>
        </div>
      </form>
    </div>
  );
}
