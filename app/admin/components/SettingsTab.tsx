import { supabase, type Run, type Settings } from "@/lib/supabase";
const FIELDS: [string, string][] = [
  ["babyName", "Baby name"],
  ["parents", "Parents"],
  ["eventDateText", "Event date (display text)"],
  ["eventDate", "Countdown date/time (YYYY-MM-DDTHH:MM:SS)"],
  ["eventTime", "Event time"],
  ["ceremonyVenue", "Ceremony venue"],
  ["ceremonyAddress", "Ceremony address"],
  ["dressCode", "Dress code"],
  ["rsvpDeadline", "RSVP deadline"],
  ["bankName", "Bank / wallet"],
  ["accountName", "Account name"],
  ["accountNumber", "Account number"],
];
export default function SettingsTab({
  s,
  setS,
  run,
}: {
  s: Settings;
  setS: (s: Settings) => void;
  run: Run;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(
          supabase.from("settings").update({ data: s }).eq("id", 1),
          "Changes saved",
        );
      }}
      className="x-w-3xl"
    >
      {FIELDS.map(([k, l]) => (
        <div key={k} className="mb-5">
          <label className="label">{l}</label>
          <input
            value={s[k] ?? ""}
            onChange={(e) => setS({ ...s, [k]: e.target.value })}
            className="input"
          />
        </div>
      ))}
      <button className="btn sm:col-span-2 w-fit">Save changes</button>
    </form>
  );
}
