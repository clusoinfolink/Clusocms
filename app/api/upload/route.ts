import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'cluso';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const ext = path.extname(file.name) || '.webp';
  const uniqueName = `${crypto.randomUUID()}${ext}`;
  const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_\-\/]/g, '');
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', sanitizedFolder);
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, uniqueName);
  await fs.writeFile(filePath, buffer);

  const url = `/uploads/${sanitizedFolder}/${uniqueName}`;
  return NextResponse.json({ secure_url: url, public_id: `${sanitizedFolder}/${uniqueName}` }, { status: 201 });
}
