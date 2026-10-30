"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/types";

export default function ContactSection({ settings }: { settings: SiteSettings }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const number = settings.contactWhatsapp.replace(/\D/g, "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!number) return;

    const finalName = name.trim() || "Nama Kamu";
    const finalPhone = phone.trim() ? ` Nomor kontak: ${phone.trim()}.` : "";
    const finalMessage = message.trim() || "halo saya ingin konsultasi pembuatan video komersial";
    const text = `Halo ${settings.brandName}, saya ${finalName}.${finalPhone} Pesan: ${finalMessage}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <section id="contact" className="w-full border-t border-white/5 bg-dark px-6 py-24 md:px-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-12 text-center">
          <span className="mb-3 block font-display text-xs uppercase tracking-[0.4em] text-neonMagenta">
            Hubungi Saya
          </span>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wider text-white md:text-4xl">
            Mulai Proyek
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 font-body text-sm text-white">
          <div>
            <label htmlFor="contact-name" className="mb-2 block text-[10px] uppercase tracking-widest text-gray-500">
              Nama
            </label>
            <input
              id="contact-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full border-b border-white/20 bg-[#121212] p-4 outline-none transition focus:border-neonCyan"
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className="mb-2 block text-[10px] uppercase tracking-widest text-gray-500">
              Nomor WhatsApp
            </label>
            <input
              id="contact-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full border-b border-white/20 bg-[#121212] p-4 outline-none transition focus:border-neonCyan"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-2 block text-[10px] uppercase tracking-widest text-gray-500">
              Pesan
            </label>
            <textarea
              id="contact-message"
              rows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
              className="w-full resize-none border-b border-white/20 bg-[#121212] p-4 outline-none transition focus:border-neonCyan"
            />
          </div>

          <button
            type="submit"
            disabled={!number}
            className="w-full bg-white py-4 text-xs font-bold uppercase tracking-widest text-black transition duration-300 hover:bg-neonCyan disabled:cursor-not-allowed disabled:opacity-50"
          >
            Kirim Pesan <i className="fa-brands fa-whatsapp ml-2" aria-hidden="true" />
          </button>

          {!number ? (
            <p className="text-center text-[11px] text-gray-500">
              Nomor WhatsApp belum diatur di dashboard.
            </p>
          ) : null}

          <div className="flex flex-wrap justify-center gap-6 pt-4 text-[11px] uppercase tracking-[0.2em] text-gray-500">
            {settings.contactEmail ? (
              <a href={`mailto:${settings.contactEmail}`} className="hover:text-neonCyan">
                {settings.contactEmail}
              </a>
            ) : null}
            {settings.contactPhone ? <span>{settings.contactPhone}</span> : null}
          </div>
        </form>
      </div>
    </section>
  );
}
