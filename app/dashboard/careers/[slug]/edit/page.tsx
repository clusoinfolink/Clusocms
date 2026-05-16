'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassInput } from '@/components/ui/GlassInput';
import { GlassButton } from '@/components/ui/GlassButton';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { ImageUploader } from '@/components/admin/ImageUploader';

export default function EditJobPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    coverImage: '',
    content: '',
    department: '',
    location: '',
    type: '',
    primaryColor: '#0ED3A3',
    published: false,
  });

  useEffect(() => {
    fetchPost();
  }, [resolvedParams.slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/careers/${resolvedParams.slug}`);
      if (!res.ok) throw new Error('Failed to fetch post');
      const data = await res.json();
      setFormData({
        ...data,
        published: data.status === 'published'
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/careers/${resolvedParams.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: formData.published ? 'published' : 'draft' }),
      });

      if (!res.ok) {
        const data = await res.json();
        let errorMessage = data.error || 'Failed to update job post';
        if (typeof data.error === 'object' && data.error !== null) {
          errorMessage = Object.entries(data.error)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join(' | ');
        }
        throw new Error(errorMessage);
      }

      router.push('/dashboard/careers');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (fetching) return <div>Loading...</div>;

  return (
    <div className="max-w-full mx-auto pb-10">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Edit Job Post</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <GlassCard>
              <div className="space-y-4">
                <GlassInput
                  label="Title"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setFormData({ ...formData, title, slug });
                  }}
                  required
                />
                <GlassInput
                  label="Slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                  <ImageUploader 
                    value={formData.coverImage} 
                    onChange={(url) => setFormData({ ...formData, coverImage: url })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    required
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cluso-deep/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                  />
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard>
              <h3 className="font-medium text-gray-900 mb-4">Job Info</h3>
              <div className="space-y-4">
                <GlassInput
                  label="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
                <GlassInput
                  label="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
                <GlassInput
                  label="Type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="font-medium text-gray-900 mb-4">Publishing</h3>
              <label className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded border-gray-300 text-cluso-deep focus:ring-cluso-deep"
                />
                <span className="text-sm text-gray-700">Published</span>
              </label>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <div className="flex gap-4">
                <GlassButton
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </GlassButton>
              </div>
            </GlassCard>
          </div>
        </div>
      </form>
    </div>
  );
}
