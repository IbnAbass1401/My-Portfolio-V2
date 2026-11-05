import { siteConfig, hero } from "./index";

// url: null means "not added yet": shown as a yellow box in dev, hidden in production.
export const contact = {
  eyebrow: "Contact",
  title: "Let's work together",
  text: "Have a project in mind, or want to team up? Send me a message and I'll get back to you.",
  links: [
    { id: "github", label: "GitHub", url: siteConfig.github, external: true },
    { id: "x", label: "X", url: "https://x.com/tan_codez", external: true },
    { id: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/abass1401", external: true },
    { id: "email", label: "Email", url: `mailto:${siteConfig.email}` },
    { id: "whatsapp", label: "WhatsApp", url: "https://wa.me/2349068253311", external: true },
    { id: "cv", label: "Download CV", url: hero.cvPath, download: true },
  ],
};