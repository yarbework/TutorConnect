'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '../../lib/validations/auth';
import { authApi } from '../../lib/api/auth';
import { 
  GraduationCap, UserCheck, Eye, EyeOff, Check, X, 
  Loader2, ArrowRight, Mail, ArrowLeft, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterForm() {
  const searchParams = useSearchParams();
  const queryRole = searchParams.get('role')?.toUpperCase();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
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

  // Real-time OWASP Requirement Checks
  const passwordRequirements = [
    { label: '8–128 characters', pass: passwordValue.length >= 8 && passwordValue.length <= 128 },
    { label: 'One uppercase letter (A-Z)', pass: /[A-Z]/.test(passwordValue) },
    { label: 'One lowercase letter (a-z)', pass: /[a-z]/.test(passwordValue) },
    { label: 'One number (0-9)', pass: /[0-9]/.test(passwordValue) },
    { label: 'One special character (@$!%*?&)', pass: /[@$!%*?&]/.test(passwordValue) },
  ];

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await authApi.register(data);
      toast.success(response.message || 'Account created successfully!');
      setRegisteredEmail(data.email);
    } catch (err: any) {
      // Extract exact message from backend response
      const errorMessage = err?.data?.message || err?.message || 'Registration failed. Please try again.';
      setServerError(errorMessage);

      // Highlight the email input field on 409 conflict
      if (err?.status === 409 || err?.data?.statusCode === 409) {
        setError('email', {
          type: 'manual',
          message: 'An account with this email address already exists.',
        });
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Email Verification Confirmation View
  if (registeredEmail) {
    return (
      <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Mail className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900">Check your email</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            We sent a verification link to: <br />
            <span className="font-bold text-slate-900">{registeredEmail}</span>
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 leading-relaxed max-w-sm mx-auto text-left">
          Click the link in the email to activate your account. Once verified, you will be able to sign in to your TutorConnect dashboard.
        </div>

        <div className="pt-2 flex flex-col gap-3 max-w-sm mx-auto">
          <Link
            href="/login"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl transition flex items-center justify-center gap-2 min-h-11 shadow-md"
          >
            Go to Login <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => {
              setRegisteredEmail(null);
              setServerError(null);
            }}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center justify-center gap-1 py-1 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to registration form
          </button>
        </div>
      </div>
    );
  }

  // 2. Registration Input Form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      
      {/* Visual Backend Error Alert Banner */}
      {serverError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-slate-900">Registration Error</p>
            <p className="mt-0.5 text-rose-700">{serverError}</p>
            {serverError.toLowerCase().includes('already exists') && (
              <Link 
                href="/login" 
                className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-blue-700 hover:text-blue-900 underline"
              >
                Sign in to your existing account <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Role Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
          I am signing up as a:
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setValue('role', 'GUARDIAN', { shouldValidate: true })}
            className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between min-h-11 cursor-pointer ${
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
            className={`p-4 rounded-xl border-2 text-left transition-all flex flex-col justify-between min-h-25 cursor-pointer ${
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

      {/* Email Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
          Email Address
        </label>
        <input
          {...register('email')}
          type="email"
          placeholder="name@example.com"
          className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 transition min-h-11 ${
            errors.email ? 'border-rose-500 focus:ring-rose-200 bg-rose-50/30' : 'border-slate-200 focus:ring-blue-200 focus:border-blue-700'
          }`}
        />
        {errors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>}
      </div>

      {/* Password Input */}
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {/* Real-time Requirement Checks */}
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold py-3.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-11 shadow-md cursor-pointer"
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