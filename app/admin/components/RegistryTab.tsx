import {
  supabase,
  CATEGORIES,
  type Claim,
  type Item,
  type Run,
} from "@/lib/supabase";
import { useState } from "react";
export default function RegistryTab({
  items,
  claims,
  run,
}: {
  items: Item[];
  claims: Claim[];
  run: Run;
}) {
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const filteredItems =
    categoryFilter === "All"
      ? items
      : items.filter((item) => item.category === categoryFilter);

  function getSiteAssetPath(url: string | null) {
    const marker = "/storage/v1/object/public/site-assets/";
    const markerIndex = url?.indexOf(marker) ?? -1;
    if (markerIndex < 0 || !url) return null;
    return url.slice(markerIndex + marker.length).split("?")[0];
  }

  async function removeClaim(c: Claim) {
    const it = items.find((i) => i.id === c.item_id);
    if (!it) return;
    await run(supabase.from("gift_claims").delete().eq("id", c.id));
    await run(
      supabase
        .from("wishlist_items")
        .update({ covered: Math.max(0, it.covered - c.qty) })
        .eq("id", it.id),
    );
  }

  async function removeItem(item: Item) {
    if (!confirm("Delete this item and its reservations?")) return;
    const deleted = await run(
      supabase.from("wishlist_items").delete().eq("id", item.id),
    );
    if (!deleted) return;

    const path = getSiteAssetPath(item.image_url);
    if (!path) return;
    const { error } = await supabase.storage.from("site-assets").remove([path]);
    if (error) await run(Promise.resolve({ error }));
  }

  async function addItem(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setImageError("");
    setUploadingImage(true);
    let uploadedPath: string | null = null;
    let imageUrl = editingItem?.image_url ?? null;

    if (selectedImage) {
      if (!selectedImage.type.startsWith("image/")) {
        setImageError("Please choose an image file.");
        setUploadingImage(false);
        return;
      }
      if (selectedImage.size > 5 * 1024 * 1024) {
        setImageError("Image must be 5 MB or smaller.");
        setUploadingImage(false);
        return;
      }

      uploadedPath = `registry/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}-${selectedImage.name.replace(/[^\w.-]/g, "_")}`;
      const upload = await supabase.storage
        .from("site-assets")
        .upload(uploadedPath, selectedImage);
      if (upload.error) {
        setImageError(upload.error.message);
        setUploadingImage(false);
        return;
      }
      imageUrl = supabase.storage
        .from("site-assets")
        .getPublicUrl(uploadedPath).data.publicUrl;
    }

    const values = {
      name: f.get("name"),
      category: f.get("category"),
      description: f.get("description"),
      price_range: f.get("price"),
      shop_link: f.get("shopLink") || null,
      needed: +(f.get("needed") as string) || 1,
      image_url: imageUrl,
    };
    const saved = editingItem
      ? await run(
        supabase
          .from("wishlist_items")
          .update(values)
          .eq("id", editingItem.id),
        "Item updated",
      )
      : await run(
        supabase.from("wishlist_items").insert(values),
        "Item added",
      );
    if (!saved) {
      if (uploadedPath) {
        const { error } = await supabase.storage
          .from("site-assets")
          .remove([uploadedPath]);
        if (error) setImageError(error.message);
      }
      setUploadingImage(false);
      return;
    }

    if (selectedImage && editingItem) {
      const oldPath = getSiteAssetPath(editingItem.image_url);
      if (oldPath) {
        const { error } = await supabase.storage
          .from("site-assets")
          .remove([oldPath]);
        if (error) setImageError(error.message);
      }
    }
    setUploadingImage(false);
    setSelectedImage(null);
    setEditingItem(null);
    form.reset();
  }
  return (
    <>
      <form
        key={editingItem?.id ?? "new-item"}
        onSubmit={addItem}
        className="bg-white p-5 rounded-2xl border border-powder-blue grid sm:grid-cols-2 gap-3"
      >
        <h2 className="heading text-lg sm:col-span-2">
          {editingItem ? "Edit a need" : "Add a need"}
        </h2>
        <label className="btn cursor-pointer w-fit">
          {selectedImage ? "Replace selected image" : "Upload item image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            disabled={uploadingImage}
            onChange={(e) => {
              setSelectedImage(e.target.files?.[0] ?? null);
              setImageError("");
              e.target.value = "";
            }}
          />
        </label>
        <div className="text-sm text-slate-soft">
          {selectedImage
            ? selectedImage.name
            : editingItem?.image_url
              ? "Current image will be kept unless replaced."
              : "No image selected."}
          <p className="text-xs">Upload item image (up to 5 MB).</p>
        </div>
        <input
          name="name"
          required
          placeholder="Item name"
          className="input"
          defaultValue={editingItem?.name ?? ""}
        />
        <select
          name="category"
          className="input"
          defaultValue={editingItem?.category ?? CATEGORIES[0]}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          name="price"
          placeholder="Price range (~$30 - $50)"
          className="input"
          defaultValue={editingItem?.price_range ?? ""}
        />
        <input
          name="shopLink"
          type="text"
          placeholder="Shop Link"
          className="input"
          defaultValue={editingItem?.shop_link ?? ""}
        />
        <input
          name="needed"
          type="number"
          min={1}
          defaultValue={editingItem?.needed ?? 1}
          className="input"
        />
        <input
          name="description"
          placeholder="Short description"
          className="input"
          defaultValue={editingItem?.description ?? ""}
        />
        <button className="btn sm:col-span-2" disabled={uploadingImage}>
          {uploadingImage
            ? "Saving…"
            : editingItem
              ? "Update Item"
              : "Add item"}
        </button>
        {imageError && (
          <p role="alert" className="text-sm text-red-600 sm:col-span-2">
            {imageError}
          </p>
        )}
      </form>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="registry-category-filter" className="text-sm font-medium">
          Filter by category
        </label>
        <select
          id="registry-category-filter"
          className="input w-fit"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {filteredItems.map((i) => (
        <div
          key={i.id}
          className="p-4 rounded-2xl border border-powder-blue bg-white space-y-2"
        >
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <b className="text-sm">{i.name}</b>{" "}
              <span className="text-xs px-2 py-0.5 rounded-full bg-powder-light">
                {i.category}
              </span>
              <p className="text-xs text-slate-soft">
                Needed {i.needed} · Covered {i.covered}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-soft"
                onClick={() => {
                  setEditingItem(i);
                  setSelectedImage(null);
                  setImageError("");
                }}
              >
                Edit item
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => removeItem(i)}
              >
                Delete item
              </button>
            </div>
          </div>
          {claims
            .filter((c) => c.item_id === i.id)
            .map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap justify-between items-center gap-2 p-2 bg-ivory rounded-lg border border-gold-accent/30 text-xs"
              >
                <span>
                  <b>{c.guest_name}</b> ({c.qty}x) · {c.contact}
                  {c.note && ` · “${c.note}”`}
                </span>
                <button className="btn-soft" onClick={() => removeClaim(c)}>
                  Remove
                </button>
              </div>
            ))}
        </div>
      ))}
      {!filteredItems.length && (
        <p className="text-sm italic text-slate-soft">
          {items.length
            ? "No items in this category."
            : "No registry items yet."}
        </p>
      )}
    </>
  );
}
