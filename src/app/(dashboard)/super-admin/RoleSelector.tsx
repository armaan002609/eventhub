'use client';

import { useState } from 'react';
import { updateUserRole } from './actions';

export default function RoleSelector({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value as 'SUPER_ADMIN' | 'COORDINATOR' | 'VOLUNTEER' | 'PARTICIPANT';
    setIsUpdating(true);
    try {
      await updateUserRole(userId, newRole);
    } catch (error) {
      console.error(error);
      alert('Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <select 
      value={currentRole}
      onChange={handleChange}
      disabled={isUpdating}
      className="bg-slate-700 border-none text-[12px] font-bold rounded-lg focus:ring-0 cursor-pointer p-2 py-1.5 shadow-sm text-slate-200 disabled:opacity-50"
    >
      <option value="PARTICIPANT">Participant</option>
      <option value="VOLUNTEER">Volunteer</option>
      <option value="COORDINATOR">Coordinator</option>
      <option value="SUPER_ADMIN">Super Admin</option>
    </select>
  );
}
