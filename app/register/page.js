'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, UserCircle, ArrowRight, ShieldCheck, ArrowLeft, Eye, EyeOff, Terminal, Sparkles, Cpu, Target, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { registerUser, verifyRegistrationOTP } from '@/app/actions/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'external'
  });
  const [otp, setOtp] = useState('');

  const handleNextStep = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await registerUser(new FormData(e.currentTarget));
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('ENCRYPTION_SENT: Check your email for verify token.');
        setStep(2);
      }
    } catch (error) {
      toast.error('ONBOARDING_FAILED: Signal disrupted.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fData = new FormData(e.currentTarget);
      fData.append('email', formData.email);
      fData.append('fullName', formData.fullName);
      fData.append('role', formData.role);
      fData.append('password', formData.password);

      const res = await verifyRegistrationOTP(fData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('ACCOUNT_ESTABLISHED: Registration complete.');
        router.push('/dashboard');
      }
    } catch (error) {
      toast.error('VERIFICATION_FAILED: Token mismatch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row relative overflow-hidden selection:bg-[#00F0FF]/30 selection:text-[#00F0FF]">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#7000FF]/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#00F0FF]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      {/* Hero Branding Section (Visible on MD+) */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-16 bg-black/40 border-r border-white/5 backdrop-blur-3xl relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-10"></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-4 mb-16 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F0FF] to-[#7000FF] p-0.5 shadow-[0_0_30px_rgba(0,240,255,0.2)]">
               <div className="w-full h-full bg-black rounded-[15px] flex items-center justify-center font-black text-[#00F0FF] text-2xl italic">A</div>
            </div>
            <span className="text-3xl font-black tracking-tighter text-white group-hover:text-[#00F0FF] transition-colors uppercase italic">Aarohan</span>
          </Link>
          
          <div className="mt-20 max-w-lg">
             <div className="flex items-center gap-3 mb-6 px-4 py-2 rounded-xl bg-[#7000FF]/10 border border-[#7000FF]/20 text-[#7000FF] w-fit">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">NEW_RECRUIT_ENROLLMENT</span>
             </div>
             <h1 className="text-6xl font-black text-white leading-none tracking-tighter mb-8 uppercase italic">
                JOIN THE <br /><span className="gradient-text">ARENA</span>
             </h1>
             <p className="text-gray-500 font-bold text-lg leading-relaxed border-l-2 border-white/10 pl-8">
                Initialize your operative profile to enlist in missions and compete for grand system rewards.
             </p>

             <div className="mt-16 space-y-6">
                {[
                  { icon: <Target className="w-4 h-4" />, text: "Access Elite Missions" },
                  { icon: <Cpu className="w-4 h-4" />, text: "Earn Technical Credits" },
                  { icon: <CheckCircle2 className="w-4 h-4" />, text: "Win Grand Prizes" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">
                     <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                        {item.icon}
                     </div>
                     {item.text}
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="relative z-10">
           <div className="flex items-center gap-6 text-[10px] font-black text-gray-700 uppercase tracking-[0.4em]">
              <span>SSL_ENCRYPTED</span>
              <div className="w-1 h-1 rounded-full bg-gray-800"></div>
              <span>DIRECT_REGISTRY</span>
           </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative overflow-y-auto">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700 my-auto">
          <div className="mb-12">
            <Link
              href={step === 1 ? "/login" : "#"}
              onClick={(e) => { if (step === 2) { e.preventDefault(); setStep(1); } }}
              className="inline-flex items-center text-gray-500 hover:text-white transition-colors mb-8 text-[10px] font-black uppercase tracking-widest gap-2 group w-fit"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {step === 1 ? 'Switch to Login' : 'Modify Credentials'}
            </Link>
            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
               {step === 1 ? "Initialization" : "Security Sync"}
            </h2>
            <p className="text-gray-500 font-bold text-sm tracking-tight">
               {step === 1 ? "Establishing personnel data stream." : "Verify your identity via encrypted token."}
            </p>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-8">
               <div className="space-y-6">
                 {/* Full Name */}
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block ml-1">Legal Identity</label>
                   <div className="relative group">
                     <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#00F0FF] transition-colors" />
                     <input
                       name="fullName"
                       type="text"
                       required
                       value={formData.fullName}
                       onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                       className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:border-[#00F0FF]/50 outline-none transition-all font-medium placeholder:text-gray-700"
                       placeholder="Full Name"
                     />
                   </div>
                 </div>

                 {/* Email */}
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block ml-1">Secure Email</label>
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

                 {/* Password */}
                 <div className="space-y-3">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block ml-1">Master Key</label>
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

                 {/* Role Selection */}
                 <div className="space-y-4">
                   <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block ml-1">Authentication Tier</label>
                   <div className="grid grid-cols-2 gap-4">
                     <button
                       type="button"
                       onClick={() => setFormData({ ...formData, role: 'external' })}
                       className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 relative overflow-hidden group/btn ${
                         formData.role === 'external'
                           ? 'border-[#00F0FF] bg-[#00F0FF]/10 text-white shadow-[0_0_20px_rgba(0,240,255,0.1)]'
                           : 'border-white/5 bg-white/[0.02] text-gray-500 hover:border-white/10'
                       }`}
                     >
                       <UserCircle className={`w-6 h-6 ${formData.role === 'external' ? 'text-[#00F0FF]' : 'text-gray-700'}`} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-center">External Ops</span>
                       <input type="hidden" name="role" value={formData.role} />
                       {formData.role === 'external' && <div className="absolute top-0 right-0 w-2 h-2 bg-[#00F0FF] rounded-bl-lg"></div>}
                     </button>
                     <button
                       type="button"
                       onClick={() => setFormData({ ...formData, role: 'student' })}
                       className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 relative overflow-hidden group/btn ${
                         formData.role === 'student'
                           ? 'border-[#7000FF] bg-[#7000FF]/10 text-white shadow-[0_0_20px_rgba(112,0,255,0.1)]'
                           : 'border-white/5 bg-white/[0.02] text-gray-500 hover:border-white/10'
                       }`}
                     >
                       <ShieldCheck className={`w-6 h-6 ${formData.role === 'student' ? 'text-[#7000FF]' : 'text-gray-700'}`} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-center">Uni Core</span>
                       {formData.role === 'student' && <div className="absolute top-0 right-0 w-2 h-2 bg-[#7000FF] rounded-bl-lg"></div>}
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
                   <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                 ) : (
                   <>
                     <span>Initialize Onboarding</span>
                     <ArrowRight className="w-5 h-5" />
                   </>
                 )}
               </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-12">
               <div className="text-center">
                  <p className="text-gray-500 font-bold mb-10 text-sm">
                    Cipher token dispatched to system node:<br />
                    <span className="text-white font-mono mt-2 block">{formData.email}</span>
                  </p>
                  
                  <div className="max-w-[280px] mx-auto">
                    <input
                      name="token"
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white/5 border border-white/10 text-center text-4xl tracking-[0.4em] font-black text-[#00F0FF] focus:border-[#00F0FF]/50 outline-none py-6 rounded-2xl transition-all shadow-inner"
                      placeholder="000000"
                    />
                  </div>
               </div>

               <div className="space-y-6">
                 <button
                   type="submit"
                   disabled={loading || otp.length !== 6}
                   className="w-full h-16 bg-[#39FF14] text-black font-black flex items-center justify-center gap-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(57,255,20,0.2)] disabled:opacity-30 disabled:grayscale text-[11px] uppercase tracking-[0.3em] italic"
                 >
                   {loading ? (
                     <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                   ) : (
                     <>
                       <ShieldCheck className="w-5 h-5" />
                       Verify & Authenticate
                     </>
                   )}
                 </button>
                 
                 <button 
                   type="button" 
                   className="w-full text-[10px] font-black text-gray-600 hover:text-[#00F0FF] uppercase tracking-[0.4em] transition-colors"
                   onClick={() => setStep(1)}
                 >
                   Signal Token Timeout? Retry →
                 </button>
               </div>
            </form>
          )}

          <div className="mt-12 text-center text-[9px] font-black text-gray-800 uppercase tracking-[0.5em] pointer-events-none">
             AAROHAN_REGISTRY_v4.2.0
          </div>
        </div>
      </div>
    </div>
  );
}
