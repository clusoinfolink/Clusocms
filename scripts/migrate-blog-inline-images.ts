import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
  try {
    const envPath = resolve(__dirname, '..', '.env.local');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const rawVal = trimmed.slice(eqIdx + 1).trim();
      const val = rawVal.replace(/^['\"](.*)['\"]$/, '$1');
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // ignore
  }
}

loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cluso';

const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, index: true },
    coverImage: String,
  },
  { timestamps: true }
);

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

function parseDataUrl(dataUrl: string): { mimeType: string; buffer: Buffer } {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) {
    throw new Error('Invalid data URL format');
  }

  const mimeType = match[1];
  const base64 = match[2];
  const buffer = Buffer.from(base64, 'base64');
  return { mimeType, buffer };
}

async function uploadBuffer(buffer: Buffer, folder: string): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolvePromise, rejectPromise) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          format: 'webp',
          quality: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            rejectPromise(error || new Error('Cloudinary upload failed'));
            return;
          }
          resolvePromise({ secure_url: result.secure_url, public_id: result.public_id });
        }
      )
      .end(buffer);
  });
}

async function run() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing Cloudinary config. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
    process.exit(2);
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const posts = await BlogPost.find({ coverImage: { $regex: /^data:image\// } }).select('_id slug title coverImage').lean();

  if (posts.length === 0) {
    console.log('No inline blog images found. Nothing to migrate.');
    await mongoose.disconnect();
    return;
  }

  console.log(`Found ${posts.length} inline blog image(s). Migrating...`);

  let migrated = 0;
  let failed = 0;

  for (const post of posts) {
    try {
      const coverImage = String(post.coverImage || '');
      const { buffer } = parseDataUrl(coverImage);
      const uploaded = await uploadBuffer(buffer, 'cluso/blog');

      await BlogPost.updateOne(
        { _id: post._id },
        { $set: { coverImage: uploaded.secure_url } }
      );

      migrated += 1;
      console.log(`Migrated: ${post.slug || post._id}`);
    } catch (err) {
      failed += 1;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed: ${post.slug || post._id} -> ${message}`);
    }
  }

  console.log(`Done. Migrated: ${migrated}, Failed: ${failed}`);
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Migration failed:', err instanceof Error ? err.message : String(err));
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
