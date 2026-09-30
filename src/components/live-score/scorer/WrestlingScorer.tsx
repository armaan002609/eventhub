'use client';

import { useState } from 'react';
import { updateMatchScore } from '@/app/(dashboard)/coordinator/live/actions';

export default function WrestlingScorer({ matchId, initialData }: { matchId: string, initialData: any }) {
  const [data, setData] = useState(initialData);
  const [isUpdating, setIsUpdating] = useState(false);

  const addScore = async (color: 'red' | 'blue', points: number) => {
    setIsUpdating(true);
    const newData = { ...data };
    
    if (color === 'red') {
      newData.redScore = (newData.redScore || 0) + points;
    } else {
      newData.blueScore = (newData.blueScore || 0) + points;
    }

    setData(newData);
    await updateMatchScore(matchId, newData, `${color.toUpperCase()}_+${points}`);
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Clock Controls */}
      <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-200">
        <div>
          <h3 className="text-sm font-bold text-gray-500 uppercase">Period Timer</h3>
          <input 
            type="text" 
            value={data.periodTimer || '03:00'} 
            onChange={(e) => setData({...data, periodTimer: e.target.value})}
            className="text-3xl font-black bg-transparent outline-none w-32 text-yellow-600"
          />
        </div>
        <button 
          onClick={() => updateMatchScore(matchId, data, 'UPDATE_CLOCK')}
          className="px-4 py-2 bg-gray-800 text-white font-bold rounded-lg"
        >
          Sync Clock
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        
        {/* RED CORNER */}
        <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-500 flex flex-col gap-4">
          <h2 className="text-2xl font-black text-red-600 uppercase tracking-widest text-center mb-4">{data.redName || 'RED'} ({data.redScore || 0})</h2>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 4, 5].map(pts => (
              <button 
                key={pts}
                onClick={() => addScore('red', pts)}
                disabled={isUpdating}
                className="py-4 bg-red-600 text-white rounded-xl font-black text-xl hover:bg-red-700 disabled:opacity-50"
              >
                +{pts}
              </button>
            ))}
          </div>
        </div>

        {/* BLUE CORNER */}
        <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-500 flex flex-col gap-4">
          <h2 className="text-2xl font-black text-blue-600 uppercase tracking-widest text-center mb-4">{data.blueName || 'BLUE'} ({data.blueScore || 0})</h2>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 4, 5].map(pts => (
              <button 
                key={pts}
                onClick={() => addScore('blue', pts)}
                disabled={isUpdating}
                className="py-4 bg-blue-600 text-white rounded-xl font-black text-xl hover:bg-blue-700 disabled:opacity-50"
              >
                +{pts}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
