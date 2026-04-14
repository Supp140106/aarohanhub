'use client';

import { Loader2 } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', variant = 'danger', loading = false }) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: 'bg-red-600 hover:bg-red-700 shadow-red-100',
        primary: 'bg-blue-600 hover:bg-blue-700 shadow-blue-100',
        purple: 'bg-purple-600 hover:bg-purple-700 shadow-purple-100'
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 transform transition-all animate-in zoom-in-95 duration-200">
                <div className="text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${variant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'}`}>
                        {variant === 'danger' ? (
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        ) : (
                            <span className="text-4xl">⚠️</span>
                        )}
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-500 font-medium mb-8 leading-relaxed px-2">
                        {message}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className={`w-full py-4 flex items-center justify-center gap-2 rounded-2xl text-white font-black uppercase text-xs tracking-widest transition-all shadow-xl disabled:opacity-50 ${variantStyles[variant]}`}
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
                            {confirmText}
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-4 rounded- link text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:text-gray-900 transition-colors"
                        >
                            Cancel & Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
