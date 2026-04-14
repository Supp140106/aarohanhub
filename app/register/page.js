'use client';

import { useState } from 'react';
import { registerUser, verifyRegistrationOTP } from '@/app/actions/auth';
import Link from 'next/link';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import SplitText from '@/components/ReactBits/SplitText';
import { ArrowUpRight, ArrowLeft, Loader2 } from 'lucide-react';

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formDataCache, setFormDataCache] = useState({
        fullName: '',
        email: '',
        role: 'external',
        password: ''
    });

    async function handleRegister(formData) {
        setLoading(true);
        setError('');

        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const role = formData.get('role');
        const password = formData.get('password');

        const res = await registerUser(formData);

        if (res?.error) {
            toast.error(res.error);
            setError(res.error);
        } else {
            toast.success('OTP sent to your email!');
            setFormDataCache({ fullName, email, role, password });
            setStep(2);
        }
        setLoading(false);
    }

    async function handleVerify(formData) {
        setLoading(true);
        setError('');

        formData.append('email', formDataCache.email);
        formData.append('fullName', formDataCache.fullName);
        formData.append('role', formDataCache.role);
        formData.append('password', formDataCache.password);

        const res = await verifyRegistrationOTP(formData);
        if (res?.error) {
            toast.error(res.error);
            setError(res.error);
        } else {
            toast.success('Account created successfully!');
        }
        setLoading(false);
    }

    return (
        <div className="h-screen overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4 relative font-sans">

            <Link href="/" className="absolute top-8 left-8 text-gray-500 hover:text-white transition-colors font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to HQ
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="mb-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2 mt-4">
                        <SplitText text="INITIALIZE" delay={30} className="block text-[#00F0FF]" />
                        <SplitText text="NEW NODE" delay={30} className="block" />
                    </h1>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-red-500/10 border border-red-500 text-red-500 font-bold uppercase tracking-widest text-xs text-center">
                        {error}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            action={handleRegister}
                            className="space-y-6"
                        >
                            <div>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    required
                                    className="w-full px-6 py-4 bg-transparent border-b-2 border-white/20 focus:border-[#00F0FF] outline-none transition-colors text-white text-lg rounded-none placeholder:text-white/20 uppercase font-medium tracking-wider"
                                    placeholder="Full Name"
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="w-full px-6 py-4 bg-transparent border-b-2 border-white/20 focus:border-[#00F0FF] outline-none transition-colors text-white text-lg rounded-none placeholder:text-white/20 uppercase font-medium tracking-wider"
                                    placeholder="Email Address"
                                />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    required
                                    className="w-full px-6 py-4 bg-transparent border-b-2 border-white/20 focus:border-[#00F0FF] outline-none transition-colors text-white text-lg rounded-none placeholder:text-white/20 uppercase font-medium tracking-wider"
                                    placeholder="Access Key (Password)"
                                />
                            </div>

                            <div>
                                <select
                                    id="role"
                                    name="role"
                                    required
                                    className="w-full px-6 py-4 bg-transparent border-b-2 border-white/20 focus:border-[#00F0FF] outline-none transition-colors text-white text-lg rounded-none uppercase font-medium tracking-wider appearance-none cursor-pointer"
                                >
                                    <option value="external" className="bg-[#0a0a0a] text-white">External Participant</option>
                                    <option value="student" className="bg-[#0a0a0a] text-white">NIT Durgapur Student</option>
                                    <option value="volunteer" className="bg-[#0a0a0a] text-white">Volunteer</option>

                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 bg-white text-black font-black uppercase tracking-widest py-4 px-8 flex items-center justify-center gap-4 hover:bg-[#00F0FF] transition-colors disabled:opacity-50 group"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin shrink-0" />}
                                {loading ? 'Transmitting Data...' : 'Request Validation OTP'}
                                {!loading && <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform" />}
                            </button>

                            <div className="text-center mt-6">
                                <Link href="/login" className="text-sm text-gray-500 hover:text-white uppercase tracking-widest font-bold transition-colors pb-4">
                                    Node Already Initialized? Login
                                </Link>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            action={handleVerify}
                            className="space-y-8 text-center"
                        >
                            <div>
                                <p className="text-sm text-gray-400 mb-8 uppercase tracking-widest leading-loose">
                                    Security Token Sent To<br /><span className="text-[#00F0FF] font-bold text-lg">{formDataCache.email}</span>
                                </p>

                                <input
                                    type="text"
                                    id="token"
                                    name="token"
                                    required
                                    maxLength={6}
                                    pattern="\d{6}"
                                    className="w-full px-4 py-6 bg-transparent border border-white/20 focus:border-[#00F0FF] text-center tracking-[1em] text-4xl rounded-xl outline-none transition-colors text-white uppercase font-black"
                                    placeholder="------"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-10 bg-[#00F0FF] text-black font-black uppercase tracking-widest py-6 px-8 flex items-center justify-center gap-4 hover:bg-white transition-colors disabled:opacity-50 group"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin shrink-0 text-black" />}
                                {loading ? 'Verifying Integrity...' : 'Confirm Authentication'}
                                {!loading && <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform text-black" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => { setStep(1); setError(''); }}
                                className="w-full text-xs text-gray-500 hover:text-white mt-8 tracking-widest uppercase font-bold transition-colors"
                            >
                                Abort Validation Sequence
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
