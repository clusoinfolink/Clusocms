import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually (ts-node doesn't load it automatically)
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
  } catch { /* ignore if file not found */ }
}
loadEnv();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cluso';

// ─── Schemas (inline to avoid ESM import issues with ts-node) ───

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
});

const BlogPostSchema = new mongoose.Schema({
  title: String, slug: String, excerpt: String, content: String,
  coverImage: String, author: String, category: String,
  published: { type: Boolean, default: true },
  tags: [String],
}, { timestamps: true });

const ServiceSchema = new mongoose.Schema({
  title: String, description: String, icon: String,
  features: [String],
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const TeamMemberSchema = new mongoose.Schema({
  name: String, role: String, photo: String, bio: String,
  order: { type: Number, default: 0 },
  socials: { facebook: String, twitter: String, youtube: String, instagram: String },
}, { timestamps: true });

const TestimonialSchema = new mongoose.Schema({
  name: String, company: String, role: String, content: String,
  rating: { type: Number, default: 5 },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const NoticeSchema = new mongoose.Schema({
  title: String, content: String, type: String,
  active: { type: Boolean, default: true },
}, { timestamps: true });

const SiteSettingSchema = new mongoose.Schema({
  siteName: String, tagline: String,
  contactEmail: String, contactPhone: String, address: String,
  socialLinks: { facebook: String, twitter: String, linkedin: String, instagram: String },
}, { timestamps: true });

// ─── Seed Data ───

const services = [
  {
    title: 'Criminal Background Check',
    description: 'Comprehensive criminal record screening across national and local databases to ensure workplace safety.',
    icon: 'Shield',
    features: ['National database search', 'County-level checks', 'Sex offender registry', 'Terrorist watch list'],
    order: 1,
  },
  {
    title: 'Employment Verification',
    description: 'Confirm employment history, job titles, dates of service, and reasons for departure.',
    icon: 'Building',
    features: ['Past employer contact', 'Title verification', 'Employment dates', 'Performance review'],
    order: 2,
  },
  {
    title: 'Education Verification',
    description: 'Validate academic credentials, degrees, certifications, and dates of attendance.',
    icon: 'FileText',
    features: ['Degree verification', 'Institution validation', 'Transcript review', 'Certification check'],
    order: 3,
  },
  {
    title: 'Identity Verification',
    description: 'Confirm personal identity through document verification and biometric validation.',
    icon: 'Fingerprint',
    features: ['ID document check', 'Address verification', 'SSN trace', 'Biometric validation'],
    order: 4,
  },
  {
    title: 'Reference Checks',
    description: 'Thorough reference interviews to assess character, work ethic, and professional capabilities.',
    icon: 'UserCheck',
    features: ['Professional references', 'Character assessment', 'Work ethic evaluation', 'Structured interviews'],
    order: 5,
  },
  {
    title: 'Compliance Screening',
    description: 'Ensure regulatory compliance with industry-specific screening requirements and legal mandates.',
    icon: 'Scale',
    features: ['Regulatory compliance', 'Industry-specific checks', 'Legal mandate adherence', 'Audit support'],
    order: 6,
  },
];

const teamMembers = [
  {
    name: 'Rajesh Kumar',
    role: 'CEO & Founder',
    bio: 'Visionary leader with over 15 years of experience in background verification and compliance. Rajesh founded Cluso Infolink with a mission to bring transparency to every verification process.',
    order: 1,
    socials: { linkedin: 'https://linkedin.com' },
  },
  {
    name: 'Priya Sharma',
    role: 'CTO & Partner',
    bio: 'Technology expert driving innovation in automated screening solutions. Priya leads our engineering team in building the most efficient verification platform in the industry.',
    order: 2,
    socials: { linkedin: 'https://linkedin.com' },
  },
  {
    name: 'Amit Patel',
    role: 'COO & Partner',
    bio: 'Operations specialist ensuring smooth delivery across all verification services. Amit brings a decade of process optimization experience to drive operational excellence.',
    order: 3,
    socials: { linkedin: 'https://linkedin.com' },
  },
];

const blogPosts = [
  {
    title: 'Why Background Verification is Essential for Modern Businesses',
    slug: 'why-background-verification-essential',
    excerpt: 'In today\'s competitive landscape, background verification is no longer optional — it\'s a critical business practice that protects your organization.',
    content: `<h2>The Growing Need for Background Verification</h2>
<p>In an era of rapid hiring and remote work, verifying the credentials and history of potential employees has become more critical than ever. Companies that skip this step risk fraud, compliance violations, and workplace safety issues.</p>
<h2>Key Benefits</h2>
<p><strong>Risk Mitigation:</strong> Reduce the likelihood of negligent hiring claims and workplace incidents.</p>
<p><strong>Regulatory Compliance:</strong> Stay compliant with industry-specific regulations and legal requirements.</p>
<p><strong>Trust Building:</strong> Build a transparent workplace culture where every team member is verified and trusted.</p>
<h2>The Cluso Approach</h2>
<p>At Cluso Infolink, we leverage cutting-edge technology combined with thorough manual review processes to deliver accurate, fast, and transparent background verification services.</p>`,
    author: 'Rajesh Kumar',
    category: 'Industry Insights',
    published: true,
    tags: ['background verification', 'hiring', 'compliance'],
  },
  {
    title: 'Top 5 Red Flags in Employment History Verification',
    slug: 'top-5-red-flags-employment-verification',
    excerpt: 'Learn the common red flags our verification experts look for when conducting employment history checks.',
    content: `<h2>What to Watch Out For</h2>
<p>Employment history verification is one of the most crucial steps in the hiring process. Here are the top red flags every HR professional should know about.</p>
<h3>1. Unexplained Gaps</h3>
<p>While career gaps aren't always negative, unexplained periods deserve attention and clarification.</p>
<h3>2. Inconsistent Job Titles</h3>
<p>When claimed titles don't match what previous employers confirm, it raises concerns about honesty.</p>
<h3>3. Mismatched Employment Dates</h3>
<p>Discrepancies in start and end dates can indicate resume padding or attempts to hide short tenures.</p>
<h3>4. Unavailable References</h3>
<p>If none of the provided references can be reached or verified, this warrants further investigation.</p>
<h3>5. Company Discrepancies</h3>
<p>Claims of working at companies that have no record of the candidate are a serious red flag.</p>`,
    author: 'Priya Sharma',
    category: 'Expert Tips',
    published: true,
    tags: ['employment verification', 'red flags', 'HR tips'],
  },
  {
    title: 'Digital Identity Verification: The Future is Here',
    slug: 'digital-identity-verification-future',
    excerpt: 'How AI and digital tools are transforming the identity verification landscape in India and beyond.',
    content: `<h2>The Digital Revolution in Verification</h2>
<p>The traditional approach to identity verification — manual document checks and in-person visits — is being rapidly transformed by digital technologies.</p>
<h2>AI-Powered Solutions</h2>
<p>Artificial intelligence enables faster processing, real-time fraud detection, and more accurate identity matching than ever before.</p>
<h2>What This Means for Businesses</h2>
<p>Companies can now verify identities in minutes rather than days, reducing onboarding time while improving accuracy. Cluso Infolink is at the forefront of this digital transformation.</p>`,
    author: 'Amit Patel',
    category: 'Technology',
    published: true,
    tags: ['digital verification', 'AI', 'technology'],
  },
];

const testimonials = [
  {
    name: 'Vikram Desai',
    company: 'TechCorp India',
    role: 'HR Director',
    content: 'Cluso Infolink has transformed our hiring process. Their fast turnaround and thorough verification has helped us build a trustworthy team.',
    rating: 5,
  },
  {
    name: 'Ananya Reddy',
    company: 'FinServ Solutions',
    role: 'Chief People Officer',
    content: 'The transparency and accuracy of Cluso\'s reports give us complete confidence in our hiring decisions. Highly recommended.',
    rating: 5,
  },
  {
    name: 'Mohammed Farooq',
    company: 'BuildRight Construction',
    role: 'Operations Manager',
    content: 'Their compliance screening has been invaluable for our industry. Professional team, excellent service.',
    rating: 4,
  },
];

const notices = [
  {
    title: 'New AI-Powered Verification Module Launched',
    content: 'We are excited to announce the launch of our AI-powered verification module that reduces turnaround time by 60%.',
    type: 'announcement',
    active: true,
  },
  {
    title: 'Holiday Schedule — March 2026',
    content: 'Our offices will be closed on March 14 (Holi). Emergency verifications will still be processed within 24 hours.',
    type: 'notice',
    active: true,
  },
];

const siteSettings = {
  siteName: 'Cluso Infolink',
  tagline: "Let's Make It Transparent",
  contactEmail: 'indiaops@cluso.com',
  contactPhone: '+91 98765 43210',
  address: 'Cluso Infolink Pvt. Ltd., Hyderabad, India',
  socialLinks: {
    facebook: 'https://facebook.com/clusoinfolink',
    twitter: 'https://twitter.com/clusoinfolink',
    linkedin: 'https://linkedin.com/company/clusoinfolink',
    instagram: 'https://instagram.com/clusoinfolink',
  },
};

// ─── Seed Runner ───

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
  const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
  const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
  const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
  const Testimonial = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
  const Notice = mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
  const SiteSetting = mongoose.models.SiteSetting || mongoose.model('SiteSetting', SiteSettingSchema);

  // Admin user — delete any existing one and recreate to ensure correct schema
  await Admin.deleteMany({});
  const hashedPassword = await bcrypt.hash('ClusoAdmin@2024', 12);
  await Admin.create({ email: 'admin@clusoinfolink.com', passwordHash: hashedPassword, name: 'Admin' });
  console.log('✓ Admin user created');

  // Services
  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany(services);
    console.log(`✓ ${services.length} services seeded`);
  } else {
    console.log(`• ${serviceCount} services already exist`);
  }

  // Team Members
  const teamCount = await TeamMember.countDocuments();
  if (teamCount === 0) {
    await TeamMember.insertMany(teamMembers);
    console.log(`✓ ${teamMembers.length} team members seeded`);
  } else {
    console.log(`• ${teamCount} team members already exist`);
  }

  // Blog Posts
  const blogCount = await BlogPost.countDocuments();
  if (blogCount === 0) {
    await BlogPost.insertMany(blogPosts);
    console.log(`✓ ${blogPosts.length} blog posts seeded`);
  } else {
    console.log(`• ${blogCount} blog posts already exist`);
  }

  // Testimonials
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany(testimonials);
    console.log(`✓ ${testimonials.length} testimonials seeded`);
  } else {
    console.log(`• ${testimonialCount} testimonials already exist`);
  }

  // Notices
  const noticeCount = await Notice.countDocuments();
  if (noticeCount === 0) {
    await Notice.insertMany(notices);
    console.log(`✓ ${notices.length} notices seeded`);
  } else {
    console.log(`• ${noticeCount} notices already exist`);
  }

  // Site Settings
  const existingSettings = await SiteSetting.findOne();
  if (!existingSettings) {
    await SiteSetting.create(siteSettings);
    console.log('✓ Site settings seeded');
  } else {
    console.log('• Site settings already exist');
  }

  console.log('\n========================================');
  console.log('  Seed complete!');
  console.log('========================================');
  console.log('Admin Login:');
  console.log('  Email:    admin@clusoinfolink.com');
  console.log('  Password: ClusoAdmin@2024');
  console.log('========================================\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
