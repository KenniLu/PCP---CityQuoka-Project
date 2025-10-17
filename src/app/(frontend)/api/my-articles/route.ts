import { NextResponse } from 'next/server'
import payload from 'payload'

type Body = { articleId: string; action: 'save' | 'unsave' }

export async function POST(req: Request) {
try {
const { articleId, action } = (await req.json()) as Body
if (!articleId || !['save', 'unsave'].includes(action)) {
return NextResponse.json({ error: 'Bad request' }, { status: 400 })
}

// Authenticate logged-in user via Payload
const { user } = await payload.auth({ headers: req.headers as any })
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// Normalize current list (ids may be objects or strings)
const current: string[] = Array.isArray(user.savedArticles)
? (user.savedArticles as any[]).map(x => String((x as any)?.id ?? x))
: []

const next =
action === 'save'
? Array.from(new Set([...current, String(articleId)]))
: current.filter(id => id !== String(articleId))

await payload.update({
collection: 'users',
id: String(user.id),
data: { savedArticles: next },
user,
})

return NextResponse.json({ ok: true, savedArticles: next })
} catch (e) {
console.error(e)
return NextResponse.json({ error: 'Server error' }, { status: 500 })
}
}

// List all saved posts for the logged-in user
export async function GET(req: Request) {
const { user } = await payload.auth({ headers: req.headers as any })
if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

const ids: string[] = Array.isArray(user.savedArticles)
? (user.savedArticles as any[]).map(x => String((x as any)?.id ?? x))
: []

if (!ids.length) return NextResponse.json({ docs: [] })

const { docs } = await payload.find({
collection: 'posts', // <-- change if your collection slug differs
where: { id: { in: ids } },
limit: ids.length,
user,
})

return NextResponse.json({ docs })
}