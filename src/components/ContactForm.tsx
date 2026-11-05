"use client";

import { useState } from "react";
import type { Dict } from "@/lib/i18n";

export default function ContactForm({ dict }: { dict: Dict }) {
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    form.reset();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-zinc-200 rounded-xl p-8 text-center text-zinc-600">
        {dict.contact.sent}
      </div>
    );
  }

  const input =
    "w-full border border-zinc-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input name="name" required placeholder={dict.contact.name} className={input} />
      <input name="email" type="email" required placeholder={dict.contact.email} className={input} />
      <input name="phone" placeholder={dict.contact.phone} className={input} />
      <textarea
        name="message"
        required
        rows={5}
        placeholder={dict.contact.message}
        className={input}
      />
      <button
        type="submit"
        className="bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-3 rounded-lg"
      >
        {dict.contact.send}
      </button>
    </form>
  );
}
