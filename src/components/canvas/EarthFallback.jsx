
export default function EarthFallback() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-65 sm:max-w-85 md:max-w-110"
    >
      <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl" />
      <div
        className="absolute inset-[6%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, #38bdf8 0%, #2563eb 38%, #0b1530 72%, #050a18 100%)",
          boxShadow:
            "0 0 80px rgba(56,189,248,0.35), inset -30px -30px 60px rgba(0,0,0,0.65), inset 12px 12px 40px rgba(56,189,248,0.25)",
        }}
      />
      <div className="absolute inset-[3%] rounded-full border border-glow/20" />
    </div>
  );
}