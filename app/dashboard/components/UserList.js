'use client';

import { useState } from 'react';
import { deleteUser } from '@/app/actions/admin';
import LogisticsModal from './LogisticsModal';
import ConfirmModal from './ConfirmModal';
import { toast } from 'sonner';
import { Users, Filter, Trash2, MapPin, Search, ChevronRight, UserCircle } from 'lucide-react';

export default function UserList({ initialUsers, currentUserRole }) {
    const [users, setUsers] = useState(initialUsers);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedUserForLogistics, setSelectedUserForLogistics] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    const filteredUsers = users.filter(u => {
        const matchesFilter = filter === 'all' || u.role === filter;
        const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) || 
                             u.email.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    async function handleDelete() {
        if (!userToDelete) return;

        const res = await deleteUser(userToDelete.id);
        if (res.success) {
            setUsers(users.filter(u => u.id !== userToDelete.id));
            toast.success(`User ${userToDelete.fullName} deregistered.`);
            setUserToDelete(null);
        } else {
            toast.error(res.error || 'Operation failed.');
        }
    }

    return (
        <div id="user-management" className="w-full space-y-8 animate-in mt-12 scroll-mt-24">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div>
                   <h2 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
                      <Users className="w-8 h-8 text-[#7000FF]" />
                      Participant Command
                   </h2>
                   <p className="text-gray-500 font-medium mt-2">Manage personnel deployment and logistical status across the festival grid.</p>
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                            type="text"
                            placeholder="Search names or emails..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-xs text-white placeholder:text-gray-600 focus:border-[#00F0FF]/50 outline-none w-64 transition-all"
                        />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex p-1.5 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
                        {['all', 'external', 'student', 'volunteer'].map((r) => (
                            <button
                                key={r}
                                onClick={() => setFilter(r)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    filter === r 
                                    ? 'bg-[#00F0FF] text-black shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {r === 'student' ? 'Uni student' : r}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card-glass p-0 overflow-hidden border-white/5 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Personnel</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Contact Intel</th>
                                <th className="py-6 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Auth Tier</th>
                                <th className="py-6 px-8 text-right text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Operational Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <Filter className="w-12 h-12 text-gray-800 mx-auto mb-4 opacity-50" />
                                        <p className="text-gray-600 font-bold italic">NO MATCHING PERSONNEL DETECTED IN THE SECTOR.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group hover:bg-[#00F0FF]/5 transition-colors">
                                        <td className="py-6 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:border-[#00F0FF]/30 group-hover:text-[#00F0FF] transition-all">
                                                    <UserCircle className="w-6 h-6" />
                                                </div>
                                                <span className="font-bold text-white tracking-tight">{user.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className="text-gray-500 font-mono text-xs">{user.email}</span>
                                        </td>
                                        <td className="py-6 px-4">
                                            <span className={`px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest ${
                                                user.role === 'student' ? 'bg-blue-500/10 text-blue-400' :
                                                user.role === 'volunteer' ? 'bg-[#39FF14]/10 text-[#39FF14]' :
                                                'bg-orange-500/10 text-orange-400'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-6 px-8 text-right">
                                            <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                {(currentUserRole === 'dba' || currentUserRole === 'volunteer') && user.role !== 'volunteer' && (
                                                    <button
                                                        onClick={() => setSelectedUserForLogistics(user)}
                                                        className="p-3 rounded-xl bg-[#7000FF]/10 text-[#7000FF] hover:bg-[#7000FF] hover:text-white transition-all border border-[#7000FF]/20"
                                                        title="Deploy Logistics"
                                                    >
                                                        <MapPin className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {currentUserRole === 'dba' && (
                                                    <button
                                                        onClick={() => setUserToDelete(user)}
                                                        className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                                        title="Revoke Access"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <div className="p-3 text-gray-700">
                                                   <ChevronRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedUserForLogistics && (
                <LogisticsModal
                    user={selectedUserForLogistics}
                    onClose={() => setSelectedUserForLogistics(null)}
                />
            )}

            <ConfirmModal
                isOpen={!!userToDelete}
                title="REVOKE ACCESS?"
                message={`You are about to permanently purge ${userToDelete?.fullName} (ID: ${userToDelete?.id?.slice(0,8)}) from the central registry. All registered mission data will be lost.`}
                onConfirm={handleDelete}
                onCancel={() => setUserToDelete(null)}
                confirmText="PURGE ENTITY"
                variant="danger"
            />
        </div>
    );
}
