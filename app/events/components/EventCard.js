'use client';

import { useState } from 'react';
import { deleteEvent, registerForEvent, fetchEventRegistrations, setEventWinner } from '@/app/actions/events';
import { toast } from 'sonner';

export default function EventCard({ evt, isAdmin, isStaff, userRole }) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [message, setMessage] = useState('');

    // Admin specific states
    const [showRegistrations, setShowRegistrations] = useState(false);
    const [registrations, setRegistrations] = useState([]);
    const [loadingRegs, setLoadingRegs] = useState(false);
    const [settingWinner, setSettingWinner] = useState(false);

    async function handleRegister() {
        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('eventId', evt.id);

        const res = await registerForEvent(formData);

        if (res?.error) {
            setMessage(res.error);
        } else {
            setMessage('Successfully Registered!');
            setShowConfirm(false);
        }

        setLoading(false);
    }

    async function handleViewRegistrations() {
        if (!showRegistrations && registrations.length === 0) {
            setLoadingRegs(true);
            const data = await fetchEventRegistrations(evt.id);
            setRegistrations(data);
            setLoadingRegs(false);
        }
        setShowRegistrations(!showRegistrations);
    }

    async function handleSetWinner(userId) {
        setSettingWinner(true);
        const formData = new FormData();
        formData.append('eventId', evt.id);
        formData.append('winnerId', userId);

        const res = await setEventWinner(formData);

        if (res?.error) {
            toast.error(res.error);
        } else {
            toast.success('Winner successfully selected! 🎉');
        }
        setSettingWinner(false);
    }

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition relative overflow-hidden ${evt.winner ? 'border-yellow-400 border-2' : 'border-gray-100'}`}>
            {evt.winner && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-yellow-400 to-yellow-300 text-yellow-900 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-xl shadow-sm flex items-center gap-1.5">
                    <span>🏆</span> Current Winner
                </div>
            )}

            <div className="flex justify-between items-start mb-4 mt-2">

                <h2 className="text-2xl font-bold text-gray-800">{evt.title}</h2>
                {isAdmin && (
                    <div>
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded-md font-medium transition cursor-pointer"
                            >
                                Delete
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-red-600 font-bold italic">Confirm?</span>
                                <form action={deleteEvent}>
                                    <input type="hidden" name="id" value={evt.id} />
                                    <button type="submit" className="text-xs bg-red-600 text-white px-2 py-1 rounded font-bold hover:bg-red-700">Yes</button>
                                </form>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded font-bold hover:bg-gray-300"
                                >
                                    No
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">{evt.description}</p>

            {evt.winner && (
                <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center shadow-inner text-2xl">
                        👑
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-yellow-800 uppercase tracking-widest mb-0.5">Winner</h4>
                        <p className="text-lg font-black text-gray-900">{evt.winner.name}</p>
                        <p className="text-xs font-medium text-gray-500">{evt.winner.email}</p>
                    </div>
                </div>
            )}

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-4">
                <span className="inline-flex items-center text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full border">
                    📅 {evt.schedule ? new Date(evt.schedule).toLocaleString() : 'TBA'}
                </span>

                {isStaff ? (
                    <button
                        onClick={handleViewRegistrations}
                        className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold py-2 px-4 rounded-lg transition text-sm"
                    >
                        {showRegistrations ? 'Hide Registrations' : 'View Registrations'}
                    </button>
                ) : (
                    <div>
                        {evt.isRegistered ? (
                            <div className="flex items-center space-x-2">
                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm border border-green-200 flex items-center">
                                    <span className="mr-2">✅</span> Registered
                                </span>
                            </div>
                        ) : (!showConfirm && userRole !== 'volunteer') ? (
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition transform hover:-translate-y-0.5 shadow-sm"
                            >
                                Register
                            </button>
                        ) : userRole === 'volunteer' ? (
                            <span className="text-sm text-gray-400 italic font-medium bg-gray-50 px-3 py-1.5 rounded-lg border">
                                Staff Account
                            </span>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600 font-medium">Are you sure?</span>
                                <button
                                    onClick={handleRegister}
                                    disabled={loading}
                                    className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1.5 px-4 rounded-lg transition disabled:opacity-50 text-sm"
                                >
                                    {loading ? '...' : 'Yes, Confirm'}
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1.5 px-4 rounded-lg transition text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Staff Registrations Panel */}
            {isStaff && showRegistrations && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-2">Registered Users ({registrations.length})</h4>
                    {loadingRegs ? (
                        <p className="text-sm text-gray-500">Loading...</p>
                    ) : registrations.length === 0 ? (
                        <p className="text-sm text-gray-500">No one has registered for this event yet.</p>
                    ) : (
                        <ul className="space-y-2 mt-3 max-h-60 overflow-y-auto">
                            {registrations.map(reg => (
                                <li key={reg.id} className="text-sm flex justify-between bg-white p-2 rounded border shadow-sm">
                                    <div>
                                        <p className="font-medium text-gray-800">{reg.fullName}</p>
                                        <p className="text-gray-500 text-xs">{reg.email}</p>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <div className="text-right">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${reg.role === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {reg.role}
                                            </span>
                                            {reg.isVolunteer && <span className="block text-xs text-green-600 mt-1 font-bold">Volunteer</span>}
                                        </div>
                                        {isAdmin && !evt.winner && (
                                            <button
                                                onClick={() => handleSetWinner(reg.id)}
                                                disabled={settingWinner}
                                                className="bg-yellow-100 text-yellow-800 hover:bg-yellow-400 hover:text-yellow-900 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50"
                                            >
                                                👑 Set Winner
                                            </button>
                                        )}
                                        {isAdmin && evt.winner?.id === reg.id && (
                                            <span className="text-yellow-600 font-bold text-sm">🏆 Winner</span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
