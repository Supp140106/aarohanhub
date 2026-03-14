'use client';

import { useState } from 'react';
import { registerUser, verifyRegistrationOTP } from '@/app/actions/auth';
import Link from 'next/link';
import { toast } from 'sonner';

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Store form data to pass to step 2 verification
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

        // Re-attach data for the server action
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
        // If success, server action handles the redirect
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Join Aarohan 2026</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form action={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                                placeholder="Choose a secure password"
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Wait, I am a...
                            </label>
                            <select
                                id="role"
                                name="role"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                            >
                                <option value="external">External Participant</option>
                                <option value="student">University Student</option>
                                <option value="volunteer">Volunteer</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Organizers and Admin accounts are assigned internally.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50 mt-4"
                        >
                            {loading ? 'Sending OTP...' : 'Register & Get OTP'}
                        </button>

                        <div className="text-center mt-4">
                            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Already have an account? Login here.
                            </Link>
                        </div>
                    </form>
                ) : (
                    <form action={handleVerify} className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-4">
                                We&apos;ve sent a 6-digit OTP to <span className="font-semibold">{formDataCache.email}</span> to verify your registration.
                            </p>
                            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                                Enter OTP
                            </label>
                            <input
                                type="text"
                                id="token"
                                name="token"
                                required
                                maxLength={6}
                                pattern="\d{6}"
                                className="w-full px-4 py-2 text-center tracking-widest text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
                                placeholder="------"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50"
                        >
                            {loading ? 'Verifying & Creating Account...' : 'Verify OTP & Complete Setup'}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setStep(1); setError(''); }}
                            className="w-full text-sm text-gray-600 hover:text-gray-900 mt-2"
                        >
                            Back to registration form
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
