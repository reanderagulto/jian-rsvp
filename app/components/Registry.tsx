"use client";
import { useState } from "react";
import { CATEGORIES, type Item, type Settings } from "@/lib/supabase";
import GiftModal from "./GiftModal";
export default function Registry({
  items,
  s,
  onReserved,
}: {
  items: Item[];
  s: Settings;
  onReserved: () => void;
}) {
  const [cat, setCat] = useState("All");
  const [giftItem, setGiftItem] = useState<Item | null>(null);
  const shown = cat === "All" ? items : items.filter((i) => i.category === cat);
  return (
    <section id="needs" className="py-16 px-4 max-w-5xl mx-auto">
      <div className="glass rounded-3xl p-8 text-center mb-8">
        <h2 className="heading text-3xl sm:text-4xl mb-2">Baby&apos;s needs</h2>
        <p className="font-serif italic text-xl text-gold-accent mb-3">
          Your presence is already our greatest gift.
        </p>
        <p className="text-sm text-slate-soft max-w-2xl mx-auto">
          If you&apos;d like to bless Liam with a gift, this list helps avoid
          duplicates. There is no obligation at all.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border border-powder-blue ${cat === c ? "bg-deep-blue text-white" : "bg-white/80 text-slate-soft hover:bg-powder-light"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {shown.map((i) => (
          <div
            key={i.id}
            className="glass rounded-3xl overflow-hidden flex flex-col"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {i.image_url && (
              <img
                src={i.image_url}
                alt={i.name}
                className="h-44 w-full object-cover"
              />
            )}
            <div className="p-6 flex-1">
              <h3 className="heading text-xl">{i.name}</h3>
              <p className="text-xs text-slate-soft my-2">{i.description}</p>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>{i.price_range}</span>
                <span className="text-gold-accent">
                  {i.covered} of {i.needed} covered
                </span>
              </div>
              <div className="h-2 rounded-full bg-powder-light overflow-hidden">
                <div
                  className="h-full bg-gold-accent"
                  style={{
                    width: `${Math.min(100, (i.covered / i.needed) * 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="p-6 pt-0">
              {i.covered >= i.needed ? (
                <button disabled className="btn-soft w-full py-3 rounded-full">
                  All covered. Thank you!
                </button>
              ) : (
                <button onClick={() => setGiftItem(i)} className="btn w-full">
                  I&apos;d like to give this
                </button>
              )}
            </div>
          </div>
        ))}
        {!shown.length && (
          <p className="col-span-full text-center text-sm text-slate-soft">
            No items in this category yet.
          </p>
        )}
      </div>
      <details className="glass rounded-3xl p-6 max-w-2xl mx-auto text-center">
        <summary className="heading text-xl cursor-pointer">
          Optional monetary gift
        </summary>
        <p className="text-xs text-slate-soft mt-4">
          Toward Liam&apos;s future savings. There is zero expectation.
        </p>
        <div className="text-xs mt-3 space-y-1">
          <p>
            <b>Bank / wallet:</b> {s.bankName}
          </p>
          <p>
            <b>Account name:</b> {s.accountName}
          </p>
          <p>
            <b>Account #:</b> {s.accountNumber}{" "}
            <button
              type="button"
              className="text-gold-accent underline"
              onClick={() => navigator.clipboard.writeText(s.accountNumber)}
            >
              Copy
            </button>
          </p>
        </div>
      </details>
      {giftItem && (
        <GiftModal
          item={giftItem}
          onClose={() => setGiftItem(null)}
          onReserved={onReserved}
        />
      )}
    </section>
  );
}
