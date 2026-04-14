'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

export default function SubmitButton({ children, className, loadingText, ...props }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={`flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
            {...props}
        >
            {pending && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
            {pending && loadingText ? loadingText : children}
        </button>
    );
}
