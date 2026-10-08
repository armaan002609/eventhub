'use client';

import { useState } from 'react';
import { handleInviteAction } from './actions';

export default function TeamInvites({ invites, userId }: { invites: any[], userId: string }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (invites.length === 0) return null;

  async function onAction(teamId: string, action: 'ACCEPT' | 'REJECT') {
    setLoadingId(teamId);
    try {
      await handleInviteAction(teamId, userId, action);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200">
      <h2 className="text-xl font-bold text-amber-900 mb-4">Pending Team Invitations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {invites.map(invite => (
          <div key={invite.id} className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-amber-900">{invite.team.name}</p>
              <p className="text-xs text-amber-700 font-medium">For: {invite.team.hackathon.title}</p>
              <p className="text-xs text-amber-700/70">Invited by: {invite.team.leader.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onAction(invite.teamId, 'ACCEPT')}
                disabled={loadingId === invite.teamId}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition"
              >
                Accept
              </button>
              <button 
                onClick={() => onAction(invite.teamId, 'REJECT')}
                disabled={loadingId === invite.teamId}
                className="bg-rose-100 hover:bg-rose-200 disabled:opacity-50 text-rose-700 text-xs font-bold px-4 py-1.5 rounded-lg transition"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
