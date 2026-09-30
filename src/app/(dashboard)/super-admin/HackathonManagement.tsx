'use client';

import { useState } from 'react';
import { createHackathon, deleteHackathon } from './actions';

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
};

export default function HackathonManagement({ hackathons }: { hackathons: Hackathon[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);

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
          <h2 className="text-xl font-semibold text-slate-800">Hackathons & Events</h2>
          <p className="text-sm text-slate-500">Manage the events shown on the landing page</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
        >
          {isCreating ? 'Cancel' : 'Create Event'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
              <input name="title" required placeholder="e.g. Global AI Hackathon '26" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organizer</label>
              <input name="organizer" required placeholder="e.g. Tech Innovations Inc." className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input name="location" required placeholder="e.g. Online, Bangalore, IN" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Themes (comma separated)</label>
              <input name="themes" placeholder="e.g. AI/ML, Blockchain, UI/UX" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Starts At</label>
              <input name="startsAt" type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ends At</label>
              <input name="endsAt" type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Landscape Photo (Optional)</label>
              <input name="image" type="file" accept="image/*" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm bg-white" />
              <p className="text-xs text-slate-500 mt-1">Recommended size: 1200x600 pixels (16:9 ratio)</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Prize Text (Optional)</label>
              <input name="prizeText" placeholder="e.g. $50k Prizes" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button disabled={loading} type="submit" className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50">
              {loading ? 'Creating...' : 'Publish Event'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hackathons.map(h => (
          <div key={h.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800 line-clamp-1" title={h.title}>{h.title}</h3>
              <button 
                onClick={async () => await deleteHackathon(h.id)}
                className="text-red-500 hover:bg-red-50 p-1 rounded-md text-xs font-medium"
              >
                Delete
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">{h.organizer}</p>
            <div className="text-xs text-slate-600 flex flex-col gap-1 mt-auto">
              <div>📍 {h.location}</div>
              <div>📅 {new Date(h.startsAt).toLocaleDateString()} - {new Date(h.endsAt).toLocaleDateString()}</div>
              <div>👥 {h.participants} participants</div>
            </div>
          </div>
        ))}
        {hackathons.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            No events published yet. Create one above!
          </div>
        )}
      </div>
    </div>
  );
}
