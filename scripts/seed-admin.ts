import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
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
      let val = trimmed.slice(eqIdx + 1).trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch { /* ignore */ }
}
loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cluso';

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
}, { collection: 'cmsadmins' });

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const Admin = mongoose.models.CmsAdmin || mongoose.model('CmsAdmin', AdminSchema, 'cmsadmins');

  // Delete ALL existing admin accounts
  const deleteResult = await Admin.deleteMany({});
  console.log(`Deleted ${deleteResult.deletedCount} existing admin(s).`);

  // Create fresh admin with specified credentials
  const hashedPassword = await bcrypt.hash('Cluso@2026', 12);

  await Admin.create({
    email: 'admin@cluso.in',
    passwordHash: hashedPassword,
    name: 'Admin',
  });
  console.log('Created: admin@cluso.in');

  await Admin.create({
    email: 'pkumar@cluso.in',
    passwordHash: hashedPassword,
    name: 'P Kumar',
  });
  console.log('Created: pkumar@cluso.in');

  await Admin.create({
    email: 'indiaops@cluso.in',
    passwordHash: hashedPassword,
    name: 'India Ops',
  });
  console.log('Created: indiaops@cluso.in');

  console.log('\n--- CMS Admin Credentials ---');
  console.log('Email: admin@cluso.in      | Password: Cluso@2026');
  console.log('Email: pkumar@cluso.in     | Password: Cluso@2026');
  console.log('Email: indiaops@cluso.in   | Password: Cluso@2026');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
