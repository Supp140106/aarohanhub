'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function LottieWrapper({ animationData, animationUrl, loop = true, autoplay = true, className = '', style = {} }) {
    const [data, setData] = useState(animationData || null);

    useEffect(() => {
        if (animationUrl && !animationData) {
            fetch(animationUrl)
                .then(res => {
                    const contentType = res.headers.get('content-type') || '';
                    if (!res.ok || !contentType.includes('application/json')) {
                        throw new Error(`Invalid response: ${res.status} ${contentType}`);
                    }
                    return res.json();
                })
                .then(json => setData(json))
                .catch(err => console.warn("Lottie load skipped:", err.message));
        }
    }, [animationUrl, animationData]);

    if (!data) return null;
    
    return (
        <div className={className} style={style}>
            <Lottie animationData={data} loop={loop} autoplay={autoplay} />
        </div>
    );
}
