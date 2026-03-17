'use client';

import { useState, useEffect } from 'react';
import { getLogistics, updateLogistics } from '@/app/actions/logistics';
import { toast } from 'sonner';
import { X, MapPin, Coffee, Shield, Save, Truck, Info } from 'lucide-react';

export default function LogisticsModal({ user, onClose }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [details, setDetails] = useState({
        accommodationDetails: '',
        foodCouponProvided: false
    });

    useEffect(() => {
        async function fetchDetails() {
            const res = await getLogistics(user.id);
            if (res.success && res.data) {
                setDetails({
                    accommodationDetails: res.data.accommodationDetails || '',
                    foodCouponProvided: res.data.foodCouponProvided || false
                });
            }
            setLoading(false);
        }
        fetchDetails();
    }, [user.id]);

    async function handleSave() {
        setSaving(true);
        const res = await updateLogistics(user.id, details);
        setSaving(false);
        if (res.success) {
            toast.success('Logistics intel updated.');
            onClose();
        } else {
            toast.error(res.error || 'Sync failed.');
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[200] p-4 animate-in fade-in duration-300">
            <div className="card-glass max-w-lg w-full p-0 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)] border-white/10">
                {/* Header */}
                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-[#7000FF]/10 to-transparent">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-[#7000FF] shadow-inner">
                                <Truck className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">DEPLOYMENT <span className="gradient-text">INTEL</span></h2>
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                                    <Info className="w-3 h-3 text-[#00F0FF]" />
                                    UPDATING STATUS FOR: {user.fullName}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-3 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center space-y-6">
                        <div className="w-12 h-12 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(0,240,255,0.2)]"></div>
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Synchronizing Data Pulse...</p>
                    </div>
                ) : (
                    <div className="p-8 space-y-10 animate-in slide-in-from-bottom-2 duration-500">
                        {/* Accommodation */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-[#7000FF]" />
                                Base Camp Assignment
                            </label>
                            <textarea
                                value={details.accommodationDetails}
                                onChange={(e) => setDetails({ ...details, accommodationDetails: e.target.value })}
                                className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 focus:border-[#00F0FF]/50 focus:ring-0 transition-all min-h-[140px] text-xs font-mono text-gray-300 placeholder:text-gray-700 outline-none"
                                placeholder="Enter coordinates, sector details, or mission directives..."
                            />
                        </div>

                        {/* Sustenance Toggle */}
                        <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between ${details.foodCouponProvided ? 'bg-[#39FF14]/5 border-[#39FF14]/20' : 'bg-white/5 border-white/10'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${details.foodCouponProvided ? 'border-[#39FF14]/30 bg-[#39FF14]/10 text-[#39FF14]' : 'border-white/10 bg-white/5 text-gray-700'}`}>
                                    <Coffee className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`text-sm font-black uppercase tracking-tight ${details.foodCouponProvided ? 'text-[#39FF14]' : 'text-gray-400'}`}>
                                        Sustenance Passes
                                    </p>
                                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-none mt-1">Operational fuel vouchers</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDetails({ ...details, foodCouponProvided: !details.foodCouponProvided })}
                                className={`relative inline-flex h-8 w-14 items-center rounded-xl transition-all outline-none border ${details.foodCouponProvided ? 'bg-[#39FF14] border-black/20 shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'bg-black/60 border-white/10'}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-lg transition-transform duration-300 shadow-md ${details.foodCouponProvided ? 'translate-x-7 bg-white' : 'translate-x-1.5 bg-gray-600'}`} />
                            </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-5 rounded-xl border border-white/10 text-gray-500 font-black uppercase text-xs tracking-widest hover:text-white hover:bg-white/5 transition-all"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-5 rounded-xl bg-[#00F0FF] text-black font-black uppercase text-xs tracking-widest hover:bg-[#00C2CC] shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-30 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'UPLOADING...' : 'COMMIT INTEL'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
