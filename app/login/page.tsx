'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('')
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setErr(error.message); setBusy(false) } else { router.push('/admin'); router.refresh() }
  }
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="glass rounded-3xl p-8 sm:p-10 w-full max-w-sm text-center border-t-4 border-t-gold-accent">
        <div className="w-14 h-14 rounded-full bg-powder-light border border-gold-accent/40 mx-auto flex items-center justify-center text-xl mb-4">🔒</div>
        <h1 className="heading text-3xl mb-1">Admin sign in</h1>
        <p className="text-xs text-slate-soft mb-6">Manage RSVPs, the gift registry, guest blessings and event details.</p>
        <form onSubmit={submit} className="space-y-4 text-left">
          <div><label className="label" htmlFor="e">Email</label><input id="e" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input" /></div>
          <div><label className="label" htmlFor="p">Password</label><input id="p" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input" /></div>
          {err && <p role="alert" className="text-xs text-red-600">{err}</p>}
          <button className="btn w-full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <Link href="/" className="inline-block mt-6 text-xs text-slate-soft hover:text-deep-blue hover:underline">Back to invitation</Link>
      </div>
    </main>
  )
}
