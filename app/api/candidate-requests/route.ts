import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import CandidateRequest from '@/lib/models/CandidateRequest';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const requests = await CandidateRequest.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(requests);
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const ids = searchParams.get('ids');
  if (!ids) return NextResponse.json({ error: 'ids parameter required' }, { status: 400 });

  await dbConnect();
  await CandidateRequest.deleteMany({ _id: { $in: ids.split(',') } });
  return NextResponse.json({ message: 'Deleted' });
}
