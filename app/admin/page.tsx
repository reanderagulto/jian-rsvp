"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  supabase,
  galleryUrl,
  type Claim,
  type GalleryImage,
  type Item,
  type Msg,
  type Rsvp,
  type Run,
  type Settings,
} from "@/lib/supabase";
import OverviewTab from "./components/OverviewTab";
import RsvpsTab from "./components/RsvpsTab";
import RegistryTab from "./components/RegistryTab";
import GalleryTab from "./components/GalleryTab";
import MessagesTab from "./components/MessagesTab";
import SettingsTab from "./components/SettingsTab";

const TABS = [
  "Overview",
  "RSVPs",
  "Gift registry",
  "Gallery",
  "Messages",
  "Event settings",
] as const;

export default function Admin() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [rsvps, setRsvps] = useState<Rsvp[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [s, setS] = useState<Settings>({});
  const [toast, setToast] = useState("");

  const load = useCallback(async () => {
    const [a, b, c, d, e, g] = await Promise.all([
      supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("wishlist_items").select("*").order("created_at"),
      supabase.from("gift_claims").select("*").order("created_at"),
      supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("settings").select("data").eq("id", 1).single(),
      supabase.from("gallery_images").select("*").order("position"),
    ]);
    setRsvps(a.data ?? []);
    setItems(b.data ?? []);
    setClaims(c.data ?? []);
    setMsgs(d.data ?? []);
    if (e.data) setS(e.data.data);
    setImages((g.data ?? []).map((x) => ({ ...x, url: galleryUrl(x.path) })));
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const say = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2500);
  };
  const run: Run = async (p, ok) => {
    const { error } = await p;
    if (error) say(error.message);
    else {
      if (ok) say(ok);
      load();
    }
  };
  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6">
      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-6 bg-deep-blue text-white flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif font-bold text-2xl">
              Celebration management
            </h1>
            <p className="text-xs text-powder-blue">
              {s.babyName} · {s.eventDateText}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="btn-soft">
              View site
            </Link>
            <button onClick={logout} className="btn-soft">
              Sign out
            </button>
          </div>
        </div>
        <div className="bg-powder-light/80 border-b border-powder-blue px-4 pt-3 flex flex-wrap gap-1 text-xs font-semibold text-slate-soft">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-t-xl ${tab === t ? "bg-white text-deep-blue border border-b-0 border-powder-blue" : "hover:text-deep-blue"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="p-6 space-y-6 min-h-[60vh] bg-white/60">
          {tab === "Overview" && (
            <OverviewTab rsvps={rsvps} items={items} msgs={msgs} />
          )}
          {tab === "RSVPs" && <RsvpsTab rsvps={rsvps} run={run} />}
          {tab === "Gift registry" && (
            <RegistryTab items={items} claims={claims} run={run} />
          )}
          {tab === "Gallery" && (
            <GalleryTab s={s} setS={setS} images={images} run={run} say={say} />
          )}
          {tab === "Messages" && <MessagesTab msgs={msgs} run={run} />}
          {tab === "Event settings" && (
            <SettingsTab s={s} setS={setS} run={run} />
          )}
        </div>
      </div>
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-deep-blue text-white text-xs px-5 py-3 rounded-full shadow-xl"
        >
          {toast}
        </div>
      )}
    </main>
  );
}
