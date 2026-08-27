"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { FABRICS, SIZES, SPORTS } from "@/lib/site";

type Category = { id: string; name: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  description: string;
  categoryId: string;
  images: string[];
  fabrics: string[];
  sizes: string[];
  sports: string[];
  price: number | null;
  moq: number;
  sku: string;
  featured: boolean;
  published: boolean;
};

const EMPTY: ProductFormValues = {
  name: "",
  description: "",
  categoryId: "",
  images: [],
  fabrics: [],
  sizes: [...SIZES],
  sports: [],
  price: null,
  moq: 1,
  sku: "",
  featured: false,
  published: true,
};

export function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Partial<ProductFormValues>;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [v, setV] = useState<ProductFormValues>({
    ...EMPTY,
    categoryId: categories[0]?.id ?? "",
    ...initial,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setV((prev) => ({ ...prev, [key]: value }));
  }

  function toggle(key: "fabrics" | "sizes" | "sports", item: string) {
    setV((prev) => {
      const has = prev[key].includes(item);
      return { ...prev, [key]: has ? prev[key].filter((x) => x !== item) : [...prev[key], item] };
    });
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setV((prev) => ({ ...prev, images: [...prev.images, data.url] }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeImage(url: string) {
    set("images", v.images.filter((i) => i !== url));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(isEdit ? `/api/products/${initial!.id}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, price: v.price === null || Number.isNaN(v.price) ? null : Number(v.price) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="card p-6">
          <h2 className="mb-4 font-display font-bold">Basics</h2>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="name">Product name *</label>
              <input id="name" required value={v.name} onChange={(e) => set("name", e.target.value)} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="desc">Description</label>
              <textarea id="desc" rows={4} value={v.description} onChange={(e) => set("description", e.target.value)} className="input resize-none" />
            </div>
            <div>
              <label className="label" htmlFor="cat">Category *</label>
              <select id="cat" required value={v.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="input">
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-display font-bold">Images</h2>
          <div className="flex flex-wrap gap-3">
            {v.images.map((url) => (
              <div key={url} className="group relative h-24 w-24 overflow-hidden rounded-xl border border-ink-200 dark:border-ink-700">
                <Image src={url} alt="" fill className="object-cover" />
                <button type="button" onClick={() => removeImage(url)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100">×</button>
              </div>
            ))}
            <label className="grid h-24 w-24 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-ink-300 text-center text-xs text-ink-500 hover:border-flame-500 dark:border-ink-600">
              {uploading ? "Uploading…" : "+ Upload"}
              <input type="file" accept="image/*" multiple onChange={onUpload} className="hidden" disabled={uploading} />
            </label>
          </div>
          <p className="mt-2 text-xs text-ink-400">First image is used as the cover. Max 5MB each.</p>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-display font-bold">Attributes</h2>
          <ChipGroup label="Fabrics" options={FABRICS} selected={v.fabrics} onToggle={(x) => toggle("fabrics", x)} />
          <ChipGroup label="Sizes" options={SIZES} selected={v.sizes} onToggle={(x) => toggle("sizes", x)} />
          <ChipGroup label="Sports" options={SPORTS} selected={v.sports} onToggle={(x) => toggle("sports", x)} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        <div className="card space-y-4 p-6">
          <h2 className="font-display font-bold">Pricing & stock</h2>
          <div>
            <label className="label" htmlFor="price">Price ₹ / piece (optional)</label>
            <input id="price" type="number" min={0} value={v.price ?? ""} onChange={(e) => set("price", e.target.value === "" ? null : Number(e.target.value))} className="input" placeholder="Leave blank for quote-only" />
          </div>
          <div>
            <label className="label" htmlFor="moq">Minimum order qty</label>
            <input id="moq" type="number" min={1} value={v.moq} onChange={(e) => set("moq", Math.max(1, Number(e.target.value) || 1))} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="sku">SKU (optional)</label>
            <input id="sku" value={v.sku} onChange={(e) => set("sku", e.target.value)} className="input" />
          </div>
        </div>

        <div className="card space-y-3 p-6">
          <h2 className="font-display font-bold">Visibility</h2>
          <Toggle label="Published" checked={v.published} onChange={(c) => set("published", c)} />
          <Toggle label="Featured on home" checked={v.featured} onChange={(c) => set("featured", c)} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
          <button type="button" onClick={() => router.push("/admin/products")} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </form>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <span className="label">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onToggle(o)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              selected.includes(o)
                ? "border-flame-500 bg-flame-500 text-white"
                : "border-ink-200 text-ink-600 dark:border-ink-700 dark:text-ink-300"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (c: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-flame-500" : "bg-ink-300 dark:bg-ink-700"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}
