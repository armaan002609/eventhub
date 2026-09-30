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

type Hackathon = {
  id: string;
  title: string;
};

export default function CommitteeManagement({ committees, hackathons }: { committees: Committee[], hackathons: Hackathon[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterHackathon, setFilterHackathon] = useState(hackathons.length > 0 ? hackathons[0].id : '');

  const filteredCommittees = committees.filter(c => c.hackathonId === filterHackathon);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append('hackathonId', filterHackathon);
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
          <h2 className="text-xl font-semibold text-slate-800">Event Committees</h2>
          <p className="text-sm text-slate-500">Manage the committees & duties for your events</p>
        </div>
        
        <div className="flex items-center gap-4">
          <select 
            value={filterHackathon} 
            onChange={(e) => setFilterHackathon(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          >
            {hackathons.map(h => (
              <option key={h.id} value={h.id}>{h.title}</option>
            ))}
          </select>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            {isCreating ? 'Cancel' : 'Add Committee'}
          </button>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Committee Name</label>
              <input name="committeeName" required placeholder="e.g. Reception Committee" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">In-charge</label>
              <input name="inCharge" required placeholder="e.g. Mr. Smith" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contact Details</label>
              <input name="contactDetails" placeholder="e.g. Mob: 9876543210" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Venue</label>
              <input name="venue" placeholder="e.g. Main Hall" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Responsibility</label>
              <textarea name="responsibility" rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Duty</label>
              <textarea name="duty" rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"></textarea>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
              <input name="remarks" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button disabled={loading} type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Add Committee'}
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-4">
        {filteredCommittees.map(c => (
          <div key={c.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
            {editingId === c.id ? (
              <form onSubmit={(e) => handleUpdate(e, c.id)} className="p-4 bg-slate-50 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Committee Name</label>
                    <input name="committeeName" defaultValue={c.committeeName} required className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">In-charge</label>
                    <input name="inCharge" defaultValue={c.inCharge} required className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Contact Details</label>
                    <input name="contactDetails" defaultValue={c.contactDetails || ''} className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Venue</label>
                    <input name="venue" defaultValue={c.venue || ''} className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Responsibility</label>
                    <textarea name="responsibility" defaultValue={c.responsibility || ''} rows={2} className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Duty</label>
                    <textarea name="duty" defaultValue={c.duty || ''} rows={2} className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-700 mb-1">Remarks</label>
                    <input name="remarks" defaultValue={c.remarks || ''} className="w-full px-3 py-1.5 border border-slate-300 rounded text-sm" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button type="button" onClick={() => setEditingId(null)} className="px-4 py-1.5 text-slate-600 bg-slate-200 rounded text-sm font-medium hover:bg-slate-300">Cancel</button>
                  <button disabled={loading} type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700">Save</button>
                </div>
              </form>
            ) : (
              <div className="p-4 flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800">{c.committeeName}</h3>
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">{c.inCharge}</span>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1 mt-2">
                    {c.responsibility && <p><strong>Resp:</strong> {c.responsibility}</p>}
                    {c.duty && <p><strong>Duty:</strong> {c.duty}</p>}
                    <div className="flex gap-4 text-xs mt-2 text-slate-500">
                      {c.venue && <span>📍 {c.venue}</span>}
                      {c.contactDetails && <span>📞 {c.contactDetails}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <button onClick={() => setEditingId(c.id)} className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-medium">Edit</button>
                  <button onClick={async () => await deleteCommittee(c.id)} className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium">Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredCommittees.length === 0 && (
          <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No committees added for this event yet.
          </div>
        )}
      </div>
    </div>
  );
}
