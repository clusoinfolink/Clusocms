import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import GalleryImage from '@/lib/models/Gallery';
import path from 'path';
import fs from 'fs/promises';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  const image = await GalleryImage.findById(id);
  if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Delete local file if it's a local upload
  if (image.url && image.url.startsWith('/uploads/')) {
    try {
      const filePath = path.join(process.cwd(), 'public', image.url);
      await fs.unlink(filePath);
    } catch {
      // Continue even if file deletion fails
    }
  }

  await GalleryImage.findByIdAndDelete(id);
  return NextResponse.json({ message: 'Deleted' });
}
