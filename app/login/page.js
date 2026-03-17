'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Terminal, Fingerprint, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { loginWithPassword } from '@/app/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginWithPassword(new FormData(e.currentTarget));
      
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('IDENTITY_CONFIRMED: Access granted.');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      toast.error('CONNECTION_FAILED: System synchronization error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row relative overflow-hidden selection:bg-[#00F0FF]/30 selection:text-[#00F0FF]">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00F0FF]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#7000FF]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Hero Branding Section (Visible on MD+) */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-16 bg-black/40 border-r border-white/5 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10"></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-4 mb-16 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F0FF] to-[#7000FF] p-0.5 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
               <div className="w-full h-full bg-black rounded-[15px] flex items-center justify-center font-black text-[#00F0FF] text-2xl italic italic">A</div>
            </div>
            <span className="text-3xl font-black tracking-tighter text-white group-hover:text-[#00F0FF] transition-colors">AAROHAN</span>
          </Link>
          
          <div className="mt-20 max-w-lg">
             <div className="flex items-center gap-3 mb-6 px-4 py-2 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/20 text-[#00F0FF] w-fit">
                <Terminal className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">GATEWAY_AUTHENTICATION</span>
             </div>
             <h1 className="text-6xl font-black text-white leading-none tracking-tighter mb-8 uppercase italic">
                SECURE <br /><span className="gradient-text">ACCESS</span>
             </h1>
             <p className="text-gray-500 font-bold text-lg leading-relaxed border-l-2 border-white/10 pl-8">
                Enter your encrypted credentials to interface with the central mission directory.
             </p>
          </div>
        </div>

        <div className="relative z-10">
           <div className="flex items-center gap-6 text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">
              <span>SSL_ENCRYPTED</span>
              <div className="w-1 h-1 rounded-full bg-gray-800"></div>
              <span>256_BIT_AES</span>
              <div className="w-1 h-1 rounded-full bg-gray-800"></div>
              <span>SECURED_GRID</span>
           </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="mb-12">
            <Link
              href="/"
              className="md:hidden inline-flex items-center text-gray-500 hover:text-white transition-colors mb-8 text-[10px] font-black uppercase tracking-widest gap-2"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Return Home
            </Link>
            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">System Login</h2>
            <p className="text-gray-500 font-bold text-sm tracking-tight">Identity verification required for sector access.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block ml-1">Personnel Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#00F0FF] transition-colors" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:border-[#00F0FF]/50 outline-none transition-all font-medium placeholder:text-gray-700"
                    placeholder="user@grid.node"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Access Key</label>
                   <Link href="#" className="text-[9px] font-black text-gray-600 hover:text-[#00F0FF] uppercase tracking-widest transition-colors">Key Recovery?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#00F0FF] transition-colors" />
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-sm text-white focus:border-[#00F0FF]/50 outline-none transition-all font-medium placeholder:text-gray-700 font-mono"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-gradient-to-r from-[#00F0FF] to-[#7000FF] text-black font-black flex items-center justify-center gap-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(0,240,255,0.2)] disabled:opacity-50 disabled:grayscale text-xs uppercase tracking-[0.3em] italic"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Verifying Identity...
                </>
              ) : (
                <>
                  <Fingerprint className="w-5 h-5" />
                  Establish Link
                </>
              )}
            </button>
          </form>

          <div className="mt-12 p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-gray-500 text-xs font-bold mb-4">New operative joining the arena?</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-3 text-[#00F0FF] font-black text-xs uppercase tracking-[0.2em] group"
            >
              <Zap className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
              Begin Onboarding
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="mt-12 text-center text-[9px] font-black text-gray-800 uppercase tracking-[0.5em] pointer-events-none">
             SYSTEM_ID_v4.2.0_NITDGP
          </div>
        </div>
      </div>
    </div>
  );
}
