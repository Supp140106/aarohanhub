'use client';

export default function DashboardStyles() {
    return (
        <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0, 240, 255, 0.1);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 240, 255, 0.3);
            }

            /* Extra Tech Polish: Selection Color */
            ::selection {
                background: #00F0FF;
                color: black;
            }
        `}</style>
    );
}
