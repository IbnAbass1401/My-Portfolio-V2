import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import { navLinks } from "./constants";

const built = ["about"];

export default function App() {
  return (
    <div id="top">
      <Navbar />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        {navLinks
          .filter((l) => !built.includes(l.id))
          .map((l) => (
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