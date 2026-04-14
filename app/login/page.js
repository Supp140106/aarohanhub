'use client';

import { useState } from 'react';
import { loginWithPassword } from '@/app/actions/auth';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import SplitText from '@/components/ReactBits/SplitText';
import { ArrowUpRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin(formData) {
        setLoading(true);
        setError('');
        const res = await loginWithPassword(formData);
        if (res?.error) {
            toast.error(res.error);
            setError(res.error);
        } else {
            toast.success('Logged in successfully!');
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-6 relative overflow-hidden font-sans">
            
            <Link href="/" className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                Back to HQ
            </Link>

            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-12 text-center">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
                        <SplitText text="SYSTEM" delay={30} className="block text-[#00F0FF]" />
                        <SplitText text="LOGIN" delay={30} className="block" />
                    </h1>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-red-500/10 border border-red-500 text-red-500 font-bold uppercase tracking-widest text-xs text-center">
                        {error}
                    </motion.div>
                )}

                <form action={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-6 py-5 bg-transparent border-b-2 border-white/20 focus:border-[#00F0FF] outline-none transition-colors text-white text-lg rounded-none placeholder:text-white/20 uppercase font-medium tracking-wider"
                            placeholder="Email Address"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            required
                            className="w-full px-6 py-5 bg-transparent border-b-2 border-white/20 focus:border-[#00F0FF] outline-none transition-colors text-white text-lg rounded-none placeholder:text-white/20 uppercase font-medium tracking-wider"
                            placeholder="Password"
                        />
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-10 bg-white text-black font-black uppercase tracking-widest py-6 px-8 flex items-center justify-center gap-4 hover:bg-[#00F0FF] transition-colors disabled:opacity-50 group"
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin shrink-0" />}
                        {loading ? 'Authenticating...' : 'Enter Arena'}
                        {!loading && <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" /> }
                    </button>

                    <div className="text-center mt-12">
                        <Link href="/register" className="text-sm text-gray-500 hover:text-white uppercase tracking-widest font-bold transition-colors">
                            Initialize New ID
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
