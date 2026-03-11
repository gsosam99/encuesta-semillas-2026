import { SubmissionData, StoredResponse } from '../types';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export async function supabaseInsert(
  producer: string,
  data: SubmissionData
): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/respuestas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        producer,
        data,
        updated_at: new Date().toISOString(),
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function supabaseFetchAll(): Promise<StoredResponse[] | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/respuestas?select=*`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (res.ok) return (await res.json()) as StoredResponse[];
  } catch {}
  return null;
}
