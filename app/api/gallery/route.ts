import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import GalleryImage from '@/lib/models/Gallery';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const images = await GalleryImage.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(images);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.url || !body.publicId) {
    return NextResponse.json({ error: 'url and publicId are required' }, { status: 400 });
  }

  await dbConnect();
  const image = await GalleryImage.create({
    url: body.url,
    publicId: body.publicId,
    caption: body.caption || '',
    category: body.category || 'general',
  });
  return NextResponse.json(image, { status: 201 });
}
