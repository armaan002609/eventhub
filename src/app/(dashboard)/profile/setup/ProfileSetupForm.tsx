'use client';

import { useState } from 'react';
import { updateProfile } from './actions';

export default function ProfileSetupForm({ userId, initialData }: { userId: string, initialData?: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateProfile(userId, formData);
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
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10 space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 text-sm font-semibold rounded-xl border border-rose-100">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-[15px] font-bold text-[#554093]">Account Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Choose a Username *</label>
            <input name="username" required type="text" defaultValue={initialData?.username || ''} pattern="[a-zA-Z0-9_]+" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093]" placeholder="e.g. janesmith_01" title="Only letters, numbers, and underscores are allowed" />
            <p className="text-[11px] text-[#554093]/60 font-medium">This will be used to invite you to teams.</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Phone Number *</label>
            <input name="phone" required type="tel" defaultValue={initialData?.phone || ''} className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093]" placeholder="e.g. +91 9876543210" />
          </div>
        </div>
      </div>

      <hr className="border-[#554093]/10" />

      <div className="space-y-4">
        <h3 className="text-[15px] font-bold text-[#554093]">Personal & Family Info</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Father's Name *</label>
            <input name="fathersName" required type="text" defaultValue={initialData?.fathersName || ''} className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093]" placeholder="e.g. John Doe" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Father's Phone Number *</label>
            <input name="fathersPhone" required type="tel" defaultValue={initialData?.fathersPhone || ''} className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093]" placeholder="e.g. +91 9876543210" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#554093]">Full Residential Address *</label>
          <input name="address" required type="text" defaultValue={initialData?.address || ''} className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093]" placeholder="e.g. 123 Main St, City, State" />
        </div>
      </div>

      <hr className="border-[#554093]/10" />

      <div className="space-y-4">
        <h3 className="text-[15px] font-bold text-[#554093]">Academic Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">University / College Name *</label>
            <input name="universityName" required type="text" defaultValue={initialData?.university?.name || ''} className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093]" placeholder="e.g. State Tech University" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-[#554093]">Roll Number *</label>
            <input name="rollNumber" required type="text" defaultValue={initialData?.rollNumber || ''} className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093]" placeholder="e.g. 21CS001" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#554093]">Department *</label>
          <input name="department" required type="text" defaultValue={initialData?.department || ''} className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors text-[#554093]" placeholder="e.g. Computer Science" />
        </div>
      </div>

      <hr className="border-[#554093]/10" />

      <div className="space-y-4">
        <h3 className="text-[15px] font-bold text-[#554093]">ID Verification</h3>
        <div className="space-y-2">
          <label className="text-[13px] font-bold text-[#554093]">Student ID Proof (Image or PDF) *</label>
          <input name="idProof" required type="file" accept="image/*,.pdf" className="w-full px-4 py-3 bg-white border border-[#554093]/20 rounded-xl text-[13px] font-medium text-[#554093] focus:outline-none focus:ring-2 focus:ring-[#554093] transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#554093]/5 file:text-[#554093] hover:file:bg-[#554093]/10" />
          <p className="text-[11px] text-[#554093]/60 font-medium">Please upload a valid college ID card. Admins will verify this before you can receive an Event Pass.</p>
        </div>
      </div>

      <button disabled={loading} type="submit" className="w-full bg-[#554093] hover:bg-[#3B2C66] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-[0_2px_8px_rgba(85,64,147,0.2)] transition-all mt-4">
        {loading ? 'Saving Profile...' : 'Complete Profile'}
      </button>
    </form>
  );
}
