'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Uni = { id: string; uid: string; name: string };
type Person = { id: string; name: string; email: string; role: string; universityUid?: string | null };
type DutyRow = { id: string; title: string; venue: string; startsAt: string; endsAt: string; assignee: string };

const field = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm';

async function post(url: string, body: unknown) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? 'Request failed');
  return data;
}

export default function DutyAssignmentPanel(props: { universities: Uni[]; candidates: Person[]; coordinators: Person[]; duties: DutyRow[] }) {
  const router = useRouter();
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string }>();
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>, url: string, pick: (f: FormData) => unknown, okText: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true); setMsg(undefined);
    try {
      await post(url, pick(f));
      setMsg({ kind: 'ok', text: okText });
      form.reset();
      router.refresh(); // re-runs the server component, so lists stay authoritative
    } catch (err) {
      setMsg({ kind: 'err', text: err instanceof Error ? err.message : 'Failed' });
    } finally { setBusy(false); }
  }

  const s = (f: FormData, k: string) => String(f.get(k) ?? '');

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {msg && (
        <p role="status" className={`lg:col-span-2 rounded-lg p-3 text-sm ${msg.kind === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>{msg.text}</p>
      )}

      <form onSubmit={(e) => submit(e, '/api/admin/coordinators', (f) => ({ universityUid: s(f, 'universityUid'), userId: s(f, 'userId') }), 'Coordinator assigned')}
            className="space-y-3 rounded-xl border border-slate-200 p-4">
        <h2 className="font-semibold">Assign coordinator to a college</h2>
        <label className="block text-sm">College / University UID
          <select name="universityUid" required className={field} defaultValue="">
            <option value="" disabled>Select UID</option>
            {props.universities.map((u) => <option key={u.id} value={u.uid}>{u.uid} — {u.name}</option>)}
          </select>
        </label>
        <label className="block text-sm">User
          <select name="userId" required className={field} defaultValue="">
            <option value="" disabled>Select user</option>
            {props.candidates.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.email})</option>)}
          </select>
        </label>
        <button disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-60">Assign coordinator</button>
      </form>

      <form onSubmit={(e) => submit(e, '/api/admin/duties', (f) => ({
              title: s(f, 'title'), venue: s(f, 'venue'), description: s(f, 'description') || undefined,
              startsAt: s(f, 'startsAt'), endsAt: s(f, 'endsAt'), assignedToId: s(f, 'assignedToId'),
            }), 'Duty allocated')}
            className="space-y-3 rounded-xl border border-slate-200 p-4">
        <h2 className="font-semibold">Allocate high-level duty</h2>
        <label className="block text-sm">Coordinator
          <select name="assignedToId" required className={field} defaultValue="">
            <option value="" disabled>Select coordinator</option>
            {props.coordinators.map((p) => <option key={p.id} value={p.id}>{p.name}{p.universityUid ? ` · ${p.universityUid}` : ''}</option>)}
          </select>
        </label>
        <label className="block text-sm">Title<input name="title" required minLength={3} maxLength={120} className={field} /></label>
        <label className="block text-sm">Venue<input name="venue" required maxLength={120} className={field} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">Starts<input name="startsAt" type="datetime-local" required className={field} /></label>
          <label className="block text-sm">Ends<input name="endsAt" type="datetime-local" required className={field} /></label>
        </div>
        <label className="block text-sm">Notes<textarea name="description" maxLength={1000} rows={3} className={field} /></label>
        <button disabled={busy} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-60">Allocate duty</button>
      </form>

      <section className="lg:col-span-2">
        <h2 className="mb-2 font-semibold">Allocated duties</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600"><tr><th className="p-3">Duty</th><th className="p-3">Coordinator</th><th className="p-3">Venue</th><th className="p-3">Slot</th></tr></thead>
            <tbody>
              {props.duties.length === 0 && <tr><td colSpan={4} className="p-4 text-slate-500">No duties yet.</td></tr>}
              {props.duties.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3">{d.title}</td><td className="p-3">{d.assignee}</td><td className="p-3">{d.venue}</td>
                  <td className="p-3">{new Date(d.startsAt).toLocaleString()} → {new Date(d.endsAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
