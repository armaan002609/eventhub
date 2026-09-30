'use client';

import { useState } from 'react';
import { updateCommittee, deleteCommittee, createCommittee } from './actions';

type Committee = {
  id: string;
  hackathonId: string;
  committeeName: string;
  inCharge: string;
  contactDetails: string | null;
  responsibility: string | null;
  duty: string | null;
  venue: string | null;
  remarks: string | null;
};

export default function CommitteeManagement({ committees, hackathonId }: { committees: Committee[], hackathonId: string }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const filteredCommittees = committees.filter(c => c.hackathonId === hackathonId);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append('hackathonId', hackathonId);
      await createCommittee(formData);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create committee');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await updateCommittee(id, formData);
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update committee');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#554093]">Event Committees</h2>
          <p className="text-[13px] text-[#554093]/60 font-medium mt-1">Manage the committees & duties for your events</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-[#554093] text-white rounded-lg text-sm font-bold hover:bg-[#3B2C66] transition"
          >
            {isCreating ? 'Cancel' : 'Add Committee'}
          </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-[#FDFBF7] p-6 rounded-xl border border-[#554093]/10 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Committee Name</label>
              <input name="committeeName" required placeholder="e.g. Reception Committee" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">In-charge</label>
              <input name="inCharge" required placeholder="e.g. Mr. Smith" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Contact Details</label>
              <input name="contactDetails" placeholder="e.g. Mob: 9876543210" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Venue</label>
              <input name="venue" placeholder="e.g. Main Hall" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Responsibility</label>
              <textarea name="responsibility" rows={2} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093]"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Duty</label>
              <textarea name="duty" rows={2} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093]"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Remarks</label>
              <input name="remarks" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093]" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button disabled={loading} type="submit" className="px-5 py-2 bg-[#554093] text-white rounded-lg text-sm font-bold hover:bg-[#3B2C66] transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Add Committee'}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {filteredCommittees.map(c => (
          <div key={c.id} className="border border-[#554093]/10 rounded-xl bg-white shadow-[0_4px_24px_rgba(85,64,147,0.05)] overflow-hidden">
            {editingId === c.id ? (
              <form onSubmit={(e) => handleUpdate(e, c.id)} className="p-4 bg-[#FDFBF7] flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#554093] mb-1 uppercase tracking-wider">Committee Name</label>
                    <input name="committeeName" defaultValue={c.committeeName} required className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] focus:outline-none focus:ring-2 focus:ring-[#554093]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#554093] mb-1 uppercase tracking-wider">In-charge</label>
                    <input name="inCharge" defaultValue={c.inCharge} required className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] focus:outline-none focus:ring-2 focus:ring-[#554093]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#554093] mb-1 uppercase tracking-wider">Contact Details</label>
                    <input name="contactDetails" defaultValue={c.contactDetails || ''} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] focus:outline-none focus:ring-2 focus:ring-[#554093]" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#554093] mb-1 uppercase tracking-wider">Venue</label>
                    <input name="venue" defaultValue={c.venue || ''} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] focus:outline-none focus:ring-2 focus:ring-[#554093]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[#554093] mb-1 uppercase tracking-wider">Responsibility</label>
                    <textarea name="responsibility" defaultValue={c.responsibility || ''} rows={2} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] focus:outline-none focus:ring-2 focus:ring-[#554093]"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[#554093] mb-1 uppercase tracking-wider">Duty</label>
                    <textarea name="duty" defaultValue={c.duty || ''} rows={2} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] focus:outline-none focus:ring-2 focus:ring-[#554093]"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-[#554093] mb-1 uppercase tracking-wider">Remarks</label>
                    <input name="remarks" defaultValue={c.remarks || ''} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md text-[13px] font-medium text-[#554093] focus:outline-none focus:ring-2 focus:ring-[#554093]" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#554093]/10">
                  <button type="button" onClick={() => setEditingId(null)} className="px-4 py-1.5 text-[#554093] bg-[#554093]/5 rounded-lg text-sm font-bold hover:bg-[#554093]/10 transition">Cancel</button>
                  <button disabled={loading} type="submit" className="px-4 py-1.5 bg-[#554093] text-white rounded-lg text-sm font-bold hover:bg-[#3B2C66] transition">Save</button>
                </div>
              </form>
            ) : (
              <div className="p-4 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#554093] text-[15px]">{c.committeeName}</h3>
                    <span className="px-2 py-0.5 bg-[#554093]/10 text-[#554093] rounded-full text-[11px] font-bold tracking-wider uppercase">{c.inCharge}</span>
                  </div>
                  <div className="text-[13px] text-[#554093]/80 space-y-1 mt-2 font-medium">
                    {c.responsibility && <p><strong className="text-[#554093]">Resp:</strong> {c.responsibility}</p>}
                    {c.duty && <p><strong className="text-[#554093]">Duty:</strong> {c.duty}</p>}
                    <div className="flex gap-4 text-[12px] mt-3 text-[#554093]/60 font-bold border-t border-[#554093]/10 pt-2">
                      {c.venue && <span>📍 {c.venue}</span>}
                      {c.contactDetails && <span>📞 {c.contactDetails}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <button onClick={() => setEditingId(c.id)} className="px-3 py-1 bg-[#554093]/5 text-[#554093] hover:bg-[#554093]/10 rounded text-[11px] font-bold uppercase tracking-wider transition">Edit</button>
                  <button onClick={async () => await deleteCommittee(c.id)} className="px-3 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded text-[11px] font-bold uppercase tracking-wider transition">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredCommittees.length === 0 && (
          <div className="py-12 text-center text-[#554093]/60 bg-[#554093]/5 rounded-xl border border-dashed border-[#554093]/20 font-bold">
            No committees added for this event yet.
          </div>
        )}
      </div>
    </div>
  );
}
