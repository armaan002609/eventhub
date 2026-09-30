'use client';

import { useState } from 'react';
import RoleSelector from './RoleSelector';

type User = {
  id: string;
  email: string;
  role: string;
};

export default function RoleManagement({ initialUsers, currentUserId }: { initialUsers: User[], currentUserId?: string }) {
  const [search, setSearch] = useState('');

  const filteredUsers = initialUsers.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-3xl shadow-xl border border-slate-700 overflow-hidden text-white flex flex-col h-full">
      <div className="px-6 py-6 border-b border-slate-700/50">
        <h2 className="text-[17px] font-bold">Role Management</h2>
        <p className="text-[12px] font-medium text-slate-400 mt-0.5">Assign users to staff roles.</p>
      </div>
      <div className="p-6 flex-1 flex flex-col gap-6">
        <div className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users by email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl px-5 py-3 text-[13px] font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <svg className="w-4 h-4 absolute right-5 top-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">All Users ({filteredUsers.length})</h3>
          {filteredUsers.length === 0 ? (
            <p className="text-slate-500 text-sm">No users found.</p>
          ) : (
            filteredUsers.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <div key={user.id} className="flex items-center justify-between bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
                  <div className="truncate pr-3">
                    <p className="text-[13px] font-bold text-white truncate max-w-[150px] flex items-center gap-2">
                      {user.email}
                      {isSelf && <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5">Current: {user.role}</p>
                  </div>
                  {isSelf ? (
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 cursor-not-allowed">
                      Cannot edit self
                    </span>
                  ) : (
                    <RoleSelector userId={user.id} currentRole={user.role} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
