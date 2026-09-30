'use client';

import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, ID_PROOF_RULES, type RegistrationInput } from '@/lib/validation';
import { calcFees, RATES } from '@/lib/pricing';
import { supabaseBrowser } from '@/lib/supabase-browser';

type Props = {
  universities: { id: string; name: string }[];
  boardingPoints: { id: string; name: string; charge: number }[];
};

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const input = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
const label = 'mb-1 block text-sm font-medium text-slate-700';

function Err({ msg }: { msg?: string }) {
  return msg ? <p role="alert" className="mt-1 text-xs text-red-600">{msg}</p> : null;
}

function YesNo({ name, setValue, value, legend }: { name: string; legend: string; value: boolean; setValue: (v: boolean) => void }) {
  return (
    <fieldset className="mb-3">
      <legend className={label}>{legend}</legend>
      <div className="flex gap-4">
        {[true, false].map((v) => (
          <label key={String(v)} className="flex items-center gap-2 text-sm">
            <input type="radio" name={name} checked={value === v} onChange={() => setValue(v)} />
            {v ? 'Yes' : 'No'}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function RegistrationForm({ universities, boardingPoints }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'submitting' | 'done'>('idle');
  const [serverError, setServerError] = useState<string>();

  const {
    register, handleSubmit, setValue, control, setError,
    formState: { errors },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { needsTransport: false, needsAccommodation: false, needsFood: false, idProofPath: '' },
  });

  const w = useWatch({ control });
  const boarding = boardingPoints.find((b) => b.id === w.boardingPointId);

  // Live preview only. The API recomputes the total and ignores anything the client sends.
  const fees = useMemo(
    () =>
      calcFees({
        boardingCharge: w.needsTransport ? boarding?.charge : 0,
        accommodationDays: w.needsAccommodation ? w.accommodationDays : 0,
        mealsPerDay: w.needsFood ? w.mealsPerDay : 0,
      }),
    [w.needsTransport, boarding, w.needsAccommodation, w.accommodationDays, w.needsFood, w.mealsPerDay],
  );

  function onPickFile(f: File | null) {
    setFileError(undefined);
    if (!f) return setFile(null);
    if (!ID_PROOF_RULES.types[f.type]) return setFileError('Only JPG, PNG or PDF allowed');
    if (f.size > ID_PROOF_RULES.maxBytes) return setFileError('File must be under 5 MB');
    setFile(f);
  }

  async function uploadIdProof(f: File): Promise<string> {
    const res = await fetch('/api/uploads/id-proof', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType: f.type, size: f.size }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? 'Upload failed');
    const { path, token, bucketKey } = await res.json();
    const { error } = await supabaseBrowser.storage.from('id-proofs').uploadToSignedUrl(bucketKey, token, f, { contentType: f.type });
    if (error) throw new Error('Upload failed');
    return path as string;
  }

  async function onSubmit(values: RegistrationInput) {
    setServerError(undefined);
    if (!file) return setFileError('ID proof is required');
    try {
      setStatus('uploading');
      const idProofPath = await uploadIdProof(file);
      setStatus('submitting');
      const res = await fetch('/api/registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, idProofPath }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 422 && data.issues) {
          for (const [k, v] of Object.entries<string[]>(data.issues)) setError(k as keyof RegistrationInput, { message: v[0] });
        }
        throw new Error(data.error ?? 'Registration failed');
      }
      setStatus('done');
      window.location.href = '/participant';
    } catch (e) {
      setStatus('idle');
      setServerError(e instanceof Error ? e.message : 'Something went wrong');
    }
  }

  const busy = status === 'uploading' || status === 'submitting';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto max-w-2xl space-y-8 p-4">
      {/* Basic info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Your details</h2>
        <div>
          <label className={label} htmlFor="studentName">Student name</label>
          <input id="studentName" className={input} autoComplete="name" {...register('studentName')} />
          <Err msg={errors.studentName?.message} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="phone">Phone</label>
            <input id="phone" type="tel" inputMode="tel" className={input} autoComplete="tel" {...register('phone')} />
            <Err msg={errors.phone?.message} />
          </div>
          <div>
            <label className={label} htmlFor="email">Email</label>
            <input id="email" type="email" className={input} autoComplete="email" {...register('email')} />
            <Err msg={errors.email?.message} />
          </div>
        </div>
        <div>
          <label className={label} htmlFor="universityId">University</label>
          <select id="universityId" className={input} defaultValue="" {...register('universityId')}>
            <option value="" disabled>Select your university</option>
            {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <Err msg={errors.universityId?.message && 'Select your university'} />
        </div>
        <div>
          <label className={label} htmlFor="idProof">Valid ID proof (JPG, PNG or PDF, max 5 MB)</label>
          <input id="idProof" type="file" accept="image/jpeg,image/png,application/pdf" className={input}
                 onChange={(e) => onPickFile(e.target.files?.[0] ?? null)} />
          <p className="mt-1 text-xs text-slate-500">Stored privately. Only event admins can view it.</p>
          <Err msg={fileError} />
        </div>
      </section>

      {/* Transport */}
      <section>
        <h2 className="mb-2 text-lg font-semibold">Transportation</h2>
        <YesNo name="needsTransport" legend="Do you need transport?" value={!!w.needsTransport} setValue={(v) => setValue('needsTransport', v, { shouldValidate: true })} />
        {w.needsTransport && (
          <div>
            <label className={label} htmlFor="boardingPointId">Boarding point</label>
            <select id="boardingPointId" className={input} defaultValue="" {...register('boardingPointId')}>
              <option value="" disabled>Select boarding point</option>
              {boardingPoints.map((b) => <option key={b.id} value={b.id}>{b.name} — {inr(b.charge)}</option>)}
            </select>
            <Err msg={errors.boardingPointId?.message} />
            {boarding && <p className="mt-2 text-sm text-slate-700">Transport charge: <strong>{inr(boarding.charge)}</strong></p>}
          </div>
        )}
      </section>

      {/* Accommodation */}
      <section>
        <h2 className="mb-2 text-lg font-semibold">Accommodation</h2>
        <YesNo name="needsAccommodation" legend="Do you need accommodation?" value={!!w.needsAccommodation} setValue={(v) => setValue('needsAccommodation', v, { shouldValidate: true })} />
        {w.needsAccommodation && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={label} htmlFor="accommodationDays">Number of days</label>
              <select id="accommodationDays" className={input} defaultValue="" {...register('accommodationDays', { valueAsNumber: true })}>
                <option value="" disabled>Select</option>
                {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <Err msg={errors.accommodationDays?.message} />
            </div>
            <div>
              <label className={label} htmlFor="checkIn">Check-in</label>
              <input id="checkIn" type="datetime-local" className={input} {...register('checkIn')} />
              <Err msg={errors.checkIn?.message} />
            </div>
            <div>
              <label className={label} htmlFor="checkOut">Check-out</label>
              <input id="checkOut" type="datetime-local" className={input} {...register('checkOut')} />
              <Err msg={errors.checkOut?.message} />
            </div>
          </div>
        )}
      </section>

      {/* Food */}
      <section>
        <h2 className="mb-2 text-lg font-semibold">Food</h2>
        <YesNo name="needsFood" legend="Do you need meals?" value={!!w.needsFood} setValue={(v) => setValue('needsFood', v, { shouldValidate: true })} />
        {w.needsFood && (
          <div className="max-w-xs">
            <label className={label} htmlFor="mealsPerDay">Meals per day</label>
            <select id="mealsPerDay" className={input} defaultValue="" {...register('mealsPerDay', { valueAsNumber: true })}>
              <option value="" disabled>Select</option>
              {[1, 2, 3, 4].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <Err msg={errors.mealsPerDay?.message} />
          </div>
        )}
      </section>

      {/* Fee summary */}
      <aside aria-live="polite" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <h2 className="mb-2 font-semibold">Estimated fees</h2>
        <dl className="space-y-1">
          <div className="flex justify-between"><dt>Transport</dt><dd>{inr(fees.transport)}</dd></div>
          <div className="flex justify-between"><dt>Accommodation ({inr(RATES.accommodationPerDay)}/day)</dt><dd>{inr(fees.accommodation)}</dd></div>
          <div className="flex justify-between"><dt>Food ({RATES.eventDays} days × {inr(RATES.mealPrice)}/meal)</dt><dd>{inr(fees.food)}</dd></div>
          <div className="flex justify-between border-t pt-2 text-base font-semibold"><dt>Total</dt><dd>{inr(fees.total)}</dd></div>
        </dl>
        <p className="mt-2 text-xs text-slate-500">Final amount is confirmed by the server. Payment status starts as “Unpaid”.</p>
      </aside>

      {serverError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}

      <button type="submit" disabled={busy}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white disabled:opacity-60">
        {status === 'uploading' ? 'Uploading ID…' : status === 'submitting' ? 'Submitting…' : 'Complete registration'}
      </button>
    </form>
  );
}
