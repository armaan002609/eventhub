'use client';

import { useState } from 'react';
import { registerParticipant } from './actions';

export default function RegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await registerParticipant(formData);
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

        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#554093]">University / College Name</label>
          <input name="universityName" required type="text" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)]" placeholder="e.g. State Tech University" />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#554093]">Student ID Proof (Image or PDF)</label>
          <input name="idProof" required type="file" accept="image/*,.pdf" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-[13px] font-medium text-[#554093] focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#554093]/5 file:text-[#554093] hover:file:bg-[#554093]/10" />
          <p className="text-[11px] text-[#554093]/60 font-medium">Please upload a valid college ID card.</p>
        </div>

        <hr className="border-[#554093]/10 my-6" />
        <h3 className="text-[15px] font-bold text-[#554093] mb-4">Additional Requirements</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="flex items-center gap-3 p-4 border border-[#554093]/10 bg-white rounded-xl cursor-pointer hover:bg-[#554093]/5 transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)]">
            <input type="checkbox" name="needsTransport" value="true" className="w-5 h-5 text-[#554093] rounded border-[#554093]/20 focus:ring-[#554093]" />
            <span className="text-[13px] font-bold text-[#554093]">Transport</span>
          </label>
          <label className="flex items-center gap-3 p-4 border border-[#554093]/10 bg-white rounded-xl cursor-pointer hover:bg-[#554093]/5 transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)]">
            <input type="checkbox" name="needsAccommodation" value="true" className="w-5 h-5 text-[#554093] rounded border-[#554093]/20 focus:ring-[#554093]" />
            <span className="text-[13px] font-bold text-[#554093]">Accommodation</span>
          </label>
          <label className="flex items-center gap-3 p-4 border border-[#554093]/10 bg-white rounded-xl cursor-pointer hover:bg-[#554093]/5 transition-colors shadow-[0_2px_8px_rgba(85,64,147,0.04)]">
            <input type="checkbox" name="needsFood" value="true" className="w-5 h-5 text-[#554093] rounded border-[#554093]/20 focus:ring-[#554093]" />
            <span className="text-[13px] font-bold text-[#554093]">Food / Meals</span>
          </label>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-[#554093] hover:bg-[#3B2C66] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-[0_2px_8px_rgba(85,64,147,0.2)] transition-all mt-8">
          {loading ? 'Submitting Registration...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  );
}
