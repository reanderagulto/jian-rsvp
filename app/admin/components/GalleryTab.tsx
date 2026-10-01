import { useState } from "react";
import {
  supabase,
  type GalleryImage,
  type Run,
  type Settings,
} from "@/lib/supabase";
export default function GalleryTab({
  s,
  setS,
  images,
  run,
  say,
}: {
  s: Settings;
  setS: (s: Settings) => void;
  images: GalleryImage[];
  run: Run;
  say: (m: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    let pos = images.reduce((m, g) => Math.max(m, g.position), -1);
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const up = await supabase.storage.from("gallery").upload(path, file);
      if (up.error) {
        say(up.error.message);
        continue;
      }
      await supabase.from("gallery_images").insert({ path, position: ++pos });
    }
    setBusy(false);
    await run(
      Promise.resolve({ error: null }),
      `Uploaded ${files.length} image(s)`,
    );
  }
  async function remove(g: GalleryImage) {
    await supabase.storage.from("gallery").remove([g.path]);
    await run(
      supabase.from("gallery_images").delete().eq("id", g.id),
      "Image removed",
    );
  }
  async function move(i: number, d: number) {
    const arr = [...images];
    const j = i + d;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    await run(
      Promise.all(
        arr.map((g, n) =>
          supabase
            .from("gallery_images")
            .update({ position: n })
            .eq("id", g.id),
        ),
      ).then((r) => r.find((x) => x.error) ?? { error: null }),
    );
  }
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(
            supabase.from("settings").update({ data: s }).eq("id", 1),
            "Gallery text saved",
          );
        }}
        className="bg-white p-5 rounded-2xl border border-powder-blue space-y-3 max-w-2xl"
      >
        <h2 className="heading text-lg">Section text</h2>
        <div>
          <label className="label">Header</label>
          <input
            value={s.galleryTitle ?? ""}
            onChange={(e) => setS({ ...s, galleryTitle: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="label">Subtitle</label>
          <textarea
            rows={2}
            value={s.gallerySubtitle ?? ""}
            onChange={(e) => setS({ ...s, gallerySubtitle: e.target.value })}
            className="input"
          />
        </div>
        <button className="btn">Save text</button>
      </form>
      <div className="bg-white p-5 rounded-2xl border border-powder-blue space-y-3">
        <h2 className="heading text-lg">Images</h2>
        <label className="btn cursor-pointer w-fit">
          {busy ? "Uploading…" : "Add images"}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={busy}
            onChange={(e) => {
              upload(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((g, i) => (
            <div
              key={g.id}
              className="rounded-2xl border border-powder-blue overflow-hidden bg-ivory"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.url}
                alt=""
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="p-2 flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <button
                    aria-label="Move earlier"
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="btn-soft disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    aria-label="Move later"
                    disabled={i === images.length - 1}
                    onClick={() => move(i, 1)}
                    className="btn-soft disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  className="btn-danger"
                  onClick={() => confirm("Remove this image?") && remove(g)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        {!images.length && (
          <p className="text-sm italic text-slate-soft">
            No images yet. Add some to show the gallery on the site.
          </p>
        )}
      </div>
    </>
  );
}
