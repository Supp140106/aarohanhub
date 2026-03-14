import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getLogistics } from '@/app/actions/logistics';
import Link from 'next/link';

export default async function LogisticsPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        redirect('/login');
    }

    const session = JSON.parse(sessionCookie.value);
    const res = await getLogistics(session.userId);
    const logistics = res.success ? res.data : null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-24 pb-20 px-4">
            <div className="max-w-2xl w-full">
                <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-purple-600 font-bold text-xs uppercase tracking-widest mb-8 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Link>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-purple-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -m-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        <h1 className="text-3xl font-black mb-1">Your Logistics Hub</h1>
                        <p className="opacity-80 font-medium">Travel & Accommodation Details</p>
                    </div>

                    <div className="p-8 space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Accommodation Details</h3>
                            <div className="p-6 bg-gray-50 rounded-2xl border-2 border-gray-100">
                                {logistics?.accommodationDetails ? (
                                    <p className="text-gray-800 font-medium leading-relaxed whitespace-pre-wrap">
                                        {logistics.accommodationDetails}
                                    </p>
                                ) : (
                                    <div className="flex items-center text-gray-400 italic">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Your accommodation hasn't been assigned yet. Please check back later or contact a volunteer.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Food Coupons</h3>
                            <div className={`p-6 rounded-2xl flex items-center justify-between border-2 transition-all ${logistics?.foodCouponProvided ? 'bg-green-50 border-green-100' : 'bg-orange-50 border-orange-100'}`}>
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${logistics?.foodCouponProvided ? 'bg-green-200 text-green-700' : 'bg-orange-200 text-orange-700'}`}>
                                        <span className="text-xl">{logistics?.foodCouponProvided ? '🍕' : '⏳'}</span>
                                    </div>
                                    <div>
                                        <p className={`font-bold ${logistics?.foodCouponProvided ? 'text-green-900' : 'text-orange-900'}`}>
                                            {logistics?.foodCouponProvided ? 'Coupons Provided' : 'Pending Issuance'}
                                        </p>
                                        <p className={`text-xs ${logistics?.foodCouponProvided ? 'text-green-700' : 'text-orange-700'}`}>
                                            {logistics?.foodCouponProvided ? 'Collect your tokens from the main desk.' : 'Visit the registration counter to collect.'}
                                        </p>
                                    </div>
                                </div>
                                {logistics?.foodCouponProvided && (
                                    <div className="bg-white px-4 py-2 rounded-full text-[10px] font-black uppercase text-green-600 shadow-sm border border-green-100">
                                        READY
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start gap-4 border border-blue-100">
                            <span className="text-xl">💡</span>
                            <div>
                                <p className="text-sm font-bold text-blue-900 mb-1">Need help?</p>
                                <p className="text-xs text-blue-700 leading-relaxed">If you find any discrepancy in your logistics information, please visit the Help Center at the venue entrance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
