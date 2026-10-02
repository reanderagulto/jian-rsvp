"use client";
import { useState } from "react";
import { supabase, assetUrl, type Run, type Settings } from "@/lib/supabase";

type Props = {
  title: string;
  help: string;
  folder: string; // folder inside the "gallery" bucket
  settingKey: string; // key in the settings JSON
  shape: "portrait" | "icon";
  accept?: string;
  maxMB?: number;
  fallback?: string; // preview shown when nothing is uploaded
  s: Settings;
  setS: (s: Settings) => void;
  run: Run;
};

export default function ImageUploadField({
  title,
  help,
  folder,
  settingKey,
  shape,
  accept = "image/*",
  maxMB = 5,
  fallback,
  s,
  setS,
  run,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const current = s[settingKey];

  async function save(next: Settings, msg: string) {
    setS(next);
    await run(
      supabase.from("settings").update({ data: next }).eq("id", 1),
      msg,
    );
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/"))
      return setError("Please choose an image file.");
    if (file.size > maxMB * 1024 * 1024)
      return setError(`Image must be ${maxMB} MB or smaller.`);

    setUploading(true);
    const path = `${folder}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const up = await supabase.storage.from("site-assets").upload(path, file);
    if (up.error) {
      setUploading(false);
      return setError(up.error.message);
    }
    const old = current;
    await save({ ...s, [settingKey]: path }, `${title} updated`);
    if (old) await supabase.storage.from("site-assets").remove([old]); // clean up the previous file
    setUploading(false);
  }

  async function remove() {
    if (!current || !confirm(`Remove the ${title.toLowerCase()}?`)) return;
    await save({ ...s, [settingKey]: "" }, `${title} removed`);
    await supabase.storage.from("site-assets").remove([current]);
  }

  const src = current ? assetUrl(current) : fallback;

  return (
    <div className="mb-6 p-5 rounded-2xl border border-powder-blue bg-white">
      <h2 className="heading text-lg mb-3">{title}</h2>
      <div className="flex flex-wrap items-center gap-5">
        {shape === "portrait" ? (
          <div className="w-28 h-36 rounded-t-full rounded-b-xl p-1 bg-gradient-to-b from-gold-accent via-champagne to-powder-blue overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {src && (
              <img
                src={src}
                alt={`Current ${title}`}
                className="w-full h-full object-cover rounded-t-full rounded-b-lg"
              />
            )}
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl border border-powder-blue bg-powder-light flex items-center justify-center overflow-hidden shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {src ? (
              <img
                src={src}
                alt={`Current ${title}`}
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="text-xs text-slate-soft">None</span>
            )}
          </div>
        )}
        <div className="space-y-2">
          <label className="btn cursor-pointer w-fit">
            {uploading ? "Uploading…" : current ? "Replace" : "Upload"}
            <input
              type="file"
              accept={accept}
              hidden
              disabled={uploading}
              onChange={(e) => {
                upload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          {current && (
            <button type="button" onClick={remove} className="btn-danger block">
              Remove
            </button>
          )}
          <p className="text-xs text-slate-soft">{help}</p>
          {error && (
            <p role="alert" className="text-xs text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
