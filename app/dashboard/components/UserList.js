'use client';

import { useState } from 'react';
import { deleteUser } from '@/app/actions/admin';
import LogisticsModal from './LogisticsModal';
import ConfirmModal from './ConfirmModal';
import { toast } from 'sonner';

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
        <div id="user-management" className="w-full mt-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 scroll-mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-purple-600 pl-4">User Management Control</h2>

                <div className="flex bg-gray-100 p-1 rounded-xl flex-wrap justify-center md:justify-start">
                    {['all', 'external', 'student', 'volunteer', 'organizer'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setFilter(r)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-black transition capitalize ml-1 mt-1 mb-1 ${filter === r ? 'bg-white text-purple-600 shadow-sm border border-purple-50' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {r === 'student' ? 'Internal Student' : r}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-gray-400 text-sm font-bold uppercase tracking-wider">
                            <th className="pb-4 px-2">Name</th>
                            <th className="pb-4 px-2">Email</th>
                            <th className="pb-4 px-2">Role</th>
                            <th className="pb-4 px-2 text-right">
                                {(currentUserRole === 'dba' || currentUserRole === 'volunteer') && "Actions"}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-gray-500 italic">No users found in this category.</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition">
                                    <td className="py-4 px-2 font-bold text-gray-800">{user.fullName}</td>
                                    <td className="py-4 px-2 text-gray-600">{user.email}</td>
                                    <td className="py-4 px-2 text-sm uppercase">
                                        <span className={`px-2 py-1 rounded-full font-bold text-[10px] ${user.role === 'student' ? 'bg-blue-100 text-blue-600' :
                                            user.role === 'volunteer' ? 'bg-green-100 text-green-600' :
                                                'bg-orange-100 text-orange-600'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-2 text-right">
                                        <div className="flex justify-end gap-3">
                                            {(currentUserRole === 'dba' || currentUserRole === 'volunteer') && user.role !== 'volunteer' && (
                                                <button
                                                    onClick={() => setSelectedUserForLogistics(user)}
                                                    className="text-purple-600 hover:text-purple-800 font-bold text-xs"
                                                >
                                                    Logistics
                                                </button>
                                            )}
                                            {currentUserRole === 'dba' && (
                                                <button
                                                    onClick={() => setUserToDelete(user)}
                                                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                                                >
                                                    Remove
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
