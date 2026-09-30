'use client';

import { useState } from 'react';
import { updateIdProofStatus, deleteRegistration } from './actions';

type Registration = {
  id: string;
  studentName: string;
  phone: string;
  university: { name: string };
  hackathon: { title: string };
  teamName: string | null;
  idProofPath: string;
  idProofStatus: string;
};

export default function RegistrationManagement({ registrations }: { registrations: Registration[] }) {
  const [searchTerm, setSearchTerm] = useState('');
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

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this registration?')) return;
    setLoadingId(id);
    try {
      await deleteRegistration(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete registration');
    } finally {
      setLoadingId(null);
    }
  }

  const filteredRegistrations = registrations.filter(reg => 
    reg.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    reg.hackathon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (reg.teamName && reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#554093]">All Registrations</h2>
          <p className="text-sm font-medium text-[#554093]/60 mt-1">View and search through all event and hackathon applications.</p>
        </div>
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#554093]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search participants or events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-[#554093]/5 border border-[#554093]/10 rounded-xl text-sm font-medium text-[#554093] placeholder:text-[#554093]/40 focus:outline-none focus:ring-2 focus:ring-[#554093]/20 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#554093]/10">
        <table className="min-w-full divide-y divide-[#554093]/10">
          <thead className="bg-[#554093]/5">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Participant</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Event</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Team</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">ID Proof</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Status & Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#554093]/10">
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#554093]/60 font-medium text-sm">
                  No registrations found matching your search.
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-[#554093]/5 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-[13px] font-bold text-[#554093]">{reg.studentName}</div>
                    <div className="text-[11px] font-medium text-[#554093]/60">{reg.university?.name || 'Unknown'}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[13px] font-medium text-[#554093]/80">
                    {reg.phone}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[13px] font-bold text-[#554093]">
                    {reg.hackathon?.title}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[13px] font-medium text-[#554093]/80">
                    {reg.teamName || <span className="text-[#554093]/40 italic">Individual</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a 
                      href={reg.idProofPath} 
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#554093] bg-[#554093]/5 border border-[#554093]/10 px-2 py-1 rounded-md hover:bg-[#554093]/10 transition-colors"
                    >
                      View ID
                    </a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        reg.idProofStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                        reg.idProofStatus === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {reg.idProofStatus}
                      </span>
                      
                      {reg.idProofStatus === 'PENDING' && (
                        <div className="flex items-center gap-1">
                          {loadingId === reg.id ? (
                            <span className="text-[10px] font-bold text-[#554093]/40 uppercase">...</span>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleStatus(reg.id, 'VERIFIED')}
                                className="p-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-md transition-colors" 
                                title="Approve"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </button>
                              <button 
                                onClick={() => handleStatus(reg.id, 'REJECTED')}
                                className="p-1.5 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-md transition-colors" 
                                title="Reject"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                      
                      <button 
                        onClick={() => handleDelete(reg.id)}
                        disabled={loadingId === reg.id}
                        className="p-1.5 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-md transition-colors disabled:opacity-50 ml-1" 
                        title="Delete Registration"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
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
