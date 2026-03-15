'use client';

import React, { useRef, useState } from 'react';
import { GlassButton } from '@/components/ui/GlassButton';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

export interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: string;
  storage?: 'auto' | 'inline';
}

export function ImageUploader({ value, onChange, folder, storage = 'auto' }: ImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) formData.append('folder', folder);
      formData.append('storage', storage);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.secure_url);
      } else {
        const data = await res.json().catch(() => null);
        alert(typeof data?.error === 'string' ? data.error : 'Upload failed. Please try again.');
      }
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="Uploaded"
            width={200}
            height={150}
            className="rounded-xl object-cover border border-gray-200"
            unoptimized={value.startsWith('data:')}
          />
          <button
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            type="button"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <GlassButton
            type="button"
            variant="ghost"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload Image'}
          </GlassButton>
        </div>
      )}
    </div>
  );
}
