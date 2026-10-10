'use client';

import { useState } from 'react';
import { updateIdProofStatus } from './actions';

type VerificationUser = {
  id: string;
  name: string;
  username?: string | null;
  university: { name: string } | null;
  idProofPath: string | null;
  idProofStatus: string;
};

export default function VerificationQueue({ users }: { users: VerificationUser[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleStatus(id: string, status: 'VERIFIED' | 'REJECTED') {
    setLoadingId(id);
    try {
      await updateIdProofStatus(id, status);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="lg:col-span-2 bg-[#FDFBF7] rounded-3xl shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-6 flex justify-between items-center border-b border-[#554093]/10">
        <div>
          <h2 className="text-[17px] font-bold text-[#554093]">Verification Queue</h2>
          <p className="text-[12px] font-medium text-[#554093]/60 mt-0.5">Review and approve uploaded ID proofs.</p>
        </div>
        <span className="bg-amber-50 border border-amber-200/60 text-amber-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
          {users.length} Pending
        </span>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-[#554093]/10">
          <thead className="bg-[#554093]/5 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Participant</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">College</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">ID Proof</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#554093]/10">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#554093]/60 font-medium">
                  Queue is empty! All ID proofs are verified.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-[#554093]/5 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[14px] font-bold text-[#554093]">@{user.username || user.name.split(' ')[0]}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-[#554093]/60">
                    {user.university?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={user.idProofPath!} 
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#554093] bg-[#554093]/5 border border-[#554093]/10 px-3 py-1.5 rounded-lg hover:bg-[#554093]/10 transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)]"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Image
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {loadingId === user.id ? (
                      <span className="text-[12px] font-bold text-[#554093]/40">Updating...</span>
                    ) : (
                      <div className="flex items-center justify-end gap-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          user.idProofStatus === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {user.idProofStatus}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleStatus(user.id, 'VERIFIED')}
                            className="p-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-md transition-colors shadow-sm" 
                            title="Approve"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </button>
                          {user.idProofStatus !== 'REJECTED' && (
                            <button 
                              onClick={() => handleStatus(user.id, 'REJECTED')}
                              className="p-1.5 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-md transition-colors shadow-sm" 
                              title="Reject"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
