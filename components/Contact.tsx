// components/Contact.tsx
'use client';

import React, { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const PHONE_NUMBER = "6282112628113";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi nilai teks alternatif jika input dikosongkan oleh pengguna
    const finalName = name.trim() || 'Nama Kamu';
    const finalPhone = phone.trim() ? ` Nomor kontak: ${phone.trim()}.` : '';
    const finalMessage = message.trim() || 'halo saya ingin konsultasi pembuatan video komersial';

    const text = `Halo Jhilan, saya ${finalName}.${finalPhone} Pesan: ${finalMessage}`;
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedText}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="contact" className="w-full bg-dark py-24 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <span className="font-display text-xs tracking-[0.4em] text-neonMagenta uppercase mb-3 block">
            Get In Touch
          </span>
          <h2 className="font-display text-2xl md:text-4xl font-bold tracking-wider uppercase text-white">
            Start A Project
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 font-body text-sm text-white">
          {/* Input Nama */}
          <div>
            <label htmlFor="name" className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama Kamu"
              required
              className="w-full bg-[#121212] border-b border-white/20 p-4 outline-none focus:border-neonCyan transition"
            />
          </div>

          {/* Input Nomor Telepon */}
          <div>
            <label htmlFor="phone" className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="089xxx"
              className="w-full bg-[#121212] border-b border-white/20 p-4 outline-none focus:border-neonCyan transition"
            />
          </div>

          {/* Input Detail Pesan */}
          <div>
            <label htmlFor="message" className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="halo saya ingin konsultasi pembuatan video komersial"
              required
              rows={4}
              className="w-full bg-[#121212] border-b border-white/20 p-4 outline-none focus:border-neonCyan transition resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neonCyan hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition duration-300"
          >
            Send Message <i className="fa-brands fa-whatsapp ml-2"></i>
          </button>
        </form>
      </div>
    </section>
  );
}