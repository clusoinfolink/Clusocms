'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Mail, Phone, Trash2, Clock, UserRound, Download } from 'lucide-react';

interface CandidateRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  jobTitle?: string;
  jobColor?: string;
  jobId?: string;
  resumeDocumentId: string;
  resumeFileName: string;
  read: boolean;
  createdAt: string;
}

export default function CandidateRequestsPage() {
  const [requests, setRequests] = useState<CandidateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CandidateRequest | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const res = await fetch('/api/candidate-requests');
    if (res.ok) {
      const data = await res.json();
      setRequests(data);
    }
    setLoading(false);
  }

  async function markAsRead(item: CandidateRequest) {
    setSelected(item);
    if (!item.read) {
      await fetch(`/api/candidate-requests/${item._id}`, { method: 'PATCH' });
      setRequests((prev) => prev.map((r) => (r._id === item._id ? { ...r, read: true } : r)));
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/candidate-requests/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r._id !== deleteId));
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
          Candidate Requests{' '}
          <span className="text-base font-normal text-gray-500">({requests.filter((r) => !r.read).length} unread)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {requests.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No candidate requests yet</div>
          ) : (
            requests.map((item) => (
              <div
                key={item._id}
                onClick={() => markAsRead(item)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                  selected?._id === item._id
                    ? 'border-cluso-deep bg-cluso-deep/5'
                    : item.read
                    ? 'border-gray-200 bg-white hover:bg-gray-50'
                    : 'border-cluso-mid bg-cluso-mid/5 hover:bg-cluso-mid/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm truncate ${!item.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {item.name}
                      </p>
                      {item.jobTitle && (
                        <span 
                          className="text-[10px] px-2 py-0.5 rounded-full inline-block truncate max-w-[120px]"
                          style={{
                            backgroundColor: item.jobColor ? `${item.jobColor}20` : '#e2e8f0',
                            color: item.jobColor || '#475569',
                            border: `1px solid ${item.jobColor ? `${item.jobColor}40` : '#cbd5e1'}`
                          }}
                          title={item.jobTitle}
                        >
                          {item.jobTitle}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{item.email}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    {!item.read && <div className="w-2 h-2 rounded-full bg-cluso-deep" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(item._id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <GlassCard>
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                      {selected.jobTitle && (
                        <span 
                          className="text-xs px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: selected.jobColor ? `${selected.jobColor}20` : '#e2e8f0',
                            color: selected.jobColor || '#475569',
                            border: `1px solid ${selected.jobColor ? `${selected.jobColor}40` : '#cbd5e1'}`
                          }}
                        >
                          Application for: <span className="font-semibold">{selected.jobTitle}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">Candidate Application</p>
                  </div>
                  <div className="flex gap-2">
                    <GlassButton variant="ghost" onClick={() => setDeleteId(selected._id)}>
                      <Trash2 size={16} />
                    </GlassButton>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p className="flex items-center gap-2"><UserRound size={14} /> {selected.name}</p>
                  <p className="flex items-center gap-2"><Mail size={14} /> {selected.email}</p>
                  <p className="flex items-center gap-2"><Phone size={14} /> {selected.phone}</p>
                  <p className="text-gray-500">Submitted: {new Date(selected.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Resume</p>
                  {selected.resumeDocumentId ? (
                    <a
                      href={`/api/candidate-requests/documents/${selected.resumeDocumentId}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-cluso-deep/20 bg-cluso-deep/10 px-3 py-1.5 text-xs font-medium text-cluso-deep hover:bg-cluso-deep/20"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download size={14} />
                      Download Resume ({selected.resumeFileName || 'resume'})
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500">No resume uploaded</span>
                  )}
                </div>
              </div>
            </GlassCard>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <UserRound size={48} className="mb-3 opacity-50" />
              <p>Select a candidate request to view</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Candidate Request"
        message="Are you sure you want to delete this candidate request?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
