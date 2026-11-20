"use client";

import { useEffect, useMemo, useRef } from "react";
import { ImagePlus, X } from "lucide-react";

/** Select images locally with previews. Upload happens when the parent form submits. */
export function ImagePicker({ files, onChange, max = 6, label = "Add photos" }: { files: File[]; onChange: (f: File[]) => void; max?: number; label?: string }) {
  const input = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const add = (list: FileList | null) => {
    if (!list) return;
    const imgs = Array.from(list).filter((f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024);
    onChange([...files, ...imgs].slice(0, max));
    if (input.current) input.current.value = "";
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {files.map((f, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-navy-100 bg-navy-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previews[i]} alt="" className="h-full w-full object-cover" />
            <button type="button" onClick={() => onChange(files.filter((_, j) => j !== i))} className="absolute right-1 top-1 grid h-7 w-7 place-items-center rounded-full bg-navy-950/70 text-white" aria-label="Remove">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {files.length < max && (
          <button type="button" onClick={() => input.current?.click()} className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-navy-200 text-navy-400 transition hover:border-brand-400 hover:text-brand-500">
            <ImagePlus className="h-7 w-7" />
            <span className="text-xs font-semibold">{label}</span>
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => add(e.target.files)} />
      <p className="mt-2 text-xs text-navy-400">Up to {max} images · max 5 MB each</p>
    </div>
  );
}
