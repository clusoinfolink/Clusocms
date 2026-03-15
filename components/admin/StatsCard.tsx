import React from 'react';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  color?: string;
  href?: string;
}

export function StatsCard({ label, value, icon: Icon, color = 'text-cluso-deep', href }: StatsCardProps) {
  const content = (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 ${href ? 'hover:shadow-md transition-shadow' : ''}`}>
      <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href}>
        {content}
      </Link>
    );
  }

  return content;
}
