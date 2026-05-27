"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import type { UploadedFile } from "@/lib/firebase/types";

export function FileDrop({
  label,
  hint,
  value,
  onFile,
  uploading,
  error,
  accept = "image/*,application/pdf",
}: {
  label?: string;
  hint?: string;
  value?: UploadedFile;
  onFile: (file: File) => void;
  uploading?: boolean;
  error?: string;
  accept?: string;
}) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const isImage = value?.type?.startsWith("image/");

  function handleFiles(files: FileList | null) {
    if (files && files[0]) onFile(files[0]);
  }

  return (
    <div>
      {label && <div className="mb-1.5 text-sm font-medium text-navy-800">{label}</div>}

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-4 text-center transition-colors",
          drag ? "border-azure-500 bg-azure-500/5" : "border-navy-200 bg-white hover:border-navy-400",
          error && "border-rose-soft",
          value && !uploading && "border-solid border-emerald-soft/50 bg-emerald-soft/5",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <>
            <Loader2 className="size-7 animate-spin text-azure-500" />
            <span className="text-sm text-navy-500">{t.form.passport.uploading}</span>
          </>
        ) : value ? (
          <div className="flex w-full items-center gap-3 text-start">
            {isImage ? (
              <Image
                src={value.url}
                alt={value.name}
                width={56}
                height={56}
                className="size-14 rounded-lg object-cover"
                unoptimized
              />
            ) : (
              <div className="grid size-14 place-items-center rounded-lg bg-navy-50">
                <FileText className="size-6 text-navy-500" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-sm font-medium text-navy-900">
                <CheckCircle2 className="size-4 text-emerald-soft" />
                <span className="truncate">{value.name}</span>
              </div>
              <span className="text-xs text-navy-400">{t.form.passport.replace}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid size-11 place-items-center rounded-full bg-navy-50">
              <UploadCloud className="size-5 text-navy-500" />
            </div>
            <span className="text-sm font-medium text-navy-700">{t.form.passport.dropHere}</span>
            {hint && <span className="text-xs text-navy-400">{hint}</span>}
          </>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-soft">{error}</p>}
    </div>
  );
}
