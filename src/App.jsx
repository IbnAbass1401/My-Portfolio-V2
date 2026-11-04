export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-extrabold tracking-[0.2em] bg-gradient-to-r from-glow to-primary bg-clip-text text-transparent">
        TAN
      </h1>
      <div className="rounded-2xl border border-line bg-surface p-6 text-muted shadow-[0_0_30px_rgba(56,189,248,0.25)]">
        Theme check: navy background, blue border, soft cyan glow.
      </div>
      <button className="min-h-11 rounded-full bg-primary px-6 font-semibold text-white transition hover:shadow-[0_0_24px_rgba(56,189,248,0.6)]">
        Hover me
      </button>
    </main>
  );
}