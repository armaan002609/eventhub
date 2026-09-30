'use client';

import { useState } from 'react';
import { updateIdProofStatus } from './actions';

type Registration = {
  id: string;
  studentName: string;
  university: { name: string };
  idProofPath: string;
  idProofStatus: string;
};

export default function VerificationQueue({ registrations }: { registrations: Registration[] }) {
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
    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="px-6 py-6 flex justify-between items-center border-b border-slate-100">
        <div>
          <h2 className="text-[17px] font-bold text-slate-800">Verification Queue</h2>
          <p className="text-[12px] font-medium text-slate-500 mt-0.5">Review and approve uploaded ID proofs.</p>
        </div>
        <span className="bg-amber-50 border border-amber-200/60 text-amber-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
          {registrations.length} Pending
        </span>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-[#F8F9FA] sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">Participant</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">College</th>
              <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">ID Proof</th>
              <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                  Queue is empty! All ID proofs are verified.
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[14px] font-bold text-slate-800">{reg.studentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-slate-600">
                    {reg.university?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={reg.idProofPath} 
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Image
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    {loadingId === reg.id ? (
                      <span className="text-[12px] font-bold text-slate-400">Updating...</span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleStatus(reg.id, 'VERIFIED')}
                          className="p-2 text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-lg transition-colors shadow-sm" 
                          title="Approve"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </button>
                        <button 
                          onClick={() => handleStatus(reg.id, 'REJECTED')}
                          className="p-2 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-lg transition-colors shadow-sm" 
                          title="Reject"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
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
