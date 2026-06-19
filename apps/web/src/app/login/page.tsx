'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login(email, password);
      if (res.success) {
        router.push('/admin');
      } else {
        setErrorMsg(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMsg('Connection failed. Please verify the API server is online.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#020C1B]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-secondary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#0A192F] to-[#020C1B] p-6 text-white relative">
      <div className="absolute top-10 left-10 w-80 h-80 bg-secondary/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0A192F]/65 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl z-10 transition-all">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-secondary/15 rounded-xl flex items-center justify-center border border-secondary/20 mb-4 animate-pulse">
            <GraduationCap className="h-7 w-7 text-secondary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-center tracking-wide text-white">
            GrowMedLink <span className="text-secondary font-light block text-sm mt-0.5">Intelligen Portal</span>
          </h1>
          <p className="text-gray-400 text-xs mt-2 font-medium tracking-wide">
            AUTHENTICATE TO ACCESS THE CMS ADMINISTRATOR
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-3 bg-red-500/15 border border-red-500/20 text-red-400 p-4 rounded-lg text-sm mb-6">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@growmedlink.com"
                className="w-full pl-11 pr-4 py-3.5 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                required
                disabled={isSubmitting}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3.5 bg-[#020C1B]/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-4 bg-secondary hover:bg-secondary-dark text-[#020C1B] font-bold rounded-xl shadow-lg shadow-secondary/10 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-[#020C1B]/20 border-t-[#020C1B] rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
