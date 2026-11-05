import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Timeline from "./components/Timeline";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import CursorGlow from "./components/CursorGlow";

export default function App() {
  return (
    <div id="top">
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Projects />
        <Timeline />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}