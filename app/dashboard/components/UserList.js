'use client';

import { useState } from 'react';
import { deleteUser } from '@/app/actions/admin';
import LogisticsModal from './LogisticsModal';
import ConfirmModal from './ConfirmModal';
import { toast } from 'sonner';
import { Search, MapPin, Trash2, ShieldAlert } from 'lucide-react';

export default function UserList({ initialUsers, currentUserRole }) {
    const [users, setUsers] = useState(initialUsers);
    const [filter, setFilter] = useState('all');
    const [selectedUserForLogistics, setSelectedUserForLogistics] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const filteredUsers = users.filter(u => {
        if (filter === 'all') return true;
        return u.role === filter;
    });

    async function handleDelete() {
        if (!userToDelete) return;

        const res = await deleteUser(userToDelete.id);
        if (res.success) {
            setUsers(users.filter(u => u.id !== userToDelete.id));
            toast.success(`User ${userToDelete.fullName} removed successfully.`);
            setUserToDelete(null);
        } else {
            toast.error(res.error || 'Failed to delete user.');
        }
    }

    return (
        <div className="bg-transparent border border-white/5 rounded-3xl p-6 shadow-2xl backdrop-blur-3xl scroll-mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                <div className="flex items-center gap-4">
                    <ShieldAlert className="w-8 h-8 text-[#00F0FF]" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                        Participants <span className="text-[#00F0FF] opacity-70">({users.length})</span>
                    </h2>
                </div>

                <div className="flex bg-[#111] border border-white/5 p-1.5 rounded-full flex-wrap justify-center md:justify-start gap-1">
                    {['all', 'external', 'student', 'volunteer', 'organizer'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setFilter(r)}
                            className={`px-5 py-2 rounded-full text-xs font-black transition-all capitalize tracking-widest ${filter === r ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                        >
                            {r === 'student' ? 'Internal' : r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0a0a0a]/50">
                <table className="w-full text-left">
                    <thead className="bg-black/40">
                        <tr className="border-b border-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <th className="py-5 px-6">Identity</th>
                            <th className="py-5 px-6">Clearance Role</th>
                            <th className="py-5 px-6 text-right">
                                {(currentUserRole === 'dba' || currentUserRole === 'volunteer') && "Execute"}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="py-16 text-center text-gray-600 font-bold tracking-widest uppercase text-sm">NO RECORDS FOUND MATCHING CRITERIA.</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-5 px-6">
                                        <p className="font-bold text-white tracking-wide">{user.fullName}</p>
                                        <p className="text-gray-500 text-xs mt-1 font-mono">{user.email}</p>
                                    </td>
                                    <td className="py-5 px-6">
                                        <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center w-fit gap-2 ${
                                            user.role === 'student' ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_10px_rgba(0,240,255,0.1)]' :
                                            user.role === 'volunteer' ? 'bg-[#ff00ff]/10 text-[#ff00ff] border border-[#ff00ff]/30 shadow-[0_0_10px_rgba(255,0,255,0.1)]' :
                                            user.role === 'organizer' ? 'bg-[#ffff00]/10 text-[#ffff00] border border-[#ffff00]/30 shadow-[0_0_10px_rgba(255,255,0,0.1)]' :
                                            'bg-white/5 text-gray-300 border border-white/10'
                                        }`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-5 px-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                            {(currentUserRole === 'dba' || currentUserRole === 'volunteer') && user.role !== 'volunteer' && (
                                                <button
                                                    onClick={() => setSelectedUserForLogistics(user)}
                                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all"
                                                    title="Manage Logistics"
                                                >
                                                    <MapPin className="w-4 h-4" />
                                                </button>
                                            )}
                                            {currentUserRole === 'dba' && (
                                                <button
                                                    onClick={() => setUserToDelete(user)}
                                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all"
                                                    title="Terminate Node"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {selectedUserForLogistics && (
                <LogisticsModal
                    user={selectedUserForLogistics}
                    onClose={() => setSelectedUserForLogistics(null)}
                />
            )}

            <ConfirmModal
                isOpen={!!userToDelete}
                title="Remove Participant?"
                message={`Are you sure you want to delete ${userToDelete?.fullName}? This action cannot be undone and will remove all their registrations.`}
                onConfirm={handleDelete}
                onCancel={() => setUserToDelete(null)}
                confirmText="Yes, Remove User"
                variant="danger"
            />
        </div>
    );
}
