'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, User } from 'lucide-react';

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h2 className="font-heading text-lg font-semibold text-gray-900">
        Admin Panel
      </h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} />
          <span>{session?.user?.name || session?.user?.email || 'Admin'}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </header>
  );
}
