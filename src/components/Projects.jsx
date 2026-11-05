import { MotionConfig } from "framer-motion";
import { projects } from "../constants";
import SectionHeading from "./SectionHeading";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="work" className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow={projects.eyebrow} title={projects.title} />

          {/* one project per row */}
          <ul className="mt-12 grid gap-8">
            {projects.items.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </ul>
        </div>
      </section>
    </MotionConfig>
  );
}