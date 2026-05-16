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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const posts = await JobPost.find()
    .select('title slug department type location primaryColor createdAt published jobId expiryDate')
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(posts.map((post) => withStatus(post as { published?: boolean })));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = createJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  await dbConnect();
  
  // Generate permanent unique Job ID
  const jobId = `JOB-${Math.floor(100000 + Math.random() * 900000)}`;
  
  const post = await JobPost.create({ ...parsed.data, jobId });
  return NextResponse.json(withStatus(post.toObject()), { status: 201 });
}
