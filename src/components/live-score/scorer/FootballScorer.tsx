'use client';

import { useState } from 'react';
import { updateMatchScore } from '@/app/(dashboard)/coordinator/live/actions';

export default function FootballScorer({ matchId, initialData }: { matchId: string, initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  const addGoal = async (team: 'HOME' | 'AWAY') => {
    setIsUpdating(true);
    const newData = { ...data };
    
    if (team === 'HOME') {
      newData.homeScore = (newData.homeScore || 0) + 1;
    } else {
      newData.awayScore = (newData.awayScore || 0) + 1;
    }

    // Add event to timeline
    newData.events = [...(newData.events || []), {
      minute: data.matchClock?.split(':')[0] || '0',
      type: 'GOAL',
      team,
      player: 'Player Name' // In a full app, this would open a modal to select the player
    }];

    setData(newData);
    await updateMatchScore(matchId, newData, `${team}_GOAL`);
    setIsUpdating(false);
  };

  const addCard = async (team: 'HOME' | 'AWAY', type: 'YELLOW_CARD' | 'RED_CARD') => {
    setIsUpdating(true);
    const newData = { ...data };
    
    newData.events = [...(newData.events || []), {
      minute: data.matchClock?.split(':')[0] || '0',
      type,
      team,
      player: 'Player Name'
    }];

    setData(newData);
    await updateMatchScore(matchId, newData, `${team}_${type}`);
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col gap-8">
      
      {/* Clock Controls */}
      <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-200">
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase">Match Clock</h3>
          <input 
            type="text" 
            value={data.matchClock || '00:00'} 
            onChange={(e) => setData({...data, matchClock: e.target.value})}
            className="text-3xl font-black bg-transparent outline-none w-32"
          />
        </div>
        <button 
          onClick={() => updateMatchScore(matchId, data, 'UPDATE_CLOCK')}
          className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg"
        >
          Sync Clock
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        
        {/* HOME CONTROLS */}
        <div className="flex flex-col gap-4 p-4 border border-blue-500/20 bg-blue-500/5 rounded-2xl">
          <h2 className="text-xl font-black text-blue-600 uppercase">Home ({data.homeScore || 0})</h2>
          
          <button onClick={() => addGoal('HOME')} disabled={isUpdating} className="py-3 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700">
            +1 GOAL
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => addCard('HOME', 'YELLOW_CARD')} disabled={isUpdating} className="py-3 bg-yellow-400 text-yellow-900 rounded-xl font-bold">
              YELLOW
            </button>
            <button onClick={() => addCard('HOME', 'RED_CARD')} disabled={isUpdating} className="py-3 bg-red-500 text-white rounded-xl font-bold">
              RED
            </button>
          </div>
        </div>

        {/* AWAY CONTROLS */}
        <div className="flex flex-col gap-4 p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl">
          <h2 className="text-xl font-black text-rose-600 uppercase">Away ({data.awayScore || 0})</h2>
          
          <button onClick={() => addGoal('AWAY')} disabled={isUpdating} className="py-3 bg-rose-600 text-white rounded-xl font-bold text-lg hover:bg-rose-700">
            +1 GOAL
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => addCard('AWAY', 'YELLOW_CARD')} disabled={isUpdating} className="py-3 bg-yellow-400 text-yellow-900 rounded-xl font-bold">
              YELLOW
            </button>
            <button onClick={() => addCard('AWAY', 'RED_CARD')} disabled={isUpdating} className="py-3 bg-red-500 text-white rounded-xl font-bold">
              RED
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
