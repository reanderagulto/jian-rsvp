import { supabase, type Msg, type Run } from '@/lib/supabase'
export default function MessagesTab({ msgs, run }: { msgs: Msg[]; run: Run }) {
  const set = (id: string, status: string, ok: string) => run(supabase.from('messages').update({ status }).eq('id', id), ok)
  return <>
    {msgs.map(m => <div key={m.id} className="p-4 rounded-2xl border border-powder-blue bg-white flex flex-wrap items-center justify-between gap-3">
      <div><b className="text-xs">{m.sender}</b> <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${m.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{m.status}</span>
        <p className="text-sm text-slate-soft italic mt-1">“{m.body}”</p></div>
      <div className="flex gap-2">{m.status === 'pending' ? <button className="btn-soft" onClick={() => set(m.id, 'approved', 'Approved')}>Approve</button> : <button className="btn-soft" onClick={() => set(m.id, 'pending', 'Hidden')}>Unpublish</button>}
        <button className="btn-danger" onClick={() => run(supabase.from('messages').delete().eq('id', m.id))}>Delete</button></div></div>)}
    {!msgs.length && <p className="text-sm italic text-slate-soft">No blessings yet.</p>}
  </>
}
