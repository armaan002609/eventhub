'use client';

import { useState } from "react";
import { createMatch } from "@/app/(dashboard)/coordinator/live/actions";

export default function CreateMatchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<'CRICKET' | 'FOOTBALL' | 'BADMINTON' | 'WRESTLING' | 'CANOEING'>('CRICKET');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    setIsSubmitting(true);
    await createMatch(title, sport);
    setIsSubmitting(false);
    setIsOpen(false);
    setTitle('');
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#554093] hover:bg-[#554093]/90 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md"
      >
        + Create Match
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black text-[#554093] mb-6">Create New Match</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-[#554093]/60 mb-2 uppercase tracking-wider">Match Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Finals: Team A vs Team B"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#554093] font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#554093]/60 mb-2 uppercase tracking-wider">Sport</label>
                <select 
                  value={sport}
                  onChange={(e) => setSport(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#554093] font-medium appearance-none"
                >
                  <option value="CRICKET">Cricket</option>
                  <option value="FOOTBALL">Football</option>
                  <option value="BADMINTON">Badminton</option>
                  <option value="WRESTLING">Wrestling</option>
                  <option value="CANOEING">Canoeing</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting || !title}
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#554093] text-white hover:bg-[#554093]/90 transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
