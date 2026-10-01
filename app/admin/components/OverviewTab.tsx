import type { Item, Msg, Rsvp } from '@/lib/supabase'
export default function OverviewTab({ rsvps, items, msgs }: { rsvps: Rsvp[]; items: Item[]; msgs: Msg[] }) {
  const yes = rsvps.filter(r => r.attending)
  const stats: [string, number][] = [['Confirmed RSVPs', yes.length], ['Total headcount', yes.reduce((n, r) => n + r.headcount, 0)], ['Declined', rsvps.length - yes.length],
    ['Gifts reserved', items.reduce((n, i) => n + i.covered, 0)], ['Pending blessings', msgs.filter(m => m.status === 'pending').length]]
  return <>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">{stats.map(([l, n]) => <div key={l} className="p-4 rounded-2xl bg-powder-light border border-powder-blue text-center"><span className="block font-serif text-3xl font-bold">{n}</span><span className="text-xs text-slate-soft">{l}</span></div>)}</div>
    <div className="bg-white p-6 rounded-2xl border border-powder-blue"><h2 className="heading text-lg mb-2">Recent RSVPs</h2>
      {rsvps.slice(0, 5).map(r => <p key={r.id} className="text-xs text-slate-soft py-1"><b className="text-deep-blue">{r.name}</b> {r.attending ? `is coming (${r.headcount})` : 'declined'} on {r.created_at.slice(0, 10)}</p>)}
      {!rsvps.length && <p className="text-xs italic text-slate-soft">No RSVPs yet.</p>}</div>
  </>
}
