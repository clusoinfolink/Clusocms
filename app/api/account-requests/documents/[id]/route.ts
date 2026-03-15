import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import AccountRequestDocument from '@/lib/models/AccountRequestDocument';

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();

  const doc = await AccountRequestDocument.findById(id);
  if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 });

  const filename = sanitizeFilename(doc.filename || 'document');

  return new NextResponse(Buffer.from(doc.data), {
    status: 200,
    headers: {
      'Content-Type': doc.mimeType || 'application/octet-stream',
      'Content-Length': String(doc.size || doc.data.length),
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
