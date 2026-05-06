'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassCard } from '@/components/ui/GlassCard';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: '',
    image: '',
    order: 0,
    features: [''],
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/services/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({
          title: data.title || '',
          description: data.description || '',
          icon: data.icon || '',
          image: data.image || '',
          order: data.order || 0,
          features: data.features?.length > 0 ? data.features : [''],
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

  function handleFeatureChange(index: number, value: string) {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm((prev) => ({ ...prev, features: newFeatures }));
  }

  function addFeature() {
    setForm((prev) => ({ ...prev, features: [...prev.features, ''] }));
  }

  function removeFeature(index: number) {
    if (form.features.length > 1) {
      setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        features: form.features.filter(f => f.trim() !== '')
      }),
    });

    if (res.ok) {
      router.push('/dashboard/services');
    } else {
      const data = await res.json();
      setError(typeof data.error === 'string' ? data.error : 'Failed to update service');
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/services">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="font-heading text-2xl font-bold text-gray-900">Edit Service</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <GlassCard>
          <div className="space-y-4">
            <GlassInput label="Title" name="title" value={form.title} onChange={handleChange} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cluso-deep/30"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Features (Bullet Points)</label>
              <div className="space-y-2">
                {form.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1 rounded-lg border border-gray-200 bg-white/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cluso-deep/30"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={form.features.length === 1}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-sm text-cluso-deep hover:underline font-medium"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon Image</label>
              <ImageUploader
                value={form.icon.includes('/') ? form.icon : ''}
                onChange={(url) => setForm((prev) => ({ ...prev, icon: url }))}
                folder="cluso/services/icons"
              />
              <p className="text-xs text-gray-500 mt-1">Upload an image to use as the icon, or enter a Lucide icon name below.</p>
            </div>
            
            <GlassInput label="Lucide Icon (Optional fallback)" name="iconText" value={(!form.icon.includes('/')) ? form.icon : ''} onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))} />

            <GlassInput label="Display Order" name="order" type="number" value={String(form.order)} onChange={handleChange} />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}

            <GlassButton type="submit" variant="primary" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Update Service'}
            </GlassButton>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}
