'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FileText, Newspaper, Users, Image as ImageIcon,
  Briefcase, MessageSquare, Settings, Star, Bell,
} from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/blog', label: 'Blog Posts', icon: Newspaper },
  { href: '/dashboard/notices', label: 'Notices', icon: Bell },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/services', label: 'Services', icon: Briefcase },
  { href: '/dashboard/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/dashboard/testimonials', label: 'Testimonials', icon: Star },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  unreadCount?: number;
}

export function Sidebar({ unreadCount = 0 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-heading text-xl font-bold text-cluso-deep">Cluso</span>
          <span className="font-heading text-xl font-light text-gray-500">Admin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cluso-deep/10 text-cluso-deep'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon size={18} />
              <span>{link.label}</span>
              {link.label === 'Messages' && unreadCount > 0 && (
                <span className="ml-auto bg-cluso-cream text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">&copy; {new Date().getFullYear()} Cluso Infolink</p>
      </div>
    </aside>
  );
}
