"use client";

import { useRef } from "react";
import "tinymce/tinymce";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default/icons";
import "tinymce/models/dom/model";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/table";
import "tinymce/plugins/code";
import "tinymce/skins/ui/oxide/skin.min.css";
import { Editor } from "@tinymce/tinymce-react";

export interface TinyEditorHandle {
  insertContent: (html: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
  onReady,
  onOpenMediaLibrary,
}: {
  value: string;
  onChange: (value: string) => void;
  onReady?: (handle: TinyEditorHandle) => void;
  onOpenMediaLibrary?: () => void;
}) {
  const handleRef = useRef<TinyEditorHandle | null>(null);

  return (
    <div className="overflow-hidden rounded-md border border-slate-300 bg-white">
      <Editor
        licenseKey="gpl"
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        init={{
          height: 460,
          menubar: false,
          branding: false,
          promotion: false,
          skin_url: "/tinymce/skins/ui/oxide",
          content_css: "/tinymce/skins/content/default/content.min.css",
          content_style: "body { font-family: Inter, system-ui, sans-serif; font-size: 14px; }",
          plugins: "lists link image table code",
          toolbar:
            "undo redo | blocks | bold italic underline | bullist numlist | alignleft aligncenter alignright | link unlink | medialib image table | code",
          convert_urls: false,
          relative_urls: false,
          remove_script_host: false,
          automatic_uploads: true,
          images_upload_handler: async (blobInfo) => {
            const body = new FormData();
            body.append("file", blobInfo.blob(), blobInfo.filename());
            const response = await fetch("/api/uploads", { method: "POST", body });
            const payload = await response.json().catch(() => null);
            if (!response.ok) {
              throw new Error(payload?.error?.message ?? "Upload gambar gagal");
            }
            return payload.data[0].url as string;
          },
          setup: (editor) => {
            handleRef.current = { insertContent: (html) => editor.insertContent(html) };
            if (onReady) onReady(handleRef.current);

            if (onOpenMediaLibrary) {
              editor.ui.registry.addButton("medialib", {
                icon: "gallery",
                tooltip: "Pilih dari Media Library",
                onAction: onOpenMediaLibrary,
              });
            }
          },
        }}
        value={value}
        onEditorChange={onChange}
      />
    </div>
  );
}
