'use client';

import { useState } from 'react';
import { registerParticipant } from '@/app/events/[id]/register/actions';

export default function RegistrationForm({ hackathonId }: { hackathonId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [registrationType, setRegistrationType] = useState<'SOLO' | 'TEAM'>('SOLO');
  
  const [needsTransport, setNeedsTransport] = useState(false);
  const [needsAccommodation, setNeedsAccommodation] = useState(false);
  const [needsFood, setNeedsFood] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.set('registrationType', registrationType);
    
    try {
      const res = await registerParticipant(hackathonId, formData);
      if (res?.error) {
        setError(res.error);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#FDFBF7] rounded-3xl p-8 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 mt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#554093]">Complete Your Registration</h2>
        <p className="text-sm text-[#554093]/60 mt-1 font-medium">Your personal details will be fetched automatically from your profile.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-semibold rounded-xl border border-rose-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Solo vs Team Selection */}
        <div className="flex gap-4 p-1 bg-white border border-[#554093]/10 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => setRegistrationType('SOLO')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${registrationType === 'SOLO' ? 'bg-[#554093] text-white shadow-md' : 'text-[#554093]/60 hover:text-[#554093]'}`}
          >
            Solo Participant
          </button>
          <button 
            type="button"
            onClick={() => setRegistrationType('TEAM')}
            className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${registrationType === 'TEAM' ? 'bg-[#554093] text-white shadow-md' : 'text-[#554093]/60 hover:text-[#554093]'}`}
          >
            Register a Team
          </button>
        </div>

        {registrationType === 'TEAM' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 p-6 bg-[#554093]/5 border border-[#554093]/10 rounded-2xl">
            <h3 className="text-[15px] font-bold text-[#554093]">Team Details</h3>
            
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#554093]">Team Name</label>
              <input name="teamName" required type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093]" placeholder="e.g. Code Ninjas" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-[#554093]">Teammate Usernames (Comma separated)</label>
              <input name="teamUsernames" required type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093]" placeholder="e.g. janesmith01, alex_dev" />
              <p className="text-[11px] text-[#554093]/60 font-medium mt-1">Your teammates must have already created their accounts and completed their profiles. Do not include your own username here.</p>
            </div>
          </div>
        )}

        <hr className="border-[#554093]/10 my-6" />
        <h3 className="text-[15px] font-bold text-[#554093] mb-4">Logistics & Additional Requirements</h3>
        {registrationType === 'TEAM' && (
          <p className="text-xs text-[#554093]/60 mb-4 bg-amber-50 text-amber-800 p-3 rounded-lg font-medium border border-amber-200/50">
            <strong>Note:</strong> As the Team Leader, you are responsible for paying the total combined fees and selecting logistics for your entire team. Please select quantities covering all members.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Transport */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-[#554093]/10 bg-white rounded-xl cursor-pointer hover:bg-[#554093]/5 transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)]">
              <input type="checkbox" name="needsTransport" value="true" checked={needsTransport} onChange={e => setNeedsTransport(e.target.checked)} className="w-5 h-5 text-[#554093] rounded border-[#554093]/20 focus:ring-[#554093]" />
              <span className="text-[13px] font-bold text-[#554093]">Transport</span>
            </label>
            {needsTransport && (
              <div className="animate-in fade-in slide-in-from-top-2 p-1 space-y-2">
                <label className="text-[11px] font-bold text-[#554093]/70 uppercase tracking-wider block">Pickup Point</label>
                <input name="boardingPointName" type="text" placeholder="e.g. City Center" required className="w-full px-3 py-2 bg-white border border-[#554093]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] text-[#554093]" />
                
                {registrationType === 'TEAM' && (
                   <input name="transportCount" type="number" min="1" max="10" placeholder="Qty" required className="w-full px-3 py-2 bg-white border border-[#554093]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] text-[#554093]" />
                )}
              </div>
            )}
          </div>

          {/* Accommodation */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-[#554093]/10 bg-white rounded-xl cursor-pointer hover:bg-[#554093]/5 transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)]">
              <input type="checkbox" name="needsAccommodation" value="true" checked={needsAccommodation} onChange={e => setNeedsAccommodation(e.target.checked)} className="w-5 h-5 text-[#554093] rounded border-[#554093]/20 focus:ring-[#554093]" />
              <span className="text-[13px] font-bold text-[#554093]">Accommodation</span>
            </label>
            {needsAccommodation && (
              <div className="animate-in fade-in slide-in-from-top-2 p-1 space-y-2">
                <label className="text-[11px] font-bold text-[#554093]/70 uppercase tracking-wider block">How many days?</label>
                <input name="accommodationDays" type="number" min="1" max="14" defaultValue="1" required className="w-full px-3 py-2 bg-white border border-[#554093]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] text-[#554093]" />
                
                {registrationType === 'TEAM' && (
                  <>
                   <label className="text-[11px] font-bold text-[#554093]/70 uppercase tracking-wider block mt-2">For how many members?</label>
                   <input name="accommodationCount" type="number" min="1" max="10" defaultValue="1" required className="w-full px-3 py-2 bg-white border border-[#554093]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] text-[#554093]" />
                  </>
                )}
              </div>
            )}
          </div>

          {/* Food */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-[#554093]/10 bg-white rounded-xl cursor-pointer hover:bg-[#554093]/5 transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)]">
              <input type="checkbox" name="needsFood" value="true" checked={needsFood} onChange={e => setNeedsFood(e.target.checked)} className="w-5 h-5 text-[#554093] rounded border-[#554093]/20 focus:ring-[#554093]" />
              <span className="text-[13px] font-bold text-[#554093]">Food / Meals</span>
            </label>
            {needsFood && registrationType === 'TEAM' && (
              <div className="animate-in fade-in slide-in-from-top-2 p-1 space-y-2">
                <label className="text-[11px] font-bold text-[#554093]/70 uppercase tracking-wider block mt-2">For how many members?</label>
                <input name="foodCount" type="number" min="1" max="10" defaultValue="1" required className="w-full px-3 py-2 bg-white border border-[#554093]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] text-[#554093]" />
              </div>
            )}


          </div>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-[#554093] hover:bg-[#3B2C66] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-[0_2px_8px_rgba(85,64,147,0.2)] transition-all mt-8">
          {loading ? 'Submitting Registration...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  );
}
