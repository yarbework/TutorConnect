'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/useAuthStore';
import { Eye, EyeOff, Loader2, ArrowRight, AlertCircle, MailWarning } from 'lucide-react';
import { authApi } from '@/src/lib/api/auth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<{ type: 'UNAUTHORIZED' | 'UNVERIFIED' | 'GENERIC'; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

const onSubmit = async (data: LoginInput) => {
  setIsSubmitting(true);
  setAuthError(null);

  try {
    const result = await authApi.login(data);

    setAuth(result.user, result.token);

    router.push(result.user.role === 'TUTOR' ? '/tutor/dashboard' : '/guardian/dashboard');
  } catch (err: any) {
    if (err.status === 401) {
      setAuthError({ type: 'UNAUTHORIZED', message: 'Invalid credentials. Please try again.' });
    } else if (err.status === 403) {
      setAuthError({ type: 'UNVERIFIED', message: 'Please verify your email before logging in.' });
    } else {
      setAuthError({ type: 'GENERIC', message: err.message || 'Failed to connect to backend.' });
    }
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* 401 / 403 Error UI Box */}
      {authError && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${
            authError.type === 'UNVERIFIED'
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {authError.type === 'UNVERIFIED' ? (
            <MailWarning className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-bold">{authError.type === 'UNVERIFIED' ? 'Verification Required' : 'Authentication Failed'}</p>
            <p className="mt-0.5">{authError.message}</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="name@example.com"
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 transition min-h-11 ${
            errors.email ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-200 focus:border-blue-700'
          }`}
        />
        {errors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Password
          </label>
          <Link href="/forgot-password" className="text-xs text-blue-700 hover:underline font-semibold">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={`w-full pl-4 pr-11 py-3 rounded-xl border bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 transition min-h-11 ${
              errors.password ? 'border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:ring-blue-200 focus:border-blue-700'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-11 shadow-md"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign In <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}