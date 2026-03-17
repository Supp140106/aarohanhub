'use client';

import { X, AlertTriangle, ShieldX, Info, Trash2 } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', variant = 'danger' }) {
    if (!isOpen) return null;

    const variantStyles = {
        danger: {
            bg: 'bg-red-500 hover:bg-red-600 shadow-red-500/20 text-white',
            border: 'border-red-500/20',
            icon: <ShieldX className="w-10 h-10 text-red-500" />,
            accent: 'text-red-500'
        },
        primary: {
            bg: 'bg-[#00F0FF] hover:bg-[#00C2CC] shadow-[#00F0FF]/20 text-black',
            border: 'border-[#00F0FF]/20',
            icon: <Info className="w-10 h-10 text-[#00F0FF]" />,
            accent: 'text-[#00F0FF]'
        },
        purple: {
            bg: 'bg-[#7000FF] hover:bg-[#6000EE] shadow-[#7000FF]/20 text-white',
            border: 'border-[#7000FF]/20',
            icon: <AlertTriangle className="w-10 h-10 text-[#7000FF]" />,
            accent: 'text-[#7000FF]'
        }
    };

    const style = variantStyles[variant] || variantStyles.danger;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[300] p-4 animate-in fade-in duration-500">
            <div className={`card-glass max-w-sm w-full p-0 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] ${style.border}`}>
                {/* Warning Icon area */}
                <div className="pt-12 pb-8 flex justify-center">
                    <div className="w-24 h-24 rounded-3xl bg-black/40 border border-white/5 flex items-center justify-center shadow-inner relative group">
                        <div className="absolute inset-0 bg-current opacity-10 blur-xl animate-pulse"></div>
                        <div className="relative z-10 transition-transform group-hover:scale-110 duration-500">
                           {style.icon}
                        </div>
                    </div>
                </div>

                <div className="px-10 pb-12 text-center">
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase">{title}</h3>
                    <p className="text-gray-500 font-medium mb-10 leading-relaxed text-xs px-2 uppercase tracking-wide">
                        {message}
                    </p>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={onConfirm}
                            className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg ${style.bg}`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-5 rounded-2xl bg-white/5 text-gray-600 font-black uppercase text-[10px] tracking-[0.3em] hover:text-white hover:bg-white/10 transition-all"
                        >
                            ABORT MISSION
                        </button>
                    </div>
                </div>

                {/* Bottom decorative bar */}
                <div className={`h-1.5 w-full bg-current opacity-20 ${style.accent}`}></div>
            </div>
        </div>
    );
}
