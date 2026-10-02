"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import SectionHead from "./SectionHead";
export default function RsvpSection() {
  const [attending, setAttending] = useState(true);
  const [headcount, setHeadcount] = useState(1);
  const [note, setNote] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const companions = f
      .getAll("companion")
      .map((x) => String(x).trim())
      .filter(Boolean);
    const { error } = await supabase.from("rsvps").insert({
      name: f.get("name"),
      contact: f.get("contact"),
      attending,
      headcount: attending ? headcount : 0,
      companions: attending ? companions : [],
      dietary: attending ? f.get("dietary") : "Standard",
      notes: f.get("notes"),
    });
    if (error) return setNote("Something went wrong. Please try again.");
    setNote(
      attending
        ? `Thank you ${f.get("name")}! We can't wait to celebrate with you.`
        : `Thank you ${f.get("name")} for letting us know. You will be missed!`,
    );
    form.reset();
    setHeadcount(1);
  }
  return (
    <section id="rsvp" className="bg-powder-light">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="glass rounded-3xl p-6 sm:p-10 border-gold-accent/40 shadow-xl">
          <SectionHead eyebrow="Will you join us?" title="RSVP" />
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  [true, "Joyfully accept ❤️"],
                  [false, "Regretfully decline"],
                ] as const
              ).map(([v, l]) => (
                <button
                  type="button"
                  key={String(v)}
                  onClick={() => setAttending(v)}
                  className={`p-4 rounded-2xl border-2 text-sm font-semibold ${attending === v ? "border-deep-blue bg-powder-light" : "border-powder-blue bg-white"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full name *</label>
                <input name="name" required className="input" />
              </div>
              <div>
                <label className="label">Email or phone *</label>
                <input name="contact" required className="input" />
              </div>
            </div>
            {attending && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Total attendees</label>
                    <select
                      value={headcount}
                      onChange={(e) => setHeadcount(+e.target.value)}
                      className="input"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                          {n === 5 ? "+" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Dietary preference</label>
                    <select name="dietary" className="input">
                      <option>Standard</option>
                      <option>Vegetarian</option>
                      <option>Kids Menu</option>
                      <option>Allergies</option>
                    </select>
                  </div>
                </div>
                {Array.from({ length: headcount - 1 }, (_, i) => (
                  <input
                    key={i}
                    name="companion"
                    placeholder={`Guest ${i + 2} full name`}
                    className="input"
                  />
                ))}
              </>
            )}
            <div>
              <label className="label">Note for the parents (optional)</label>
              <textarea name="notes" rows={2} className="input" />
            </div>
            <button className="btn w-full">Send RSVP</button>
            {note && (
              <p role="status" className="text-sm text-center text-deep-blue">
                {note}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
