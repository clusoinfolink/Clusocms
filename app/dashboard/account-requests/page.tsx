'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { Mail, Trash2, Clock, Building2, UserRound } from 'lucide-react';

interface AccountRequest {
  _id: string;
  companyName: string;
  companyCity: string;
  companyState: string;
  contactEmail: string;
  firstName: string;
  lastName: string;
  designation: string;
  mobileNumber: string;
  submissionType: 'draft' | 'submitted';
  read: boolean;
  createdAt: string;
  checks?: string[];
  customRequirements?: string;
  companyDocumentId?: string;
  companyDocumentName?: string;
  companyDocumentIds?: string[];
  companyDocumentNames?: string[];
  requirementDocumentId?: string;
  requirementDocumentName?: string;
  requirementDocumentIds?: string[];
  requirementDocumentNames?: string[];
  invoiceEmail?: string;
  industry?: string;
  backgroundsPerYear?: string;
  heardAbout?: string;
}

function submissionBadge(type: string) {
  if (type === 'draft') {
    return { label: 'Draft', className: 'bg-amber-100 text-amber-700 border-amber-200' };
  }
  return { label: 'Submitted', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
}

export default function AccountRequestsPage() {
  const [requests, setRequests] = useState<AccountRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AccountRequest | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const res = await fetch('/api/account-requests');
    if (res.ok) {
      const data = await res.json();
      setRequests(data);
    }
    setLoading(false);
  }

  async function markAsRead(item: AccountRequest) {
    setSelected(item);
    if (!item.read) {
      await fetch(`/api/account-requests/${item._id}`, { method: 'PATCH' });
      setRequests((prev) => prev.map((r) => (r._id === item._id ? { ...r, read: true } : r)));
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/account-requests/${deleteId}`, { method: 'DELETE' });
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r._id !== deleteId));
      if (selected?._id === deleteId) setSelected(null);
    }
    setDeleteId(null);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;
  }

  function getCompanyDocs(item: AccountRequest) {
    if (item.companyDocumentIds && item.companyDocumentIds.length > 0) {
      return item.companyDocumentIds.map((id, idx) => ({ id, name: item.companyDocumentNames?.[idx] || `file-${idx + 1}` }));
    }
    if (item.companyDocumentId) {
      return [{ id: item.companyDocumentId, name: item.companyDocumentName || 'file-1' }];
    }
    return [];
  }

  function getRequirementDocs(item: AccountRequest) {
    if (item.requirementDocumentIds && item.requirementDocumentIds.length > 0) {
      return item.requirementDocumentIds.map((id, idx) => ({ id, name: item.requirementDocumentNames?.[idx] || `file-${idx + 1}` }));
    }
    if (item.requirementDocumentId) {
      return [{ id: item.requirementDocumentId, name: item.requirementDocumentName || 'file-1' }];
    }
    return [];
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">
          Account Requests{' '}
          <span className="text-base font-normal text-gray-500">({requests.filter((r) => !r.read).length} unread)</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2 max-h-[70vh] overflow-y-auto">
          {requests.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No account requests yet</div>
          ) : (
            requests.map((item) => {
              const badge = submissionBadge(item.submissionType);
              return (
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
                      <p className={`text-sm truncate ${!item.read ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {item.companyName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {item.firstName} {item.lastName} - {item.contactEmail}
                      </p>
                      <span className={`inline-flex items-center mt-2 px-2 py-0.5 rounded-full border text-[11px] font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
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
              );
            })
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <GlassCard>
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selected.companyName}</h2>
                    <p className="text-sm text-gray-500">{selected.companyCity}, {selected.companyState}</p>
                  </div>
                  <div className="flex gap-2">
                    <GlassButton variant="ghost" onClick={() => setDeleteId(selected._id)}>
                      <Trash2 size={16} />
                    </GlassButton>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <p className="flex items-center gap-2"><UserRound size={14} /> {selected.firstName} {selected.lastName}</p>
                  <p>{selected.designation}</p>
                  <p className="flex items-center gap-2"><Mail size={14} /> {selected.contactEmail}</p>
                  <p>{selected.mobileNumber}</p>
                  <p><span className="font-medium">Invoice Email:</span> {selected.invoiceEmail || '-'}</p>
                  <p><span className="font-medium">Industry:</span> {selected.industry || '-'}</p>
                  <p><span className="font-medium">Expected Checks/Year:</span> {selected.backgroundsPerYear || '-'}</p>
                  <p><span className="font-medium">Source:</span> {selected.heardAbout || '-'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Uploaded Documents</p>
                  <div className="flex flex-wrap gap-2">
                    {getCompanyDocs(selected).map((doc, idx) => (
                      <a
                        key={`company-doc-${doc.id}-${idx}`}
                        href={`/api/account-requests/documents/${doc.id}`}
                        className="inline-flex items-center rounded-lg border border-cluso-deep/20 bg-cluso-deep/10 px-3 py-1.5 text-xs font-medium text-cluso-deep hover:bg-cluso-deep/20"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Company Document {idx + 1} ({doc.name})
                      </a>
                    ))}

                    {getRequirementDocs(selected).map((doc, idx) => (
                      <a
                        key={`requirement-doc-${doc.id}-${idx}`}
                        href={`/api/account-requests/documents/${doc.id}`}
                        className="inline-flex items-center rounded-lg border border-cluso-deep/20 bg-cluso-deep/10 px-3 py-1.5 text-xs font-medium text-cluso-deep hover:bg-cluso-deep/20"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Requirement Document {idx + 1} ({doc.name})
                      </a>
                    ))}

                    {getCompanyDocs(selected).length === 0 && getRequirementDocs(selected).length === 0 && (
                      <span className="text-sm text-gray-500">No documents uploaded</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Building2 size={14} /> Selected Background Checks
                  </p>
                  {selected.checks && selected.checks.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selected.checks.map((check) => (
                        <span key={check} className="inline-flex items-center px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs text-gray-700">
                          {check}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No checks selected.</p>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Additional Requirements</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.customRequirements || '-'}</p>
                </div>
              </div>
            </GlassCard>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Building2 size={48} className="mb-3 opacity-50" />
              <p>Select an account request to view</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Account Request"
        message="Are you sure you want to delete this account request?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
