import { supabase, type Run, type Settings } from "@/lib/supabase";
import ImageUploadField from "./ImageUploadField";

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
    <div className="max-w-3xl">
      <ImageUploadField
        title="Hero image"
        help="JPG, PNG or WebP, up to 5 MB. A portrait photo works best."
        folder="hero"
        settingKey="heroPhoto"
        shape="portrait"
        accept="image/png,image/jpeg,image/webp"
        fallback="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400"
        s={s}
        setS={setS}
        run={run}
      />
      <ImageUploadField
        title="Favicon / site icon"
        help="Square PNG, ICO, SVG or WebP, up to 1 MB (at least 64×64 px). Shows in the browser tab."
        folder="favicon"
        settingKey="favicon"
        shape="icon"
        accept="image/png,image/x-icon,image/vnd.microsoft.icon,image/svg+xml,image/webp"
        maxMB={1}
        s={s}
        setS={setS}
        run={run}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(
            supabase.from("settings").update({ data: s }).eq("id", 1),
            "Changes saved",
          );
        }}
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
        <button className="btn w-fit">Save changes</button>
      </form>
    </div>
  );
}
