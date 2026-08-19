'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '../../lib/validations/auth';
import { 
  GraduationCap, UserCheck, Eye, EyeOff, Check, X, 
  Loader2, ArrowRight 
} from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/src/lib/api/auth';

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryRole = searchParams.get('role')?.toUpperCase();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      role: (queryRole === 'TUTOR' || queryRole === 'GUARDIAN') ? queryRole : 'GUARDIAN',
    },
  });

  const selectedRole = watch('role');
  const passwordValue = watch('password') || '';

  // OWASP 
  const passwordRequirements = [
    { label: '8–128 characters', pass: passwordValue.length >= 8 && passwordValue.length <= 128 },
    { label: 'One uppercase letter (A-Z)', pass: /[A-Z]/.test(passwordValue) },
    { label: 'One lowercase letter (a-z)', pass: /[a-z]/.test(passwordValue) },
    { label: 'One number (0-9)', pass: /[0-9]/.test(passwordValue) },
    { label: 'One special character (@$!%*?&)', pass: /[@$!%*?&]/.test(passwordValue) },
  ];

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    try {
const response = await authApi.register(data);

      toast.success(response.message || 'Account created! Please check your email to verify your account.');
      router.push('/login?registered=true');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          I am signing up as a:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('role', 'GUARDIAN', { shouldValidate: true })}
            className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between min-h-25 ${
              selectedRole === 'GUARDIAN'
                ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-600/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <GraduationCap className={`w-6 h-6 ${selectedRole === 'GUARDIAN' ? 'text-emerald-600' : 'text-slate-400'}`} />
            <div>
              <p className="text-sm font-bold text-slate-900">Parent / Guardian</p>
              <p className="text-[11px] text-slate-500">I want to hire a tutor</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setValue('role', 'TUTOR', { shouldValidate: true })}
            className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between min-h-25 ${
              selectedRole === 'TUTOR'
                ? 'border-blue-700 bg-blue-50/50 ring-2 ring-blue-700/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <UserCheck className={`w-6 h-6 ${selectedRole === 'TUTOR' ? 'text-blue-700' : 'text-slate-400'}`} />
            <div>
              <p className="text-sm font-bold text-slate-900">Tutor / Educator</p>
              <p className="text-[11px] text-slate-500">I want to teach students</p>
            </div>
          </button>
        </div>
        {errors.role && <p className="mt-1.5 text-xs text-rose-600 font-medium">{errors.role.message}</p>}
      </div>

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
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
          Password
        </label>
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

        <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Password Requirements:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {passwordRequirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs">
                {req.pass ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
                <span className={req.pass ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  {req.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-11 shadow-md"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            Create Account <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}