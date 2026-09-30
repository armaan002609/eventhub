import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import { ID_PROOF_RULES } from './validation';

const BUCKET = 'id-proofs'; // private bucket, no public/anon policies

const admin = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

/** Path is server-generated and namespaced by user id: the client never chooses it. */
export async function createIdProofUpload(userId: string, contentType: string) {
  const ext = ID_PROOF_RULES.types[contentType];
  const path = `id-proofs/${userId}/${randomUUID()}.${ext}`;
  const { data, error } = await admin().storage.from(BUCKET).createSignedUploadUrl(path.replace(/^id-proofs\//, ''));
  if (error || !data) throw new Error('Could not create upload URL');
  // Storage keys inside the bucket omit the "id-proofs/" prefix; we keep the prefix in the DB path for pattern-checking.
  return { path, token: data.token, bucketKey: path.replace(/^id-proofs\//, '') };
}

/** Short-lived read URL (60s) for admin review only. Always audit-log the caller. */
export async function signIdProofRead(dbPath: string) {
  const { data, error } = await admin().storage.from(BUCKET).createSignedUrl(dbPath.replace(/^id-proofs\//, ''), 60);
  if (error || !data) throw new Error('Could not sign URL');
  return data.signedUrl;
}
