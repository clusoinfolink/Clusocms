import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import SiteSetting from '@/lib/models/SiteSetting';
import { updateSettingsSchema } from '@/lib/validations/settings';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  let settings = await SiteSetting.findOne().lean();
  if (!settings) {
    settings = await SiteSetting.create({
      siteName: 'Cluso Infolink',
      tagline: "Let's Make It Transparent",
      contactEmail: 'info@clusoinfolink.com',
      contactPhone: '',
      address: '',
      socialLinks: {},
    });
  }
  return NextResponse.json(settings);
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = updateSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  await dbConnect();
  let settings = await SiteSetting.findOne();
  if (settings) {
    Object.assign(settings, parsed.data);
    await settings.save();
  } else {
    settings = await SiteSetting.create(parsed.data);
  }
  return NextResponse.json(settings);
}
