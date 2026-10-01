import type { Settings } from "@/lib/supabase";
export default function Footer({ s }: { s: Settings }) {
  return (
    <footer className="bg-deep-blue text-white py-10 px-4 mt-16 text-center">
      <h3 className="font-serif font-bold text-2xl">{s.babyName}</h3>
      <p className="text-xs text-powder-blue mt-1">With love, {s.parents}</p>
    </footer>
  );
}
