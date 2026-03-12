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
      const val = trimmed.slice(eqIdx + 1).trim();
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
});

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

  const existing = await Admin.findOne({ email: 'admin@clusoinfolink.com' });
  if (existing) {
    console.log('Admin user already exists. Skipping seed.');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash('ClusoAdmin@2024', 12);
  await Admin.create({
    email: 'admin@clusoinfolink.com',
    passwordHash: hashedPassword,
    name: 'Admin',
  });

  console.log('Admin user created successfully');
  console.log('Email: admin@clusoinfolink.com');
  console.log('Password: ClusoAdmin@2024');
  console.log('⚠️  Please change this password immediately after first login!');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
