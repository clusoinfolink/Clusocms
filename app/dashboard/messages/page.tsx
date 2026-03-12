'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Mail, Eye, Trash2, Clock } from 'lucide-react';

interface Message {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const res = await fetch('/api/messages');
    if (res.ok) setMessages(await res.json());
    setLoading(false);
  }

  async function markAsRead(msg: Message) {
    setSelected(msg);
    if (!msg.read) {
      await fetch(`/api/messages/${msg._id}`, { method: 'PATCH' });
      setMessages(messages.map((m) => (m._id === msg._id ? { ...m, read: true } : m)));
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/messages/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      setMessages(messages.filter((m) => m._id !== deleteId));
      if (selected?._id === deleteId) setSelected(null);
    }
    setDeleteId(null);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Messages <span className="text-base font-normal text-gray-500">({messages.filter((m) => !m.read).length} unread)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No messages yet</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => markAsRead(msg)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                  selected?._id === msg._id
                    ? 'border-cluso-deep bg-cluso-deep/5'
                    : msg.read
                    ? 'border-gray-200 bg-white hover:bg-gray-50'
                    : 'border-cluso-mid bg-cluso-mid/5 hover:bg-cluso-mid/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm truncate ${!msg.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {msg.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{msg.subject || msg.email}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {!msg.read && <div className="w-2 h-2 rounded-full bg-cluso-deep" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(msg._id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(msg.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <GlassCard>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selected.subject || 'No Subject'}</h2>
                    <p className="text-sm text-gray-500">
                      From: <span className="font-medium text-gray-700">{selected.name}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <GlassButton variant="ghost" onClick={() => setDeleteId(selected._id)}>
                      <Trash2 size={16} />
                    </GlassButton>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {selected.email}
                  </span>
                  {selected.phone && (
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {selected.phone}
                    </span>
                  )}
                  <span className="text-gray-400">
                    {new Date(selected.createdAt).toLocaleString()}
                  </span>
                </div>

                <hr className="border-gray-200" />

                <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>
            </GlassCard>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Mail size={48} className="mb-3 opacity-50" />
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
