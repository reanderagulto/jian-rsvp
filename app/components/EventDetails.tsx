import SectionHead from "./SectionHead";
import type { Settings } from "@/lib/supabase";
import EventMap from "./EventMap";

export default function EventDetails({ s }: { s: Settings }) {
  const details = {
    title: `Dedication Ceremony Details`,
    time: s.eventTime,
    venue: s.ceremonyVenue,
    address: s.ceremonyAddress,
    borderClass: "border-t-gold-accent",
  };
  const { title, time, venue, address, borderClass } = details;

  return (
    <section id="details" className="py-16 px-4 max-w-5xl mx-auto">
      <SectionHead eyebrow="Where & When" title="Event schedule & venues" />
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div
          key={title}
          className={`glass rounded-3xl p-8 border-t-4 ${borderClass}`}
        >
          <h3 className="heading text-2xl mb-3">{title}</h3>
          <div className="mb-5 border-b-2 pb-3">
            <h4 className="font-semibold text-sm">Time</h4>
            <p className="text-sm font-semibold">{time}</p>
          </div>
          <div className="mb-5 border-b-2 pb-3">
            <h4 className="font-semibold text-sm">Venue</h4>
            <p className="text-sm font-semibold mt-2">{venue}</p>
            <p className="text-sm text-slate-soft">{address}</p>
          </div>
          <div className="mb-5 border-b-2 pb-3">
            <h4 className="font-semibold text-sm">Dress code</h4>
            <p className="text-sm text-slate-soft mt-1">{s.dressCode}</p>
          </div>
          <div className="">
            <h4 className="font-semibold text-sm">RSVP deadline</h4>
            <p className="text-sm text-slate-soft mt-1">
              Please confirm by {s.rsvpDeadline}.
            </p>
          </div>
        </div>
        <EventMap
          query={`${s.ceremonyVenue} ${s.ceremonyAddress}`}
          title={`Map to ${s.ceremonyVenue}`}
        />
      </div>
    </section>
  );
}
