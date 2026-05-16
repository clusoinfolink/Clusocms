'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassButton } from '@/components/ui/GlassButton';
import { GlassInput } from '@/components/ui/GlassInput';
import { LUCIDE_ICONS_LIST } from '@/lib/icons';
import { GlassSelect } from '@/components/ui/GlassSelect';
import { GlassCard } from '@/components/ui/GlassCard';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewServicePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([
    { value: 'India', label: 'India' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'USA', label: 'USA' },
    { value: 'Global', label: 'Global' },
  ]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.serviceCountries && data.serviceCountries.length > 0) {
            setCountries(data.serviceCountries.map((c: string) => ({ value: c, label: c })));
          }
        }
      } catch (e) {
        console.error('Failed to fetch settings', e);
      }
    }
    fetchSettings();
  }, []);

  const [form, setForm] = useState({
    title: '',
    description: '',
    icon: '',
    image: '',
    country: 'India',
    countries: ['India'],
    order: 0,
    features: [''],
  });

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

    const res = await fetch('/api/services', {
      method: 'POST',
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
      setError(typeof data.error === 'string' ? data.error : 'Failed to create service');
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/services">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </button>
        </Link>
        <h1 className="font-heading text-2xl font-bold text-gray-900">New Service</h1>
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
                value={form.icon}
                onChange={(url) => setForm((prev) => ({ ...prev, icon: url }))}
                folder="cluso/services/icons"
              />
              <p className="text-xs text-gray-500 mt-1">Upload an image to use as the icon, or enter a Lucide icon name below if empty.</p>
            </div>
            
            <GlassSelect 
              label="Lucide Icon (Optional fallback)" 
              name="iconText" 
              options={LUCIDE_ICONS_LIST}
              value={(form.icon && !form.icon.includes('/')) ? form.icon : ''} 
              onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))} 
              showIcons={true}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Countries</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border border-gray-200 rounded-xl bg-white/50 max-h-60 overflow-y-auto">
                {countries.map((c) => (
                  <label key={c.value} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-cluso-deep focus:ring-cluso-mid"
                      checked={form.countries.includes(c.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm(prev => ({ ...prev, countries: [...prev.countries, c.value], country: prev.countries.length === 0 ? c.value : prev.country }));
                        } else {
                          setForm(prev => ({ ...prev, countries: prev.countries.filter(val => val !== c.value) }));
                        }
                      }}
                    />
                    {c.label}
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}

            <GlassButton type="submit" variant="primary" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : 'Create Service'}
            </GlassButton>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}
