import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { contact } from "../constants/contact";
import { siteConfig } from "../constants";
import SectionHeading from "./SectionHeading";

const field =
  "mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-bg px-4 py-3 text-base text-ink placeholder:text-muted/60 transition duration-300 focus:border-glow focus:outline-none focus:shadow-[0_0_18px_rgba(56,189,248,0.35)]";

const chip =
  "inline-flex min-h-11 items-center rounded-full border px-5 text-sm font-semibold transition duration-300";

const EMPTY = { name: "", email: "", message: "", company: "" }; 

export default function Contact() {
  const dev = import.meta.env.DEV;
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); 
  const [error, setError] = useState("");

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus("error");
      setError("Please fill in your name, email and message.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setError("That email address doesn't look right.");
      return;
    }
    if (message.length < 10) {
      setStatus("error");
      setError("Please write a little more in your message.");
      return;
    }
    if (form.company) {
      setStatus("success");
      setForm(EMPTY);
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) {
      setStatus("error");
      setError(`The form isn't connected yet. Please email me at ${siteConfig.email}.`);
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const emailjs = (await import("@emailjs/browser")).default; 
      await emailjs.send(
        serviceId,
        templateId,
        { from_name: name, reply_to: email, message },
        { publicKey }
      );
      setStatus("success");
      setForm(EMPTY);
    } catch {
      setStatus("error");
      setError(`Something went wrong. Please try again, or email me at ${siteConfig.email}.`);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <section id="contact" className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]"
        />

        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={contact.eyebrow} title={contact.title} />

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            {/* left: text + links */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <p className="max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                {contact.text}
              </p>

              <ul className="mt-8 flex flex-wrap gap-3">
                {contact.links.map((l) => {
                  if (!l.url) {
                    return dev ? (
                      <li
                        key={l.id}
                        className={`${chip} border-dashed border-star/60 bg-star/5 text-star`}
                      >
                        ✎ {l.hint}
                      </li>
                    ) : null;
                  }
                  return (
                    <li key={l.id}>
                      <a
                        href={l.url}
                        {...(l.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        {...(l.download ? { download: true } : {})}
                        className={`${chip} border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-glow/60 hover:text-glow hover:shadow-[0_0_22px_rgba(56,189,248,0.3)]`}
                      >
                        {l.label}
                        {l.external ? " ↗" : l.download ? " ↓" : ""}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* right: form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="rounded-2xl border border-line bg-surface p-6 sm:p-8"
            >
              {status === "success" ? (
                <div role="status" className="py-8 text-center">
                  <div
                    aria-hidden="true"
                    className="mx-auto flex size-14 items-center justify-center rounded-full bg-glow/15 text-2xl text-glow shadow-[0_0_28px_rgba(56,189,248,0.35)]"
                  >
                    ✓
                  </div>
                  <h3 className="mt-5 text-xl font-bold">Message sent</h3>
                  <p className="mt-2 text-sm text-muted">
                    Thanks for reaching out. I'll reply to the email you gave me.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-6 min-h-11 rounded-full border border-line px-5 text-sm font-semibold transition hover:border-glow/60 hover:text-glow"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="grid gap-5">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium">
                      Your name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={update}
                      maxLength={80}
                      placeholder="Your full name"
                      className={field}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-sm font-medium">
                      Your email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={update}
                      maxLength={120}
                      placeholder="you@example.com"
                      className={field}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={update}
                      maxLength={2000}
                      placeholder="Tell me about your project"
                      className={`${field} resize-y`}
                    />
                  </div>

                  {/* spam trap: real people never see or fill this */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.company}
                      onChange={update}
                    />
                  </div>

                  <div aria-live="polite" role="status" className="min-h-5">
                    {status === "error" && (
                      <p className="text-sm text-red-400">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="min-h-12 rounded-full bg-primary px-6 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(56,189,248,0.55)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}