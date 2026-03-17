'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Building2, Edit, Save, X, ArrowLeft, ShieldCheck, Award, Calendar, Phone } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ProfilePage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        college: '',
        phone: '',
        role: ''
    });
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        college: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch('/api/profile');
            const data = await res.json();
            if (res.ok && data.success) {
                setProfile(data.profile);
                setFormData({
                    name: data.profile.name,
                    phone: data.profile.phone,
                    college: data.profile.college
                });
            } else {
                toast.error(data.message || 'Identity verification failed.');
                router.push('/login');
            }
        } catch (err) {
            toast.error('Network synchronization failed.');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        if (!formData.name.trim()) {
            toast.error('Name cannot be empty.');
            return;
        }

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success('Identity data synchronized.');
                setProfile({ ...profile, ...formData });
                setIsEditing(false);
            } else {
                toast.error(data.message || 'Operation failed.');
            }
        } catch (err) {
            toast.error('Signal lost during update.');
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,240,255,0.2)]"></div>
                    <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Syncing Identity Stream...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] selection:bg-[#7000FF]/30 selection:text-[#7000FF] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#7000FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <main className="max-w-4xl mx-auto pt-32 pb-20 px-6 relative z-10">
                <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-[#00F0FF] font-black text-[10px] uppercase tracking-[0.2em] mb-12 transition-all group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Command Center
                </Link>

                {/* Profile Profile Card */}
                <div className="card-glass p-0 overflow-hidden border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-[#7000FF]/20 via-[#00F0FF]/10 to-transparent border-b border-white/10 relative">
                        <div className="absolute -bottom-16 left-10">
                            <div className="w-32 h-32 rounded-3xl bg-black border-4 border-[#050505] flex items-center justify-center text-[#7000FF] shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#7000FF]/20 to-[#00F0FF]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <User className="w-16 h-16 relative z-10" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-10 pb-12">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                            <div>
                                <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                                    Personnel <span className="gradient-text">File</span>
                                </h1>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <ShieldCheck className="w-3 h-3 text-[#39FF14]" />
                                    Access Tier: {profile.role}
                                </p>
                            </div>

                            {!isEditing ? (
                                <button 
                                    onClick={() => {
                                        setFormData({ name: profile.name, phone: profile.phone, college: profile.college });
                                        setIsEditing(true);
                                    }}
                                    className="btn-secondary flex items-center gap-3 px-8 text-xs font-black uppercase tracking-widest py-3 border-white/10"
                                >
                                    <Edit className="w-4 h-4" />
                                    Modify Data
                                </button>
                            ) : (
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="btn-secondary text-xs uppercase font-black px-6 border-white/10"
                                    >
                                        Abort
                                    </button>
                                    <button 
                                        onClick={handleSave}
                                        className="btn-primary text-xs uppercase font-black px-8"
                                    >
                                        Commit
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {/* Personal Details */}
                            <section className="space-y-8">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] border-b border-white/5 pb-2">Operational Data</h3>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Full Legal Identity</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-[#00F0FF]/50 outline-none transition-all font-medium"
                                                placeholder="Enter full name"
                                            />
                                        ) : (
                                            <p className="text-white font-bold text-lg">{profile.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Neural Link (Email)</label>
                                        <p className="text-gray-400 text-sm font-mono flex items-center gap-2 italic">
                                            <Mail className="w-4 h-4 text-gray-600" />
                                            {profile.email}
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Voice Line (Phone)</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-[#00F0FF]/50 outline-none transition-all font-medium"
                                                placeholder="Enter phone number"
                                            />
                                        ) : (
                                            <p className="text-white/80 font-medium flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-gray-600" />
                                                {profile.phone || 'Not configured'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Base Institution</label>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                value={formData.college}
                                                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-[#00F0FF]/50 outline-none transition-all font-medium"
                                                placeholder="Enter college name"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-3 text-white/80 font-medium">
                                                <Building2 className="w-4 h-4 text-gray-600" />
                                                <span>{profile.college || 'Not configured'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Stats/Status */}
                            <section className="space-y-8">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] border-b border-white/5 pb-2">Mission Statistics</h3>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Calendar className="w-12 h-12" />
                                        </div>
                                        <p className="text-2xl font-black text-[#00F0FF] mb-1">12</p>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Days Remaining</p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Award className="w-12 h-12" />
                                        </div>
                                        <p className="text-2xl font-black text-[#7000FF] mb-1">08</p>
                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Registrations</p>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-[#39FF14]/5 border border-[#39FF14]/10 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#39FF14]/10 flex items-center justify-center text-[#39FF14]">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-tight">System Status: Nominal</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">All security clearances active</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-12 text-center text-[9px] font-black text-gray-800 uppercase tracking-[0.5em] pointer-events-none">
                    ENIGMA_SECURE_ENCRYPTED_SESSION_v4.2.0
                </div>
            </main>
        </div>
    );
}
