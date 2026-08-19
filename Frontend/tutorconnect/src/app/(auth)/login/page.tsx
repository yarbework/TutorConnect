import Link from 'next/link';
import LoginForm from '../../../components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="text-2xl font-black text-blue-800 tracking-tight inline-block">
          Tutor<span className="text-emerald-600">Connect</span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Sign in to your account</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-600">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-blue-700 hover:text-blue-800">
            Create one now
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200/80 sm:px-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}