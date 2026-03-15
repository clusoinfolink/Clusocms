import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'cluso';
  const storage = (formData.get('storage') as string) || 'auto';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_\-\/]/g, '');
  const hasCloudinaryConfig = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME
      && process.env.CLOUDINARY_API_KEY
      && process.env.CLOUDINARY_API_SECRET
  );

  if (hasCloudinaryConfig) {
    try {
      const result = await uploadImage(buffer, sanitizedFolder);
      return NextResponse.json(result, { status: 201 });
    } catch {
      return NextResponse.json({ error: 'Cloudinary upload failed' }, { status: 500 });
    }
  }

  if (storage === 'inline') {
    const mimeType = file.type || 'application/octet-stream';
    const dataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    return NextResponse.json(
      { secure_url: dataUrl, public_id: `inline-${crypto.randomUUID()}` },
      { status: 201 }
    );
  }

  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    return NextResponse.json(
      { error: 'Image uploads require Cloudinary configuration in production.' },
      { status: 500 }
    );
  }

  // Generate unique filename
  const ext = path.extname(file.name) || '.webp';
  const uniqueName = `${crypto.randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', sanitizedFolder);
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, uniqueName);
  await fs.writeFile(filePath, buffer);

  const url = `/uploads/${sanitizedFolder}/${uniqueName}`;
  return NextResponse.json({ secure_url: url, public_id: `${sanitizedFolder}/${uniqueName}` }, { status: 201 });
}
