import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import { navLinks } from "./constants";

export default function App() {
  return (
    <div id="top">
      <Navbar />
      <main id="main">
        <Hero />
        {/* temporary placeholders, replaced one by one in the next steps */}
        {navLinks.map((l) => (
          <section
            key={l.id}
            id={l.id}
            className="flex min-h-screen items-center justify-center border-t border-line/40 px-5"
          >
            <h2 className="text-2xl font-bold text-muted">
              {l.label} <span className="text-glow">(placeholder)</span>
            </h2>
          </section>
        ))}
      </main>
    </div>
  );
}