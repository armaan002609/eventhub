'use client';

import { useState } from 'react';
import { deleteMatch, updateMatchDetails } from '@/app/(dashboard)/coordinator/live/actions';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

export default function MatchActionsMenu({ matchId, initialTitle }: { matchId: string, initialTitle: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this match completely? This cannot be undone.")) {
      setIsLoading(true);
      try {
        await deleteMatch(matchId);
      } catch (e) {
        alert("Failed to delete match.");
        setIsLoading(false);
      }
    }
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      await updateMatchDetails(matchId, title);
      setIsEditing(false);
    } catch (e) {
      alert("Failed to update match.");
    }
    setIsLoading(false);
  };

  if (isEditing) {
    return (
      <div className="absolute top-0 left-0 w-full h-full bg-white/95 backdrop-blur-sm z-10 flex flex-col justify-center items-center p-4 rounded-3xl">
        <input 
          type="text" 
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full bg-[#FDFBF7] border border-[#554093]/20 rounded-xl px-4 py-2 text-sm font-bold text-[#554093] focus:outline-none focus:border-[#554093] mb-3"
          autoFocus
        />
        <div className="flex gap-2 w-full">
          <button 
            onClick={handleEdit}
            disabled={isLoading}
            className="flex-1 bg-[#554093] text-white py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button 
            onClick={() => { setIsEditing(false); setTitle(initialTitle); }}
            disabled={isLoading}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-[#554093]/40 hover:bg-[#554093]/5 hover:text-[#554093] rounded-lg transition-colors"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-8 w-40 bg-white border border-[#554093]/10 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
            <button 
              onClick={() => { setIsEditing(true); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm font-bold text-[#554093] hover:bg-[#554093]/5 flex items-center gap-2"
            >
              <Edit2 size={14} /> Edit Title
            </button>
            <button 
              onClick={() => { handleDelete(); setIsOpen(false); }}
              className="w-full px-4 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
            >
              <Trash2 size={14} /> Delete Match
            </button>
          </div>
        </>
      )}
    </div>
  );
}
