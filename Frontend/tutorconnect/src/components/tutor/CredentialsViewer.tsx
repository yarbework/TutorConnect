'use client';

import { ExternalLink, FileText, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { VerificationStatus } from '../../types/tutor';

interface CredentialsViewerProps {
  documentUrl?: string | null;
  status?: VerificationStatus;
}

export default function CredentialsViewer({ documentUrl, status = 'PENDING' }: CredentialsViewerProps) {
  if (!documentUrl) {
    return (
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
        No credential document linked. Add a Google Drive or Canva share link to verify your qualifications.
      </div>
    );
  }

  let embedUrl: string | null = null;
  if (documentUrl.includes('drive.google.com/file/d/')) {
    const fileId = documentUrl.split('/file/d/')[1]?.split('/')[0];
    if (fileId) embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-700" />
          <div>
            <p className="text-xs font-bold text-slate-800">Academic Credentials Document</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {status === 'APPROVED' && (
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified by Admin
                </span>
              )}
              {status === 'PENDING' && (
                <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Pending Verification Audit
                </span>
              )}
              {status === 'REJECTED' && (
                <span className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Document Verification Rejected
                </span>
              )}
            </div>
          </div>
        </div>

        <a
          href={documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 min-h-11 px-2"
        >
          Open Link <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {embedUrl && (
        <div className="w-full h-72 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
          <iframe src={embedUrl} className="w-full h-full" title="Tutor Credentials" />
        </div>
      )}
    </div>
  );
}