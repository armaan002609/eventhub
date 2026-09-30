'use client';

import { useState } from 'react';
import { createHackathon, deleteHackathon, updateHackathon } from './actions';
import CommitteeManagement from './CommitteeManagement';

type Hackathon = {
  id: string;
  title: string;
  organizer: string;
  location: string;
  themes: string[];
  prizeText: string | null;
  startsAt: Date;
  endsAt: Date;
  participants: number;
  imagePath?: string | null;
  eventType: string;
  baseFee: number;
  transportFee: number;
  accommodationFee: number;
  foodFee: number;
};

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

export default function HackathonManagement({ hackathons, committees = [] }: { hackathons: Hackathon[], committees?: Committee[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeHackathonId, setActiveHackathonId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (editingHackathon) {
        await updateHackathon(editingHackathon.id, formData);
        setEditingHackathon(null);
      } else {
        await createHackathon(formData);
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save event');
    } finally {
      setLoading(false);
    }
  }

  const showForm = isCreating || editingHackathon !== null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#554093]">Hackathons & Events</h2>
          <p className="text-sm text-[#554093]/60 font-medium">Manage the events shown on the landing page</p>
        </div>
        <button 
          onClick={() => {
            if (editingHackathon) {
              setEditingHackathon(null);
            } else {
              setIsCreating(!isCreating);
            }
          }}
          className="px-4 py-2 bg-[#554093] text-white rounded-lg text-sm font-bold hover:bg-[#3B2C66] transition"
        >
          {showForm ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#FDFBF7] p-6 rounded-xl border border-[#554093]/10 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Event Title</label>
              <input name="title" required defaultValue={editingHackathon?.title} placeholder="e.g. Global AI Hackathon '26" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Event Type</label>
              <select name="eventType" required defaultValue={editingHackathon?.eventType || "Event"} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093] bg-white">
                <option value="Event">Event</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Organizer</label>
              <input name="organizer" required defaultValue={editingHackathon?.organizer} placeholder="e.g. Tech Innovations Inc." className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Location</label>
              <input name="location" required defaultValue={editingHackathon?.location} placeholder="e.g. Online, Bangalore, IN" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Themes (comma separated)</label>
              <input name="themes" defaultValue={editingHackathon?.themes.join(', ')} placeholder="e.g. AI/ML, Blockchain, UI/UX" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Starts At</label>
              <input name="startsAt" type="date" required defaultValue={editingHackathon?.startsAt ? new Date(editingHackathon.startsAt).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Ends At</label>
              <input name="endsAt" type="date" required defaultValue={editingHackathon?.endsAt ? new Date(editingHackathon.endsAt).toISOString().split('T')[0] : ''} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Landscape Photo</label>
              {editingHackathon?.imagePath && (
                <div className="mb-2">
                  <p className="text-[11px] font-bold text-[#554093]/70 mb-1">Current Image:</p>
                  <img src={editingHackathon.imagePath} alt="Current" className="h-24 w-auto rounded border border-[#554093]/20" />
                </div>
              )}
              <input name="image" type="file" required={!editingHackathon?.imagePath} accept="image/*" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093] bg-white" />
              <p className="text-[11px] font-bold text-[#554093]/50 mt-1">Recommended size: 1200x600 pixels (16:9 ratio)</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-[#554093] mb-1">College/Event Logo (Optional)</label>
              {/* @ts-ignore */}
              {editingHackathon?.logoPath && (
                <div className="mb-2">
                  <p className="text-[11px] font-bold text-[#554093]/70 mb-1">Current Logo:</p>
                  {/* @ts-ignore */}
                  <img src={editingHackathon.logoPath} alt="Current Logo" className="h-16 w-16 object-cover rounded-full border border-[#554093]/20" />
                </div>
              )}
              <input name="logo" type="file" accept="image/*" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093] bg-white" />
              <p className="text-[11px] font-bold text-[#554093]/50 mt-1">Recommended size: 200x200 pixels (1:1 ratio)</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Prize Text (Optional)</label>
              <input name="prizeText" defaultValue={editingHackathon?.prizeText || ''} placeholder="e.g. $50k Prizes" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            
            {/* Fees section */}
            <div className="md:col-span-2 mt-2 pt-4 border-t border-[#554093]/10">
              <h3 className="text-[14px] font-bold text-[#554093] mb-3">Registration & Service Fees (INR)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#554093]/70 mb-1">Base Event Fee</label>
                  <input name="baseFee" type="number" min="0" required defaultValue={editingHackathon?.baseFee ?? 500} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#554093]/70 mb-1">Transport Fee</label>
                  <input name="transportFee" type="number" min="0" required defaultValue={editingHackathon?.transportFee ?? 350} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#554093]/70 mb-1">Accommodation Fee</label>
                  <input name="accommodationFee" type="number" min="0" required defaultValue={editingHackathon?.accommodationFee ?? 1500} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#554093]/70 mb-1">Food Fee</label>
                  <input name="foodFee" type="number" min="0" required defaultValue={editingHackathon?.foodFee ?? 900} className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button disabled={loading} type="submit" className="px-5 py-2 bg-[#554093] text-white rounded-lg text-sm font-bold hover:bg-[#3B2C66] transition disabled:opacity-50">
              {loading ? 'Saving...' : (editingHackathon ? 'Update Event' : 'Publish Event')}
            </button>
          </div>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hackathons.map(h => (
          <div key={h.id} className="border border-[#554093]/10 rounded-xl bg-white shadow-[0_4px_24px_rgba(85,64,147,0.05)] flex flex-col overflow-hidden">
            {h.imagePath && (
              <div className="h-28 w-full bg-[#554093]/5">
                <img src={h.imagePath} alt={h.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[#554093] line-clamp-1" title={h.title}>{h.title}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingHackathon(h);
                    setIsCreating(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-blue-500 hover:bg-blue-50 p-1 rounded-md text-xs font-bold"
                >
                  Edit
                </button>
                <button 
                  onClick={async () => await deleteHackathon(h.id)}
                  className="text-red-500 hover:bg-red-50 p-1 rounded-md text-xs font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="text-[13px] text-[#554093]/60 mb-3 font-medium">{h.organizer}</p>
            <div className="text-[13px] text-[#554093] flex flex-col gap-1 mt-auto font-medium">
              <div>📍 {h.location}</div>
              <div>📅 {new Date(h.startsAt).toLocaleDateString()} - {new Date(h.endsAt).toLocaleDateString()}</div>
              <div>👥 {h.participants} participants</div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#554093]/10">
              <button 
                onClick={() => setActiveHackathonId(activeHackathonId === h.id ? null : h.id)}
                className="w-full text-center text-[13px] font-bold text-[#554093] hover:text-[#554093]/80 transition-colors"
              >
                {activeHackathonId === h.id ? 'Hide Committees' : 'Manage Committees'}
              </button>
            </div>
            </div>
          </div>
        ))}
        {hackathons.length === 0 && (
          <div className="col-span-full py-12 text-center text-[#554093]/60 bg-[#554093]/5 rounded-xl border border-dashed border-[#554093]/20 font-bold">
            No events published yet. Create one above!
          </div>
        )}
      </div>
      
      {activeHackathonId && (
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(85,64,147,0.05)] border border-[#554093]/10">
          <CommitteeManagement committees={committees} hackathonId={activeHackathonId} />
        </div>
      )}
    </div>
  );
}
