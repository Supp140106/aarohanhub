import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { fetchAllUsers } from '@/app/actions/admin';
import { checkIfWinner } from '@/app/actions/events';
import UserList from './components/UserList';
import Chatbot from './components/Chatbot';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie) {
        redirect('/login');
    }

    const session = JSON.parse(sessionCookie.value);
    console.log(session)
    const users = (session.role === 'dba' || session.role === 'volunteer') ? await fetchAllUsers() : [];
    const isWinner = await checkIfWinner(session.userId);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-24 pb-20 px-4">
            <div className="max-w-4xl w-full text-center">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 mb-8 font-sans">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl font-bold text-blue-600">👋</span>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome, {session.name}!</h1>
                    <p className="text-lg text-gray-500 mb-8 font-medium italic">Logged in as: <span className="text-blue-600 uppercase tracking-wide font-black not-italic">{session.role}</span></p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-left">
                        <Link href="/events" className="group p-6 rounded-xl border-2 border-transparent bg-blue-50 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-lg">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-white text-blue-900 font-sans">Browse Events →</h3>
                            <p className="opacity-80 group-hover:text-blue-100 text-blue-700 font-medium">Discover and register for upcoming competitions and workshops.</p>
                        </Link>

                        {session.role === 'dba' || session.role === 'volunteer' ? (
                            <a href="#user-management" className="group p-6 rounded-xl border-2 border-transparent bg-purple-50 hover:bg-purple-600 hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-lg border-purple-100 border text-left cursor-pointer block">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-white text-purple-900 font-sans">User Management Hub ↓</h3>
                                <p className="opacity-80 group-hover:text-purple-100 text-purple-700 font-medium text-sm">View and manage all festival participants and volunteers below.</p>
                            </a>
                        ) : (
                            <Link href="/logistics" className="group p-6 rounded-xl border-2 border-transparent bg-green-50 hover:bg-green-600 hover:text-white transition-all transform hover:-translate-y-1 hover:shadow-lg">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-white text-green-900 font-sans">Logistics Hub →</h3>
                                <p className="opacity-80 group-hover:text-green-100 text-green-700 font-medium text-sm">Manage your travel and accommodation details.</p>
                            </Link>
                        )}

                        {isWinner && (
                            <Link href="/learn" className="group p-6 rounded-xl border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-400 hover:to-orange-500 hover:text-white hover:border-transparent transition-all transform hover:-translate-y-1 hover:shadow-xl col-span-1 md:col-span-2 shadow-sm text-left relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-300 text-yellow-900 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-sm z-10 group-hover:opacity-0 transition">
                                    🏆 EXCLUSIVE
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-white text-yellow-900 font-sans relative z-10 flex items-center">
                                    <span className="text-2xl mr-2">👑</span> Champion's Learning Hub →
                                </h3>
                                <p className="opacity-80 group-hover:text-yellow-50 text-yellow-800 font-medium text-sm relative z-10">Premium educational resources unlocked exclusively for event winners.</p>
                            </Link>
                        )}
                    </div>

                    <form action={logout}>
                        <button type="submit" className="text-gray-500 hover:text-red-500 font-black transition px-8 py-2.5 rounded-full hover:bg-red-50 border-2 border-transparent hover:border-red-100 uppercase text-xs tracking-widest cursor-pointer">
                            Logout of Aarohan Hub
                        </button>
                    </form>
                </div>

                {(session.role === 'dba' || session.role === 'volunteer') && <UserList initialUsers={users} currentUserRole={session.role} />}
            </div>

            <Chatbot userName={session.name} userRole={session.role} />
        </div>
    );
}
