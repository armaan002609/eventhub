'use client';

import { useState } from 'react';
import { updateMatchScore } from '@/app/(dashboard)/coordinator/live/actions';

export default function CanoeingScorer({ matchId, initialData }: { matchId: string, initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  const racers = data.racers || [];

  const updateRacer = async (idx: number, field: string, value: any) => {
    const newData = { ...data };
    if (!newData.racers) newData.racers = [];
    
    newData.racers[idx] = { ...newData.racers[idx], [field]: value };
    setData(newData);
  };

  const removeRacer = (idx: number) => {
    const newData = { ...data };
    newData.racers = newData.racers.filter((_: any, i: number) => i !== idx);
    setData(newData);
  };

  const autoRank = () => {
    const newData = { ...data };
    if (!newData.racers) return;

    const sorted = [...newData.racers].sort((a, b) => {
      if (!a.splitTime && !b.splitTime) return 0;
      if (!a.splitTime) return 1;
      if (!b.splitTime) return -1;
      return a.splitTime.localeCompare(b.splitTime);
    });

    newData.racers = newData.racers.map((racer: any) => {
      const rank = sorted.findIndex(r => r === racer) + 1;
      return { ...racer, position: rank };
    });

    setData(newData);
  };

  const saveChanges = async () => {
    setIsUpdating(true);
    await updateMatchScore(matchId, data, 'UPDATE_LANES');
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-700">Lane Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={autoRank}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-200 transition-colors"
          >
            Auto-Rank by Time
          </button>
          <button 
            onClick={saveChanges}
            disabled={isUpdating}
            className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 disabled:opacity-50"
          >
            {isUpdating ? 'Broadcasting...' : 'Broadcast Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {racers.map((racer: any, idx: number) => (
          <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-12 gap-4 items-center">
            
            <div className="col-span-1">
              <span className="text-xs font-bold text-gray-400">LANE</span>
              <input 
                type="number" 
                value={racer.lane || ''} 
                onChange={(e) => updateRacer(idx, 'lane', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border rounded bg-white font-black text-lg"
              />
            </div>

            <div className="col-span-3">
              <span className="text-xs font-bold text-gray-400">NAME</span>
              <input 
                type="text" 
                value={racer.name || ''} 
                onChange={(e) => updateRacer(idx, 'name', e.target.value)}
                className="w-full px-2 py-1 border rounded bg-white font-semibold"
                placeholder="Name"
              />
            </div>

            <div className="col-span-2">
              <span className="text-xs font-bold text-gray-400">NAT (Country)</span>
              <input 
                type="text" 
                value={racer.country || ''} 
                onChange={(e) => updateRacer(idx, 'country', e.target.value)}
                className="w-full px-2 py-1 border rounded bg-white font-semibold uppercase"
                placeholder="e.g. USA"
                maxLength={3}
              />
            </div>
            <div className="col-span-2">
              <span className="text-xs font-bold text-gray-400">TIME</span>
              <input 
                type="text" 
                value={racer.splitTime || ''} 
                onChange={(e) => updateRacer(idx, 'splitTime', e.target.value)}
                className="w-full px-2 py-1 border rounded bg-white font-black tabular-nums"
                placeholder="00.00s"
              />
            </div>

            <div className="col-span-2">
              <span className="text-xs font-bold text-gray-400">POSITION</span>
              <input 
                type="number" 
                value={racer.position || ''} 
                onChange={(e) => updateRacer(idx, 'position', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border rounded bg-white font-black tabular-nums text-cyan-600"
              />
            </div>

            <div className="col-span-2 flex items-end">
              <button 
                onClick={() => removeRacer(idx)}
                className="w-full py-1.5 border border-rose-200 text-rose-500 rounded bg-white font-bold text-sm hover:bg-rose-50 transition-colors"
              >
                Remove
              </button>
            </div>

          </div>
        ))}

        <button 
          onClick={() => {
            const newData = { ...data };
            if (!newData.racers) newData.racers = [];
            const nextLane = newData.racers.length + 1;
            newData.racers.push({ lane: nextLane, name: '', country: '', splitTime: '', position: nextLane });
            setData(newData);
          }}
          className="py-4 border-2 border-dashed border-[#554093]/30 rounded-xl text-[#554093] font-bold hover:bg-[#554093]/5 transition-colors"
        >
          + Add Racer
        </button>
      </div>

    </div>
  );
}
