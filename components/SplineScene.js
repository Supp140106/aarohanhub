'use client';

import { useState, useEffect } from 'react';

export default function SplineScene({ className }) {
    const [SplineObj, setSplineObj] = useState(null);

    useEffect(() => {
        // Load strictly on CSR mount to avoid next/dynamic turbopack streaming buffer errors
        import('@splinetool/react-spline').then((mod) => setSplineObj(() => mod.default));
    }, []);

    if (!SplineObj) {
        return (
            <div className={`flex items-center justify-center text-[#00F0FF]/50 blur-sm animate-pulse ${className}`}>
                Initializing 3D Core...
            </div>
        );
    }

    return (
        <div className={className}>
            <SplineObj scene="https://prod.spline.design/summerevening/scene.splinecode" />
        </div>
    );
}
