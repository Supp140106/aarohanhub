import { fetchEvents, addEvent } from '@/app/actions/events';
import { cookies } from 'next/headers';
import Link from 'next/link';
import EventCard from './components/EventCard';

export default async function EventsPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');

    let isStaff = false;
    let isAdmin = false;
    let userRole = null;
    let userId = null;

    if (sessionCookie) {
        const session = JSON.parse(sessionCookie.value);
        isAdmin = session.role === 'dba';
        isStaff = session.role === 'dba' || session.role === 'volunteer';
        userRole = session.role;
        userId = session.userId;
    }

    const eventsList = await fetchEvents(userId);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <Link href="/dashboard" className="text-blue-600 font-medium hover:underline mb-2 inline-block">← Back to Dashboard</Link>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Events Dashboard</h1>
                        <p className="text-gray-500 mt-2 text-lg">Browse & register for the biggest tech festival competitions.</p>
                    </div>
                    {userRole && (
                        <div className="bg-white border rounded-full px-4 py-2 font-semibold text-blue-700 shadow-sm">
                            Role: {userRole}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Events List */}
                    <div className="lg:col-span-2 space-y-6">
                        {eventsList.length === 0 ? (
                            <div className="bg-white p-8 rounded-xl border text-center text-gray-500">
                                No events found. Please check back later.
                            </div>
                        ) : (
                            eventsList.map((evt) => (
                                <EventCard key={evt.id} evt={evt} isAdmin={isAdmin} isStaff={isStaff} userRole={userRole} />
                            ))
                        )}
                    </div>

                    {/* Admin Add Event Form */}
                    {isAdmin && (
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 sticky top-6">
                                <div className="flex items-center space-x-2 mb-6 text-purple-700 font-bold text-lg border-b pb-4">
                                    <span>⚙️</span>
                                    <h3>Admin Controls</h3>
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-4">Add New Event</h4>
                                <form action={addEvent} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input type="text" name="title" required className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Event Name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea name="description" rows="3" className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="Event Details"></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                                        <input type="datetime-local" name="schedule" required className="w-full border rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                                    </div>
                                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2 rounded-lg hover:bg-purple-700 transition">
                                        Create Event
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
