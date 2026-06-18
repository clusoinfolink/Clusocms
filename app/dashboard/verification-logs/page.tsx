'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { GlassButton } from '@/components/ui/GlassButton';
import { Eye, ShieldCheck, Calendar, Mail, Phone, Building, FileText, CheckCircle2, User } from 'lucide-react';

interface VerificationLog {
  [key: string]: unknown;
  _id: string;
  certificateId: string;
  verifierCompany: string;
  verifierName: string;
  verifierEmail: string;
  verifierPhone: string;
  useCase: string;
  cin: string;
  verifiedAt: string;
  employeeName: string;
  employeeEmail: string;
  employeeDesignation: string;
  certificateType: string;
}

export default function VerificationLogsPage() {
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<VerificationLog | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const res = await fetch('/api/verification-logs');
      if (res.ok) {
        setLogs(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch verification logs:', err);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    {
      key: 'employeeName' as const,
      label: 'Employee',
      render: (val: unknown, row: VerificationLog) => (
        <div>
          <div className="font-bold text-gray-900">{String(val)}</div>
          <div className="text-xs text-gray-500 font-medium">{row.employeeEmail}</div>
        </div>
      ),
    },
    {
      key: 'certificateType' as const,
      label: 'Verification Type',
      render: (val: unknown, row: VerificationLog) => (
        <div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cluso-deep/5 text-cluso-deep">
            {String(val || 'N/A')}
          </span>
          <div className="text-xs text-gray-400 mt-0.5 font-mono uppercase tracking-wider">{row.certificateId}</div>
        </div>
      ),
    },
    {
      key: 'verifierCompany' as const,
      label: 'Verifier',
      render: (val: unknown, row: VerificationLog) => (
        <div>
          <div className="font-bold text-gray-800">{String(val)}</div>
          <div className="text-xs text-gray-500 font-medium">By {row.verifierName}</div>
        </div>
      ),
    },
    {
      key: 'verifiedAt' as const,
      label: 'Verification Date',
      render: (val: unknown) => (
        <div className="text-sm text-gray-600 font-medium">
          {new Date(val as string).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-cluso-deep" size={28} />
            Verification Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time logs of employee credentials and background check verifications performed by external organizations.
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        actions={(row) => (
          <button
            onClick={() => setSelectedLog(row)}
            className="p-1.5 text-cluso-deep hover:bg-cluso-deep/10 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
            title="View Details"
          >
            <Eye size={16} />
            Details
          </button>
        )}
      />

      {/* Modal for Details */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-cluso-green/10 flex items-center justify-center text-cluso-green">
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-gray-900 text-lg">Verification Log Details</h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5 uppercase">ID: {selectedLog.certificateId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600 font-semibold text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Section 1: Employee/Candidate details */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <User size={14} /> Employee Being Verified
                </h4>
                <div className="bg-[#fcfcfa] rounded-2xl p-4 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-400 block">Name</span>
                    <span className="font-bold text-gray-900">{selectedLog.employeeName}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Email Address</span>
                    <span className="font-medium text-gray-800">{selectedLog.employeeEmail}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Designation</span>
                    <span className="text-gray-700 font-medium">{selectedLog.employeeDesignation}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Credential Type</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-cluso-deep/5 text-cluso-deep mt-0.5">
                      {selectedLog.certificateType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Verifier details */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Building size={14} /> Verifier / Company Info
                </h4>
                <div className="bg-[#fcfcfa] rounded-2xl p-4 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-400 block">Company Name</span>
                    <span className="font-bold text-gray-900">{selectedLog.verifierCompany}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Verified By</span>
                    <span className="font-bold text-gray-900">{selectedLog.verifierName}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={16} className="text-gray-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Email</span>
                      <span className="text-gray-800 font-medium">{selectedLog.verifierEmail}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={16} className="text-gray-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Phone</span>
                      <span className="text-gray-800 font-medium">{selectedLog.verifierPhone}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block">Corporate Identification No. (CIN)</span>
                    <span className="font-mono text-gray-800 text-sm uppercase">{selectedLog.cin}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar size={16} className="text-gray-400 mt-1 shrink-0" />
                    <div>
                      <span className="text-xs text-gray-400 block">Verified At</span>
                      <span className="text-gray-800 font-medium">
                        {new Date(selectedLog.verifiedAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Purpose */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FileText size={14} /> Purpose / Use Case
                </h4>
                <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selectedLog.useCase}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end bg-slate-50/50">
              <GlassButton onClick={() => setSelectedLog(null)} variant="primary">
                Close
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
