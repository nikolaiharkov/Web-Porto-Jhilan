"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import MediaPicker from "@/components/dashboard/media-picker";

const RichTextEditor = dynamic(() => import("@/components/dashboard/rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="rounded-md border border-slate-300 bg-slate-50 p-4 text-xs text-slate-500">
      Memuat editor…
    </div>
  ),
});

export default function ArticleEditor({
  name,
  defaultValue,
  label = "Isi artikel",
}: {
  name: string;
  defaultValue: string;
  label?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [pickerOpen, setPickerOpen] = useState(false);
  const editorRef = useRef<{ insertContent: (html: string) => void } | null>(null);

  return (
    <div>
      <label className="mb-1 block text-xs text-slate-600">{label}</label>
      <input type="hidden" name={name} value={value} />
      <RichTextEditor
        value={value}
        onChange={setValue}
        onReady={(editor) => {
          editorRef.current = editor;
        }}
        onOpenMediaLibrary={() => setPickerOpen(true)}
      />
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(media) => {
          editorRef.current?.insertContent(`<img src="${media.url}" alt="${media.originalName}" />`);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
