import { useState } from 'react'
import { supabase, type Rsvp, type Run } from '@/lib/supabase'
export default function RsvpsTab({ rsvps, run }: { rsvps: Rsvp[]; run: Run }) {
  const [q, setQ] = useState('')
  const filtered = rsvps.filter(r => `${r.name} ${r.contact}`.toLowerCase().includes(q.toLowerCase()))
  function exportCsv() {
    const esc = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = ['Name,Attending,Headcount,Dietary,Companions,Contact,Notes,Date', ...rsvps.map(r => [r.name, r.attending ? 'Yes' : 'No', r.headcount, r.dietary, r.companions?.join('; '), r.contact, r.notes, r.created_at.slice(0, 10)].map(esc).join(','))].join('\n')
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'rsvps.csv'; a.click()
  }
  return <>
    <div className="flex flex-col sm:flex-row gap-3 justify-between"><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or contact" className="input sm:w-72" /><button onClick={exportCsv} className="btn">Export CSV</button></div>
    <div className="overflow-x-auto border border-powder-blue rounded-2xl bg-white"><table className="w-full text-left text-xs text-slate-soft">
      <thead className="bg-powder-light text-deep-blue"><tr>{['Guest', 'Status', 'Headcount', 'Dietary', 'Companions', 'Contact', 'Notes', ''].map(h => <th key={h} className="p-3 font-bold">{h}</th>)}</tr></thead>
      <tbody className="divide-y divide-powder-blue/40">{filtered.map(r => <tr key={r.id}>
        <td className="p-3 font-semibold text-deep-blue">{r.name}</td><td className="p-3">{r.attending ? 'Attending' : 'Declined'}</td><td className="p-3">{r.headcount}</td><td className="p-3">{r.dietary}</td>
        <td className="p-3">{r.companions?.join(', ') || '—'}</td><td className="p-3">{r.contact}</td><td className="p-3 max-w-[200px]">{r.notes}</td>
        <td className="p-3"><button className="btn-danger" onClick={() => confirm('Remove this RSVP?') && run(supabase.from('rsvps').delete().eq('id', r.id))}>Delete</button></td></tr>)}</tbody></table></div>
  </>
}
