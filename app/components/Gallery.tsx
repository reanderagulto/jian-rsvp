"use client";
import { useRef } from "react";
import type { GalleryImage, Settings } from "@/lib/supabase";
import SectionHead from "./SectionHead";
export default function Gallery({
  images,
  s,
}: {
  images: GalleryImage[];
  s: Settings;
}) {
  const track = useRef<HTMLDivElement>(null);
  if (!images.length) return null;
  const go = (d: number) =>
    track.current?.scrollBy({
      left: d * (track.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  return (
    <section id="gallery" className="py-16 px-4 max-w-5xl mx-auto">
      <SectionHead
        eyebrow="Gallery"
        title={s.galleryTitle || "Our Little Moments"}
      />
      {s.gallerySubtitle && (
        <p className="text-center text-sm text-slate-soft -mt-6 mb-8 max-w-xl mx-auto">
          {s.gallerySubtitle}
        </p>
      )}
      <div className="relative">
        <div
          ref={track}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((g, i) => (
            <div
              key={g.id}
              className="snap-center shrink-0 w-64 sm:w-80 aspect-[4/5] rounded-3xl p-1.5 bg-gradient-to-b from-gold-accent/60 via-champagne to-powder-blue shadow-soft"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.url}
                alt={`Liam photo ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover rounded-[1.3rem]"
              />
            </div>
          ))}
        </div>
        {(["Previous", "Next"] as const).map((l, i) => (
          <button
            key={l}
            aria-label={`${l} photos`}
            onClick={() => go(i ? 1 : -1)}
            className={`hidden sm:flex absolute top-1/2 -translate-y-1/2 ${i ? "-right-5" : "-left-5"} w-10 h-10 rounded-full glass items-center justify-center text-deep-blue hover:bg-powder-light`}
          >
            {i ? "›" : "‹"}
          </button>
        ))}
      </div>
    </section>
  );
}
