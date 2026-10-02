"use client";
import { useCountdown } from "@/lib/useCountdown";
import { type Settings, assetUrl } from "@/lib/supabase";
export default function Hero({ s }: { s: Settings }) {
  const cd = useCountdown(s.eventDate);
  return (
    <header className="pt-24 md:pt-32 pb-16 px-4 max-w-5xl mx-auto text-center">
      <p className="font-serif italic text-xl text-slate-soft mb-2">
        With grateful hearts, we invite you to celebrate…
      </p>
      <h1 className="heading text-5xl sm:text-7xl mb-4">{s.babyName}</h1>
      <p className="eyebrow mb-6">Dedication Ceremony</p>
      <div className="w-52 h-64 rounded-t-full rounded-b-2xl p-2 bg-gradient-to-b from-gold-accent via-champagne to-powder-blue shadow-xl mx-auto overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetUrl(s.heroPhoto)}
          alt={`Photo of ${s.babyName}`}
          className="w-full h-full object-cover rounded-t-full rounded-b-xl"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-3 text-sm font-medium my-8">
        {[s.eventDateText, s.eventTime, s.ceremonyVenue].map((x) => (
          <span
            key={x}
            className="px-4 py-2 rounded-xl bg-white/70 border border-powder-blue"
          >
            {x}
          </span>
        ))}
      </div>
      <div className="glass rounded-3xl p-6 max-w-xl mx-auto mb-8 border-gold-accent/30">
        <div className="grid grid-cols-4 gap-3">
          {["Days", "Hours", "Mins", "Secs"].map((l, i) => (
            <div
              key={l}
              className="p-3 rounded-2xl bg-powder-light/80 border border-powder-blue/60"
            >
              <span className="block heading text-3xl sm:text-4xl">
                {String(cd[i]).padStart(2, "0")}
              </span>
              <span className="text-xs text-slate-soft">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <a href="#rsvp" className="btn">
        RSVP now
      </a>
    </header>
  );
}
