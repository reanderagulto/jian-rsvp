import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant-garamond/wght-italic.css";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const revalidate = 60; // re-check settings at most once a minute

export async function generateMetadata(): Promise<Metadata> {
  const base: Metadata = {
    title: "Jian Enoch's Dedication Celebration",
  };
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
    const { data } = await sb
      .from("settings")
      .select("data")
      .eq("id", 1)
      .single();
    const path = data?.data?.favicon;
    if (path) {
      const url = sb.storage.from("site-assets").getPublicUrl(path)
        .data.publicUrl;
      return { ...base, icons: { icon: url, apple: url } };
    }
  } catch {}
  return base;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
