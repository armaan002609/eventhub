'use client';

import { useState } from 'react';
import { updateMatchStatus } from '@/app/(dashboard)/coordinator/live/actions';

export default function MatchStatusToggle({ matchId, initialStatus }: { matchId: string, initialStatus: 'UPCOMING' | 'LIVE' | 'PAUSED' | 'COMPLETED' }) {
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as any;
    setIsUpdating(true);
    setStatus(newStatus);
    await updateMatchStatus(matchId, newStatus);
    setIsUpdating(false);
  };

  return (
    <select 
      value={status} 
      onChange={handleStatusChange} 
      disabled={isUpdating}
      className={`text-xs font-bold px-4 py-2 rounded-full uppercase outline-none shadow-sm cursor-pointer border ${
        status === 'LIVE' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' : 
        status === 'UPCOMING' ? 'bg-[#554093]/10 text-[#554093] border-[#554093]/20' : 
        status === 'PAUSED' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
        'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
      }`}
    >
      <option value="UPCOMING">UPCOMING</option>
      <option value="LIVE">LIVE (Broadcasting)</option>
      <option value="PAUSED">PAUSED</option>
      <option value="COMPLETED">COMPLETED</option>
    </select>
  );
}
