import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import { navLinks } from "./constants";


const About = lazy(() => import("./components/About"));
const Services = lazy(() => import("./components/Services"));
const Projects = lazy(() => import("./components/Projects"));
const Timeline = lazy(() => import("./components/Timeline"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));
const ScrollProgress = lazy(() => import("./components/ScrollProgress"));
const CursorGlow = lazy(() => import("./components/CursorGlow"));


const heights = {
  about: "80svh",
  services: "100svh",
  work: "230svh",
  journey: "100svh",
  reviews: "80svh",
  contact: "100svh",
};

function Placeholders() {
  return navLinks
    .filter((l) => heights[l.id])
    .map((l) => (
      <section key={l.id} id={l.id} aria-hidden="true" style={{ minHeight: heights[l.id] }} />
    ));
}


function Mounted({ onMount }) {
  useEffect(() => {
    onMount();
  }, [onMount]);
  return null;
}

export default function App() {
  const [ready, setReady] = useState(() => window.location.hash.length > 1);
  const [synced, setSynced] = useState(0);
  const sentinel = useRef(null);

  useEffect(() => {
    if (ready) return;
    const go = () => setReady(true);
    const events = ["scroll", "wheel", "touchstart", "pointerdown", "keydown"];
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));

    let io;
    if ("IntersectionObserver" in window && sentinel.current) {
      io = new IntersectionObserver(([entry]) => entry.isIntersecting && go());
      io.observe(sentinel.current);
    } else {
      go();
    }
    return () => {
      events.forEach((e) => window.removeEventListener(e, go));
      io?.disconnect();
    };
  }, [ready]);

  const handleMounted = useCallback(() => {
    setSynced((n) => n + 1); // tells the navbar to watch the real sections
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView(); // land exactly on the clicked section
  }, []);

  return (
    <div id="top">
      <Navbar syncKey={synced} />
      <main id="main">
        <Hero />
        <Marquee />
        <div ref={sentinel} aria-hidden="true" className="h-px" />

        {ready ? (
          <Suspense fallback={<Placeholders />}>
            <About />
            <Services />
            <Projects />
            <Timeline />
            <Testimonials />
            <Contact />
            <Mounted onMount={handleMounted} />
          </Suspense>
        ) : (
          <Placeholders />
        )}
      </main>

      {ready && (
        <Suspense fallback={null}>
          <Footer />
          <ScrollProgress />
          <CursorGlow />
        </Suspense>
      )}
    </div>
  );
}