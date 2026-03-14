'use client';

import { useState, useEffect } from 'react';
import { getLogistics, updateLogistics } from '@/app/actions/logistics';
import { toast } from 'sonner';

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
            toast.success('Logistics updated successfully!');
            onClose();
        } else {
            toast.error(res.error || 'Failed to update logistics.');
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                        Manage Logistics<br />
                        <span className="text-sm font-medium text-purple-600">for {user.fullName}</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-4">
                        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Fetching details...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Accommodation Details</label>
                            <textarea
                                value={details.accommodationDetails}
                                onChange={(e) => setDetails({ ...details, accommodationDetails: e.target.value })}
                                className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-purple-500 focus:ring-0 transition-all min-h-[120px] text-gray-700 bg-gray-50"
                                placeholder="Enter hotel name, room number, or special instructions..."
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-2 border-purple-100">
                            <div>
                                <p className="font-bold text-purple-900">Food Coupon Status</p>
                                <p className="text-xs text-purple-700">Toggle if coupons are provided</p>
                            </div>
                            <button
                                onClick={() => setDetails({ ...details, foodCouponProvided: !details.foodCouponProvided })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${details.foodCouponProvided ? 'bg-purple-600' : 'bg-gray-300'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${details.foodCouponProvided ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3.5 px-6 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 transition-all uppercase text-xs tracking-widest"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 py-3.5 px-6 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 uppercase text-xs tracking-widest disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Logistics'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
