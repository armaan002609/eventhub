'use client';

import { useState } from 'react';
import { updateMatchScore } from '@/app/(dashboard)/coordinator/live/actions';

export default function CanoeingScorer({ matchId, initialData }: { matchId: string, initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  const lanes = data.lanes || [];

  const updateLane = async (laneIdx: number, field: string, value: any) => {
    const newData = { ...data };
    if (!newData.lanes) newData.lanes = [];
    
    newData.lanes[laneIdx] = { ...newData.lanes[laneIdx], [field]: value };
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
        <button 
          onClick={saveChanges}
          disabled={isUpdating}
          className="px-6 py-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 disabled:opacity-50"
        >
          {isUpdating ? 'Broadcasting...' : 'Broadcast Changes'}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {lanes.map((lane: any, idx: number) => (
          <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-12 gap-4 items-center">
            
            <div className="col-span-1">
              <span className="text-xs font-bold text-gray-400">LANE</span>
              <div className="font-black text-lg">{lane.lane}</div>
            </div>

            <div className="col-span-3">
              <span className="text-xs font-bold text-gray-400">ATHLETE</span>
              <input 
                type="text" 
                value={lane.name || ''} 
                onChange={(e) => updateLane(idx, 'name', e.target.value)}
                className="w-full px-2 py-1 border rounded bg-white font-semibold"
                placeholder="Name"
              />
            </div>

            <div className="col-span-2">
              <span className="text-xs font-bold text-gray-400">TIME</span>
              <input 
                type="text" 
                value={lane.splitTime || ''} 
                onChange={(e) => updateLane(idx, 'splitTime', e.target.value)}
                className="w-full px-2 py-1 border rounded bg-white font-black tabular-nums"
                placeholder="00.00s"
              />
            </div>

            <div className="col-span-2">
              <span className="text-xs font-bold text-gray-400">RANK</span>
              <input 
                type="number" 
                value={lane.rank || ''} 
                onChange={(e) => updateLane(idx, 'rank', parseInt(e.target.value) || 0)}
                className="w-full px-2 py-1 border rounded bg-white font-black tabular-nums text-cyan-600"
              />
            </div>

            <div className="col-span-3">
              <span className="text-xs font-bold text-gray-400">STATUS</span>
              <select 
                value={lane.status || 'RACING'} 
                onChange={(e) => updateLane(idx, 'status', e.target.value)}
                className="w-full px-2 py-1 border rounded bg-white font-bold text-sm"
              >
                <option value="RACING">RACING</option>
                <option value="FINISHED">FINISHED</option>
                <option value="DNF">DNF</option>
                <option value="DSQ">DSQ</option>
              </select>
            </div>

          </div>
        ))}

        {lanes.length === 0 && (
          <button 
            onClick={() => {
              const newData = { ...data };
              newData.lanes = Array.from({length: 8}).map((_, i) => ({ lane: i+1, name: '', team: '', splitTime: '', gapToLeader: '', rank: 0, status: 'RACING' }));
              setData(newData);
            }}
            className="py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:bg-gray-50 hover:border-gray-400"
          >
            + Generate 8 Lanes
          </button>
        )}
      </div>

    </div>
  );
}
