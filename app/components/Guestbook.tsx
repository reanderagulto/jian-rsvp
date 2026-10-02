"use client";
import { supabase, type Msg } from "@/lib/supabase";
import SectionHead from "./SectionHead";
import type { Settings } from "@/lib/supabase";
export default function Guestbook({ msgs, s }: { msgs: Msg[]; s: Settings }) {
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const { error } = await supabase.from("messages").insert({
      sender: f.get("sender"),
      body: f.get("body"),
      status: "pending",
    });
    alert(
      error
        ? "Could not send your blessing. Please try again."
        : "Thank you! Your blessing will appear after a quick review.",
    );
    if (!error) form.reset();
  }
  return (
    <section id="messages" className="bg-white">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <SectionHead
          eyebrow="Guestbook"
          title={`Blessings for ${s.babyName}`}
        />
        <div className="grid lg:grid-cols-3 gap-8">
          <form
            onSubmit={submit}
            className="glass rounded-3xl p-6 space-y-4 h-fit"
          >
            <h3 className="heading text-xl">Leave a blessing</h3>
            <div>
              <label className="label">Your name *</label>
              <input name="sender" required className="input" />
            </div>
            <div>
              <label className="label">Your message *</label>
              <textarea name="body" rows={4} required className="input" />
            </div>
            <button className="btn w-full">Send blessing</button>
            <p className="text-xs text-slate-soft text-center italic">
              Messages appear after a quick review.
            </p>
          </form>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4 content-start">
            {msgs.map((m) => (
              <div key={m.id} className="glass rounded-2xl p-5">
                <p className="text-sm text-slate-soft italic mb-4">
                  “{m.body}”
                </p>
                <div className="flex justify-between">
                  <span className="heading text-sm">{m.sender}</span>
                  <span className="text-xs text-gold-accent">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {!msgs.length && (
              <p className="text-sm text-slate-soft italic col-span-2 text-center py-8">
                Be the first to leave a blessing for .
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
