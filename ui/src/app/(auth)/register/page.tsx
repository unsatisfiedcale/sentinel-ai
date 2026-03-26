'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { registerSchema, type RegisterFormValues } from '@/src/lib/validations/auth';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormValues) => {
    console.log({ body: data });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2 text-center lg:text-left select-none">
        <h2 className="text-3xl font-bold tracking-tighter text-white">Create Account</h2>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          Start monitoring your infrastructure proactively with SentinelAI.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest ml-1">Full Name</label>
          <input
            {...register('fullName')}
            placeholder="John Doe"
            className={`w-full bg-zinc-900/50 border ${errors.fullName ? 'border-red-900/50' : 'border-zinc-800'} rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-zinc-700 outline-none focus:border-zinc-500 transition-all shadow-sm`}
          />
          {errors.fullName && (
            <p className="text-[11px] text-red-500 ml-1 italic font-medium">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest ml-1">Work Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="name@company.com"
            className={`w-full bg-zinc-900/50 border ${errors.email ? 'border-red-900/50' : 'border-zinc-800'} rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-zinc-700 outline-none focus:border-zinc-500 transition-all shadow-sm`}
          />
          {errors.email && <p className="text-[11px] text-red-500 ml-1 italic font-medium">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[12px] font-semibold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
          <input
            {...register('password')}
            type="password"
            placeholder="••••••••"
            className={`w-full bg-zinc-900/50 border ${errors.password ? 'border-red-900/50' : 'border-zinc-800'} rounded-lg px-4 py-3 text-[15px] text-white placeholder:text-zinc-700 outline-none focus:border-zinc-500 transition-all shadow-sm`}
          />
          {errors.password && (
            <p className="text-[11px] text-red-500 ml-1 italic font-medium">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-white text-black font-bold text-base py-3 rounded-lg hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 shadow-lg"
        >
          {isSubmitting ? 'Processing...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-zinc-200 hover:text-white transition-colors font-medium underline underline-offset-4 decoration-zinc-700"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
