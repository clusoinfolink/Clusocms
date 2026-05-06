import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import JobPost from '@/lib/models/JobPost';
import { createJobSchema } from '@/lib/validations/job';

function withStatus<T extends { published?: boolean }>(post: T) {
  return {
    ...post,
    status: post.published ? 'published' : 'draft',
  };
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const resolvedParams = await params;
  const post = await JobPost.findOne({ slug: resolvedParams.slug }).lean();
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(withStatus(post as { published?: boolean }));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = createJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  await dbConnect();
  const resolvedParams = await params;
  const post = await JobPost.findOneAndUpdate({ slug: resolvedParams.slug }, parsed.data, { new: true });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(withStatus(post.toObject()));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const resolvedParams = await params;
  const post = await JobPost.findOneAndDelete({ slug: resolvedParams.slug });
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
