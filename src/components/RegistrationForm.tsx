'use client';

import { useState } from 'react';
import { registerParticipant } from '@/app/events/[id]/register/actions';

export default function RegistrationForm({ hackathonId }: { hackathonId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [needsTransport, setNeedsTransport] = useState(false);
  const [needsAccommodation, setNeedsAccommodation] = useState(false);
  const [needsFood, setNeedsFood] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
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
        <p className="text-sm text-[#554093]/60 mt-1 font-medium">Please fill out the details below to complete your registration process.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-sm font-semibold rounded-xl border border-rose-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Full Name</label>
            <input name="studentName" required type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. Jane Doe" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Phone Number</label>
            <input name="phone" required type="tel" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. +91 9876543210" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Father's Name</label>
            <input name="fathersName" required type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. John Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Father's Phone Number</label>
            <input name="fathersPhone" required type="tel" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. +91 9876543210" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">University / College Name</label>
            <input name="universityName" required type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. State Tech University" />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Roll Number</label>
            <input name="rollNumber" required type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. 21CS001" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Department</label>
            <input name="department" required type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. Computer Science" />
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Full Address</label>
            <input name="address" required type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. 123 Main St, City, State" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#554093]">Student ID Proof (Image or PDF)</label>
          <input name="idProof" required type="file" accept="image/*,.pdf" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-[13px] font-medium text-[#554093] focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#554093]/5 file:text-[#554093] hover:file:bg-[#554093]/10" />
          <p className="text-[11px] text-[#554093]/60 font-medium">Please upload a valid college ID card.</p>
        </div>

        <hr className="border-[#554093]/10 my-6" />
        <h3 className="text-[15px] font-bold text-[#554093] mb-4">Team Details (Optional)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Team Name</label>
            <input name="teamName" type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. Code Ninjas" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Team Members (Names)</label>
            <input name="teamMembers" type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. Alice, Bob" />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Total Team Size</label>
            <input name="teamSize" type="number" min="1" defaultValue="1" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" />
          </div>
        </div>

        <hr className="border-[#554093]/10 my-6" />
        <h3 className="text-[15px] font-bold text-[#554093] mb-4">Additional Requirements</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Transport */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-[#554093]/10 bg-white rounded-xl cursor-pointer hover:bg-[#554093]/5 transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)]">
              <input type="checkbox" name="needsTransport" value="true" checked={needsTransport} onChange={e => setNeedsTransport(e.target.checked)} className="w-5 h-5 text-[#554093] rounded border-[#554093]/20 focus:ring-[#554093]" />
              <span className="text-[13px] font-bold text-[#554093]">Transport</span>
            </label>
            {needsTransport && (
              <div className="animate-in fade-in slide-in-from-top-2 p-1">
                <label className="text-[11px] font-bold text-[#554093]/70 uppercase tracking-wider block mb-1">Pickup Point</label>
                <input name="boardingPointName" type="text" placeholder="e.g. City Center Bus Stop" required className="w-full px-3 py-2 bg-white border border-[#554093]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] text-[#554093]" />
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
              <div className="animate-in fade-in slide-in-from-top-2 p-1">
                <label className="text-[11px] font-bold text-[#554093]/70 uppercase tracking-wider block mb-1">How many days?</label>
                <input name="accommodationDays" type="number" min="1" max="14" defaultValue="1" required className="w-full px-3 py-2 bg-white border border-[#554093]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] text-[#554093]" />
              </div>
            )}
          </div>

          {/* Food */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border border-[#554093]/10 bg-white rounded-xl cursor-pointer hover:bg-[#554093]/5 transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)]">
              <input type="checkbox" name="needsFood" value="true" checked={needsFood} onChange={e => setNeedsFood(e.target.checked)} className="w-5 h-5 text-[#554093] rounded border-[#554093]/20 focus:ring-[#554093]" />
              <span className="text-[13px] font-bold text-[#554093]">Food / Meals</span>
            </label>
            {needsFood && (
              <div className="animate-in fade-in slide-in-from-top-2 p-1">
                <label className="text-[11px] font-bold text-[#554093]/70 uppercase tracking-wider block mb-1">Meals per day (Max 4)</label>
                <input name="mealsPerDay" type="number" min="1" max="4" defaultValue="3" required className="w-full px-3 py-2 bg-white border border-[#554093]/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] text-[#554093]" />
                <p className="text-[10px] text-[#554093]/50 mt-1">Breakfast, Lunch, Snacks, Dinner</p>
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
