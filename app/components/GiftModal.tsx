"use client";
import { useState } from "react";
import { supabase, type Item } from "@/lib/supabase";
export default function GiftModal({
  item,
  onClose,
  onReserved,
}: {
  item: Item;
  onClose: () => void;
  onReserved: () => void;
}) {
  const [qty, setQty] = useState(1);
  const left = item.needed - item.covered;
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.rpc("reserve_gift", {
      p_item: item.id,
      p_qty: qty,
      p_name: f.get("name"),
      p_contact: f.get("contact"),
      p_note: f.get("note"),
    });
    alert(
      error
        ? "Sorry, that item was just covered. Please pick another."
        : `Thank you ${f.get("name")}! Your gift is reserved for ${s.babyName}.`,
    );
    onClose();
    onReserved();
  }
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-8 space-y-4 shadow-2xl"
      >
        <h3 className="heading text-2xl text-center">{item.name}</h3>
        <p className="text-xs text-slate-soft text-center">
          Still needed: {left} of {item.needed}
        </p>
        <div className="p-3 bg-powder-light rounded-xl flex justify-between items-center border border-powder-blue">
          <span className="text-xs font-semibold">Quantity</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-8 h-8 rounded-full bg-white border border-powder-blue"
            >
              -
            </button>
            <b>{qty}</b>
            <button
              type="button"
              onClick={() => setQty(Math.min(left, qty + 1))}
              className="w-8 h-8 rounded-full bg-white border border-powder-blue"
            >
              +
            </button>
          </div>
        </div>
        <div>
          <label className="label">Your name *</label>
          <input name="name" required className="input" />
        </div>
        <div>
          <label className="label">Email or phone (private) *</label>
          <input name="contact" required className="input" />
        </div>
        <div>
          <label className="label">Note for parents</label>
          <textarea name="note" rows={2} className="input" />
        </div>
        <button className="btn w-full">Confirm gift</button>
      </form>
    </div>
  );
}
