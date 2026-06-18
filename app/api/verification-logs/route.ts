import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import VerificationLog from '@/lib/models/VerificationLog';
import Certificate from '@/lib/models/Certificate';

interface VerificationLogDoc {
  _id: unknown;
  certificateId: string;
  verifierCompany: string;
  verifierName: string;
  verifierEmail: string;
  verifierPhone: string;
  useCase: string;
  cin?: string;
  verifiedAt?: string | Date;
  createdAt: string | Date;
}

interface CertificateDoc {
  id: string;
  recipientName: string;
  recipientEmail: string;
  recipientDesignation?: string;
  type: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  respondentName?: string;
  respondentRole?: string;
  respondentDepartment?: string;
  createdAt?: string;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();

  // Load verification logs sorted newest first
  const logs = (await VerificationLog.find().sort({ createdAt: -1 }).lean()) as unknown as VerificationLogDoc[];

  if (logs.length === 0) {
    return NextResponse.json([]);
  }

  // Fetch corresponding certificates to match employee/candidate details
  const certIds = Array.from(new Set(logs.map((log) => log.certificateId)));
  const certificates = (await Certificate.find({ id: { $in: certIds } }).lean()) as unknown as CertificateDoc[];

  // Create a map for fast lookup
  const certMap = new Map<string, CertificateDoc>();
  certificates.forEach((cert) => {
    certMap.set(cert.id, cert);
  });

  // Merge log and certificate details
  const mergedLogs = logs.map((log) => {
    const cert = certMap.get(log.certificateId);
    return {
      _id: log._id,
      certificateId: log.certificateId,
      verifierCompany: log.verifierCompany,
      verifierName: log.verifierName,
      verifierEmail: log.verifierEmail,
      verifierPhone: log.verifierPhone,
      useCase: log.useCase,
      cin: log.cin || 'N/A',
      verifiedAt: log.verifiedAt || log.createdAt,
      // Employee info
      employeeName: cert ? cert.recipientName : 'Unknown / Deleted Recipient',
      employeeEmail: cert ? cert.recipientEmail : 'N/A',
      employeeDesignation: cert ? (cert.recipientDesignation || 'N/A') : 'N/A',
      certificateType: cert ? cert.type : 'N/A',
    };
  });

  return NextResponse.json(mergedLogs);
}
