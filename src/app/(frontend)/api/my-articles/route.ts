// app/api/saved-articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

// Make sure this runs on Node (Payload cannot run on the Edge)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ---- If you need explicit init (often required in App Router) ----
// If your project already initializes Payload elsewhere, you can remove this.
import payloadConfig from '@payload-config'; // adjust path if needed
let payloadInited = false;
async function ensurePayload() {
  if (!payloadInited) {
    await payload.init({ config: payloadConfig });
    payloadInited = true;
  }
}

type Body = { articleId: string; action: 'save' | 'unsave' };

function headersToObject(h: Headers) {
  return Object.fromEntries(h.entries());
}

function normalizeIDs(maybe: unknown): string[] {
  if (!Array.isArray(maybe)) return [];
  return (maybe as any[])
    .map((x) => {
      if (typeof x === 'string' || typeof x === 'number') return String(x);
      if (x && typeof x === 'object' && 'id' in x) {
        const v = (x as any).id;
        if (typeof v === 'string' || typeof v === 'number') return String(v);
      }
      return null;
    })
    .filter((x): x is string => !!x);
}

export async function POST(req: NextRequest) {
  try {
    await ensurePayload();

    const { articleId, action } = (await req.json()) as Body;
    if (!articleId || !['save', 'unsave'].includes(action)) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    // Authenticate the logged-in user via cookies/JWT on this request
    const { user } = await payload.auth({ headers: headersToObject(req.headers) });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const current = normalizeIDs((user as any)?.savedArticles);
    const idStr = String(articleId);

    const next =
      action === 'save'
        ? Array.from(new Set([...current, idStr]))
        : current.filter((id) => id !== idStr);

    await payload.update({
      collection: 'users', // <-- change if your slug differs
      id: String((user as any).id),
      data: { savedArticles: next },
      user, // keep access-control context
    });

    return NextResponse.json({ ok: true, savedArticles: next }, { status: 200 });
  } catch (e) {
    console.error('[POST /api/saved-articles] Error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await ensurePayload();

    const { user } = await payload.auth({ headers: headersToObject(req.headers) });
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const ids = normalizeIDs((user as any)?.savedArticles);
    if (!ids.length) return NextResponse.json({ docs: [] }, { status: 200 });

    const { docs } = await payload.find({
      collection: 'posts',