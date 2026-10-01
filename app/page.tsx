"use client";
import { useCallback, useEffect, useState } from "react";
import {
  supabase,
  galleryUrl,
  type GalleryImage,
  type Item,
  type Msg,
  type Settings,
} from "@/lib/supabase";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EventDetails from "./components/EventDetails";
import Gallery from "./components/Gallery";
import RsvpSection from "./components/RsvpSection";
import Registry from "./components/Registry";
import Guestbook from "./components/Guestbook";
import Footer from "./components/Footer";

export default function Home() {
  const [s, setS] = useState<Settings>({});
  const [items, setItems] = useState<Item[]>([]);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);

  const load = useCallback(async () => {
    const [a, b, c, d] = await Promise.all([
      supabase.from("settings").select("data").eq("id", 1).single(),
      supabase.from("wishlist_items").select("*").order("created_at"),
      supabase
        .from("messages")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false }),
      supabase.from("gallery_images").select("*").order("position"),
    ]);
    if (a.data) setS(a.data.data);
    setItems(b.data ?? []);
    setMsgs(c.data ?? []);
    setImages((d.data ?? []).map((g) => ({ ...g, url: galleryUrl(g.path) })));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <Navbar />
      <Hero s={s} />
      <EventDetails s={s} />
      <Gallery images={images} s={s} />
      <RsvpSection />
      <Registry items={items} s={s} onReserved={load} />
      <Guestbook msgs={msgs} s={s} />
      <Footer s={s} />
    </>
  );
}
