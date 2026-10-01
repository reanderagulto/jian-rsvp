import { supabase, CATEGORIES, type Claim, type Item, type Run } from '@/lib/supabase'
export default function RegistryTab({ items, claims, run }: { items: Item[]; claims: Claim[]; run: Run }) {
  async function removeClaim(c: Claim) {
    const it = items.find(i => i.id === c.item_id); if (!it) return
    await run(supabase.from('gift_claims').delete().eq('id', c.id)); await run(supabase.from('wishlist_items').update({ covered: Math.max(0, it.covered - c.qty) }).eq('id', it.id))
  }
  async function addItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const f = new FormData(form)
    await run(supabase.from('wishlist_items').insert({ name: f.get('name'), category: f.get('category'), description: f.get('description'), price_range: f.get('price'), needed: +(f.get('needed') as string) || 1, image_url: f.get('image') || null }), 'Item added')
    form.reset()
  }
  return <>
    <form onSubmit={addItem} className="bg-white p-5 rounded-2xl border border-powder-blue grid sm:grid-cols-3 gap-3">
      <h2 className="heading text-lg sm:col-span-3">Add a need</h2>
      <input name="name" required placeholder="Item name" className="input" />
      <select name="category" className="input">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
      <input name="price" placeholder="Price range (~$30 - $50)" className="input" />
      <input name="needed" type="number" min={1} defaultValue={1} className="input" />
      <input name="image" placeholder="Image URL or /images/file.jpg" className="input" />
      <input name="description" placeholder="Short description" className="input" />
      <button className="btn sm:col-span-3">Add item</button></form>
    {items.map(i => <div key={i.id} className="p-4 rounded-2xl border border-powder-blue bg-white space-y-2">
      <div className="flex flex-wrap justify-between gap-2"><div><b className="text-sm">{i.name}</b> <span className="text-xs px-2 py-0.5 rounded-full bg-powder-light">{i.category}</span>
        <p className="text-xs text-slate-soft">Needed {i.needed} · Covered {i.covered}</p></div>
        <button className="btn-danger" onClick={() => confirm('Delete this item and its reservations?') && run(supabase.from('wishlist_items').delete().eq('id', i.id))}>Delete item</button></div>
      {claims.filter(c => c.item_id === i.id).map(c => <div key={c.id} className="flex flex-wrap justify-between items-center gap-2 p-2 bg-ivory rounded-lg border border-gold-accent/30 text-xs">
        <span><b>{c.guest_name}</b> ({c.qty}x) · {c.contact}{c.note && ` · “${c.note}”`}</span><button className="btn-soft" onClick={() => removeClaim(c)}>Remove</button></div>)}</div>)}
    {!items.length && <p className="text-sm italic text-slate-soft">No registry items yet.</p>}
  </>
}
