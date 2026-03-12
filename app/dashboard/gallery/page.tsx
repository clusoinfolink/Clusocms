'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Trash2, Upload } from 'lucide-react';

interface GalleryImg {
  _id: string;
  url: string;
  publicId: string;
  caption: string;
  category: string;
  createdAt: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImg[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('general');
  const [uploadUrl, setUploadUrl] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const res = await fetch('/api/gallery');
    if (res.ok) setImages(await res.json());
    setLoading(false);
  }

  async function handleSaveImage() {
    if (!uploadUrl) return;

    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: uploadUrl,
        publicId: uploadUrl.split('/').pop()?.split('.')[0] || 'image',
        caption,
        category,
      }),
    });

    if (res.ok) {
      const newImg = await res.json();
      setImages([newImg, ...images]);
      setShowUpload(false);
      setUploadUrl('');
      setCaption('');
      setCategory('general');
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/gallery/${deleteId}`, { method: 'DELETE' });
    if (res.ok) setImages(images.filter((i) => i._id !== deleteId));
    setDeleteId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Gallery</h1>
        <GlassButton variant="primary" onClick={() => setShowUpload(!showUpload)}>
          <Upload size={18} className="mr-1" /> Upload Image
        </GlassButton>
      </div>

      {showUpload && (
        <GlassCard className="mb-6">
          <div className="space-y-4">
            <ImageUploader value={uploadUrl} onChange={setUploadUrl} folder="cluso/gallery" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cluso-deep/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cluso-deep/30"
                >
                  <option value="general">General</option>
                  <option value="office">Office</option>
                  <option value="events">Events</option>
                  <option value="team">Team</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <GlassButton variant="primary" onClick={handleSaveImage} disabled={!uploadUrl}>
                Save Image
              </GlassButton>
              <GlassButton variant="ghost" onClick={() => setShowUpload(false)}>
                Cancel
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
      ) : images.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">No images uploaded yet</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img._id} className="group relative rounded-xl overflow-hidden border border-gray-200 bg-white">
              <div className="relative aspect-square">
                <Image src={img.url} alt={img.caption || 'Gallery image'} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-700 truncate">{img.caption || 'Untitled'}</p>
                <p className="text-xs text-gray-400">{img.category}</p>
              </div>
              <button
                onClick={() => setDeleteId(img._id)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Image"
        message="Are you sure you want to delete this image? It will also be removed from Cloudinary."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
