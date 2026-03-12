import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ContactSubmission from '@/lib/models/ContactSubmission';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const messages = await ContactSubmission.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(messages);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const ids = searchParams.get('ids');
  if (!ids) return NextResponse.json({ error: 'ids parameter required' }, { status: 400 });

  await dbConnect();
  const idArray = ids.split(',');
  await ContactSubmission.deleteMany({ _id: { $in: idArray } });
  return NextResponse.json({ message: 'Deleted' });
}
