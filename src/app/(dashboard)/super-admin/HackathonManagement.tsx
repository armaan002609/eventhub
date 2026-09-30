'use client';

import { useState } from 'react';
import { createHackathon, deleteHackathon } from './actions';
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
  isPublished: boolean;
  imagePath?: string | null;
  eventType: string;
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
  const [loading, setLoading] = useState(false);
  const [activeHackathonId, setActiveHackathonId] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createHackathon(formData);
      setIsCreating(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create hackathon');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-[#554093]">Hackathons & Events</h2>
          <p className="text-sm text-[#554093]/60 font-medium">Manage the events shown on the landing page</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-[#554093] text-white rounded-lg text-sm font-bold hover:bg-[#3B2C66] transition"
        >
          {isCreating ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-[#FDFBF7] p-6 rounded-xl border border-[#554093]/10 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Event Title</label>
              <input name="title" required placeholder="e.g. Global AI Hackathon '26" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Event Type</label>
              <select name="eventType" required className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093] bg-white">
                <option value="Event">Event</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Organizer</label>
              <input name="organizer" required placeholder="e.g. Tech Innovations Inc." className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Location</label>
              <input name="location" required placeholder="e.g. Online, Bangalore, IN" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Themes (comma separated)</label>
              <input name="themes" placeholder="e.g. AI/ML, Blockchain, UI/UX" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Starts At</label>
              <input name="startsAt" type="date" required className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Ends At</label>
              <input name="endsAt" type="date" required className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Landscape Photo</label>
              <input name="image" type="file" required accept="image/*" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093] bg-white" />
              <p className="text-[11px] font-bold text-[#554093]/50 mt-1">Recommended size: 1200x600 pixels (16:9 ratio)</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Prize Text (Optional)</label>
              <input name="prizeText" placeholder="e.g. $50k Prizes" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button disabled={loading} type="submit" className="px-5 py-2 bg-[#554093] text-white rounded-lg text-sm font-bold hover:bg-[#3B2C66] transition disabled:opacity-50">
              {loading ? 'Creating...' : 'Publish Event'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hackathons.map(h => (
          <div key={h.id} className="border border-[#554093]/10 rounded-xl p-4 bg-white shadow-[0_4px_24px_rgba(85,64,147,0.05)] flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-[#554093] line-clamp-1" title={h.title}>{h.title}</h3>
              <button 
                onClick={async () => await deleteHackathon(h.id)}
                className="text-red-500 hover:bg-red-50 p-1 rounded-md text-xs font-bold"
              >
                Delete
              </button>
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
