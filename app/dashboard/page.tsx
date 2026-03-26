export const dynamic = 'force-dynamic';

import { Newspaper, Bell, Users, MessageSquare, Image as ImageIcon, Briefcase, Star, FileText } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { GlassButton } from '@/components/ui/GlassButton';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import BlogPost from '@/lib/models/BlogPost';
import Notice from '@/lib/models/Notice';
import TeamMember from '@/lib/models/TeamMember';
import ContactSubmission from '@/lib/models/ContactSubmission';
import GalleryImage from '@/lib/models/Gallery';
import Service from '@/lib/models/Service';
import Testimonial from '@/lib/models/Testimonial';
import AccountRequest from '@/lib/models/AccountRequest';
import CandidateRequest from '@/lib/models/CandidateRequest';

async function getStats() {
  try {
    await dbConnect();
    const [blogs, notices, team, messages, unread, gallery, services, testimonials, accountRequests, candidateRequests] = await Promise.all([
      BlogPost.countDocuments(),
      Notice.countDocuments(),
      TeamMember.countDocuments(),
      ContactSubmission.countDocuments(),
      ContactSubmission.countDocuments({ read: false }),
      GalleryImage.countDocuments(),
      Service.countDocuments(),
      Testimonial.countDocuments(),
      AccountRequest.countDocuments(),
      CandidateRequest.countDocuments(),
    ]);
    return { blogs, notices, team, messages, unread, gallery, services, testimonials, accountRequests, candidateRequests };
  } catch {
    return {
      blogs: 0,
      notices: 0,
      team: 0,
      messages: 0,
      unread: 0,
      gallery: 0,
      services: 0,
      testimonials: 0,
      accountRequests: 0,
      candidateRequests: 0,
    };
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/dashboard/blog/new">
            <GlassButton variant="primary">New Post</GlassButton>
          </Link>
          <Link href="/dashboard/notices/new">
            <GlassButton variant="secondary">New Notice</GlassButton>
          </Link>
          <Link href="/dashboard/team/new">
            <GlassButton variant="ghost">Add Member</GlassButton>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Account Requests" value={stats.accountRequests} icon={FileText} href="/dashboard/account-requests" color="text-cluso-cream" />
        <StatsCard label="Candidate Requests" value={stats.candidateRequests} icon={Users} href="/dashboard/candidate-requests" color="text-cluso-cream" />
        <StatsCard label="Blog Posts" value={stats.blogs} icon={Newspaper} href="/dashboard/blog" />
        <StatsCard label="Notices" value={stats.notices} icon={Bell} href="/dashboard/notices" />
        <StatsCard label="Team Members" value={stats.team} icon={Users} href="/dashboard/team" />
        <StatsCard label="Unread Messages" value={stats.unread} icon={MessageSquare} color="text-cluso-cream" href="/dashboard/messages" />
        <StatsCard label="Gallery Images" value={stats.gallery} icon={ImageIcon} href="/dashboard/gallery" />
        <StatsCard label="Services" value={stats.services} icon={Briefcase} href="/dashboard/services" />
        <StatsCard label="Testimonials" value={stats.testimonials} icon={Star} href="/dashboard/testimonials" />
        <StatsCard label="Total Messages" value={stats.messages} icon={MessageSquare} href="/dashboard/messages" />
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/dashboard/blog" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-cluso-deep/5 transition-colors">
            <Newspaper className="mx-auto mb-2 text-cluso-deep" size={24} />
            <p className="text-sm font-medium text-gray-700">Manage Blog</p>
          </Link>
          <Link href="/dashboard/team" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-cluso-deep/5 transition-colors">
            <Users className="mx-auto mb-2 text-cluso-deep" size={24} />
            <p className="text-sm font-medium text-gray-700">Manage Team</p>
          </Link>
          <Link href="/dashboard/messages" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-cluso-deep/5 transition-colors">
            <MessageSquare className="mx-auto mb-2 text-cluso-deep" size={24} />
            <p className="text-sm font-medium text-gray-700">View Messages</p>
          </Link>
          <Link href="/dashboard/settings" className="p-4 bg-gray-50 rounded-xl text-center hover:bg-cluso-deep/5 transition-colors">
            <Briefcase className="mx-auto mb-2 text-cluso-deep" size={24} />
            <p className="text-sm font-medium text-gray-700">Settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
