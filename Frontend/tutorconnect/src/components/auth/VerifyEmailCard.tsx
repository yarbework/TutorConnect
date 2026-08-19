'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import {authApi} from '@/src/lib/api/auth';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailCard() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('Invalid or expired verification link.');

  useEffect(() => {
  if (!token) {
    setStatus('error');
    setErrorMessage('No verification token provided.');
    return;
  }

  async function verify() {
    try {
      await authApi.verifyEmail(token as string);
      setStatus('success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification link expired or invalid.');
      setStatus('error');
    }
  }

  verify();
}, [token]);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80 max-w-md w-full text-center space-y-6">
      {status === 'loading' && (
        <div className="space-y-4 py-6">
          <Loader2 className="w-12 h-12 text-blue-700 animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Verifying Your Email...</h2>
          <p className="text-sm text-slate-500">Please wait while we confirm your account details.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4 py-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Email Verified!</h2>
          <p className="text-sm text-slate-600">
            Your email address has been successfully verified. You can now log in to your TutorConnect account.
          </p>
          <Link
            href="/login"
            className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 min-h-11"
          >
            Go to Login <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4 py-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Verification Failed</h2>
          <p className="text-sm text-slate-600">{errorMessage}</p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/register"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center min-h-11"
            >
              Re-register Account
            </Link>
            <Link
              href="/login"
              className="text-xs text-blue-700 font-bold hover:underline py-2"
            >
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}