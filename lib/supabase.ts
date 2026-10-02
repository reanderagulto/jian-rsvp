import { createBrowserClient } from "@supabase/ssr";
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
export type Settings = Record<string, string>;
export type Item = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  price_range: string | null;
  needed: number;
  covered: number;
  image_url: string | null;
};
export type Claim = {
  id: string;
  item_id: string;
  guest_name: string;
  contact: string;
  qty: number;
  note: string | null;
  created_at: string;
};
export type Rsvp = {
  id: string;
  name: string;
  contact: string;
  attending: boolean;
  headcount: number;
  companions: string[];
  dietary: string;
  notes: string | null;
  created_at: string;
};
export type Msg = {
  id: string;
  sender: string;
  body: string;
  status: "pending" | "approved";
  created_at: string;
};
export const CATEGORIES = [
  "Baby Essentials",
  "Clothing & Wear",
  "Feeding",
  "Bath & Nursery",
  "Toys & Books",
];
export type GalleryImage = {
  id: string;
  path: string;
  position: number;
  url: string;
};
export type Run = (
  p: PromiseLike<{ error: { message: string } | null }>,
  ok?: string,
) => Promise<void>;
export const galleryUrl = (path: string) =>
  supabase.storage.from("gallery").getPublicUrl(path).data.publicUrl;

export const assetUrl = (path?: string | null) =>
  path
    ? supabase.storage.from("site-assets").getPublicUrl(path).data.publicUrl
    : undefined;
