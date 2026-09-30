'use client';

import { useState } from 'react';
import { createDuty, deleteDuty } from '../coordinator/actions';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Duty = {
  id: string;
  title: string;
  venue: string;
  startsAt: Date;
  endsAt: Date;
  assignedTo: {
    id: string;
    name: string;
  };
};

export default function CoordinatorManagement({ coordinators, duties }: { coordinators: User[], duties: Duty[] }) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    try {
      const formData = new FormData(form);
      const res = await createDuty(formData);
      if (res && res.error) {
        alert('Error: ' + res.error);
        return;
      }
      setIsAssigning(false);
      form.reset();
    } catch (err: any) {
      console.error(err);
      alert('Failed to assign duty: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this duty assignment?')) return;
    setDeletingId(id);
    try {
      await deleteDuty(id);
    } catch (err) {
      console.error(err);
      alert('Failed to delete duty');
    } finally {
      setDeletingId(null);
    }
  }
  function handleDownloadCSV() {
    const header = ['Coordinator Name', 'Duty Title', 'Venue', 'Starts At', 'Ends At'];
    const rows = duties.map(d => [
      `"${d.assignedTo.name}"`,
      `"${d.title}"`,
      `"${d.venue}"`,
      `"${new Date(d.startsAt).toLocaleString()}"`,
      `"${new Date(d.endsAt).toLocaleString()}"`
    ]);
    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'coordinator_duties.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col gap-6 h-full w-full">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-xl font-bold text-[#554093]">Coordinator Management</h2>
          <p className="text-sm text-[#554093]/60 font-medium">Assign tasks and view coordinator schedules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadCSV}
            className="px-4 py-2 bg-[#554093]/10 text-[#554093] rounded-lg text-sm font-bold hover:bg-[#554093]/20 transition"
          >
            Download CSV
          </button>
          <button 
            onClick={() => setIsAssigning(!isAssigning)}
            className="px-4 py-2 bg-[#554093] text-white rounded-lg text-sm font-bold hover:bg-[#3B2C66] transition"
          >
            {isAssigning ? 'Cancel' : 'Assign Duty'}
          </button>
        </div>
      </div>

      {isAssigning && (
        <form onSubmit={handleSubmit} className="bg-[#FDFBF7] p-6 rounded-xl border border-[#554093]/10 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Select Coordinator</label>
              <select name="assignedToId" required className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093] bg-white">
                <option value="">-- Choose Coordinator --</option>
                {coordinators.map(v => (
                  <option key={v.id} value={v.id}>{v.name} ({v.email})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Task Title</label>
              <input name="title" required placeholder="e.g. Registration Desk" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Venue</label>
              <input name="venue" required placeholder="e.g. Main Hall" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Description (Optional)</label>
              <input name="description" placeholder="e.g. Help participants with check-in" className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093]" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Starts At</label>
              <input name="startsAt" type="datetime-local" required className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093] bg-white" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#554093] mb-1">Ends At</label>
              <input name="endsAt" type="datetime-local" required className="w-full px-3 py-2 border border-[#554093]/20 rounded-md shadow-[0_2px_8px_rgba(85,64,147,0.04)] focus:outline-none focus:ring-2 focus:ring-[#554093] text-[13px] font-medium text-[#554093] bg-white" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button disabled={loading} type="submit" className="px-5 py-2 bg-[#554093] text-white rounded-lg text-sm font-bold hover:bg-[#3B2C66] transition disabled:opacity-50">
              {loading ? 'Assigning...' : 'Assign Task'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-[#554093]/10">
        <table className="min-w-full divide-y divide-[#554093]/10">
          <thead className="bg-[#554093]/5">
            <tr>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Coordinator</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Task</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Venue</th>
              <th className="px-4 py-3 text-left text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Schedule</th>
              <th className="px-4 py-3 text-right text-[11px] font-bold text-[#554093]/60 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#554093]/10">
            {duties.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#554093]/60 font-medium text-sm">
                  No duties assigned yet.
                </td>
              </tr>
            ) : (
              duties.map((duty) => (
                <tr key={duty.id} className="hover:bg-[#554093]/5 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-[13px] font-bold text-[#554093]">{duty.assignedTo.name}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[13px] font-bold text-[#554093]">
                    {duty.title}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[13px] font-medium text-[#554093]/80">
                    {duty.venue}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-[11px] font-medium text-[#554093]/80">
                      {new Date(duty.startsAt).toLocaleString()} - <br/> {new Date(duty.endsAt).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <button 
                      onClick={() => handleDelete(duty.id)}
                      disabled={deletingId === duty.id}
                      className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition-colors disabled:opacity-50"
                      title="Delete Duty"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
