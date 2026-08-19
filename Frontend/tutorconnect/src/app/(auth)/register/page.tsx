import { Suspense } from 'react';
import Link from 'next/link';
import RegisterForm from '../../../components/auth/RegisterForm';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="text-2xl font-black text-blue-800 tracking-tight inline-block">
          Tutor<span className="text-emerald-600">Connect</span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Create your account</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-blue-700 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 sm:px-10">
          <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-700" /></div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}