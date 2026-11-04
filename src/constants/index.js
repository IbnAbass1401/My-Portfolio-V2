// All site content lives here as data. Components only render it.

export const siteConfig = {
  name: "Al-ameen Abass",
  logo: "TAN",
  email: "alameenolamideabass@gmail.com",
  github: "https://github.com/IbnAbass1401",
};

export const navLinks = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
];

export const hero = {
  greeting: "Hello, I'm",
  name: "Al-ameen Abass",
  roles: [
    "Full-Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Problem Solver",
  ],
  pitch:
    "I build fast, responsive web apps from the interface to the API and the database, and I ship them live.",
  availability: "Available for freelance work",
  cvPath: "/CV.pdf",
};

export const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express",
  "MongoDB",
  "Tailwind",
  "JavaScript",
  "Git",
  "Vercel",
  "Render",
  "REST APIs",
  "JWT",
  "Paystack",
];

export const about = {
  eyebrow: "About me",
  title: "Full-Stack Developer | From Idea to Deployment.",
  paragraphs: [
    "I'm a self-taught full-stack developer, passionate about building practical, scalable web applications. I work with React and JavaScript on the frontend, alongside Node.js, Express, and MongoDB on the backend. I also use Next.js and TypeScript to build more robust and modern applications.",
    "I take a product all the way through: planning, responsive interfaces, REST APIs with authentication, database design, payments, and deployment on Vercel and Render.",
    "My work is live and clickable, so you can judge it yourself.",
  ],
  stats: [
    { value: "100%", label: "Projects deployed" },
    { value: "Full-Stack", label: "UI, API & database" },
    { value: "6", label: "Core services" },
  ],
};

export const services = {
  eyebrow: "Services",
  title: "What I can build for you",
  items: [
    {
      icon: "🎨",
      title: "Frontend Development",
      text: "Pixel-accurate, responsive interfaces in React, Next.js and Tailwind, with smooth animations.",
    },
    {
      icon: "⚙️",
      title: "Backend Development",
      text: "REST APIs with Node and Express, JWT auth, validation and clean architecture.",
    },
    {
      icon: "🧩",
      title: "Full-Stack Apps",
      text: "End-to-end products: stores, dashboards, task tools, listings and more.",
    },
    {
      icon: "🌐",
      title: "Web Development",
      text: "Business sites and landing pages that load fast and look sharp on any phone.",
    },
    {
      icon: "🗄️",
      title: "Database Design",
      text: "MongoDB schemas, relationships and ownership rules that scale cleanly.",
    },
    {
      icon: "🚀",
      title: "Deployment & Fixes",
      text: "Shipping to Vercel and Render, bug fixing, performance and responsive tuning.",
    },
  ],
};

// caseStudy rows: write your own text, or leave null.
// null rows show as a yellow "add yours" box in dev and are hidden in production.
export const projects = {
  eyebrow: "Selected work",
  title: "Projects I've built and shipped",
  items: [
    {
      id: "ember",
      title: "Ember",
      description:
        "A full-stack men's fashion store: browse, pick a size, check out and pay, with an admin area to run it.",
      image: "/projects/ember.png",
      tags: ["Next.js", "TypeScript", "Tailwind", "Express", "MongoDB", "Paystack", "Cloudinary"],
      live: "https://ember-menswear.vercel.app",
      code: "https://github.com/IbnAbass1401/Ember-menswear",
      note: "The API runs on a free Render plan, so the first load can take up to a minute.",
      caseStudy: {
        problem: null,
        role: "Built the full stack: the Next.js and TypeScript storefront, the Express API, MongoDB data, Paystack payments and Cloudinary image uploads, deployed on Vercel and Render.",
        stack:
          "Next.js, TypeScript, Tailwind CSS, Framer Motion, Zustand, Node.js, Express, MongoDB, Paystack, Cloudinary",
        challenge: null,
        solution: null,
      },
    },
    {
      id: "taskflow",
      title: "Taskflow",
      description:
        "A MERN task manager where every user has a private board. Tasks move through Pending, In Progress and Completed, with priorities, JWT auth and a profile page.",
      image: "/projects/taskflow.png",
      tags: ["React", "Vite", "Tailwind", "Node.js", "Express", "MongoDB", "JWT"],
      live: "https://taskflow-vit.vercel.app",
      code: "https://github.com/IbnAbass1401/Taskflow",
      note: null,
      caseStudy: {
        problem: null,
        role: "Built the full stack: the React interface, the Express REST API, MongoDB models and JWT authentication.",
        stack:
          "React (Vite), React Router, Axios, Tailwind CSS, Node.js, Express, MongoDB with Mongoose, JWT, bcryptjs, Vercel",
        challenge: null,
        solution: null,
      },
    },
    {
      id: "carhaven",
      title: "Car Haven",
      description:
        "A dark, purple-accented car listings app: browse cars, open a full listing, add a car with a photo from your device, edit it or delete it.",
      image: "/projects/carhaven.png",
      tags: ["React", "Vite", "Tailwind", "React Router", "json-server"],
      live: "https://car-haven-sandy.vercel.app",
      code: "https://github.com/IbnAbass1401/Car-Haven",
      note: "The API runs on a free Render plan, so the first load can take up to a minute.",
      caseStudy: {
        problem: null,
        role: null, // write what YOU added beyond the guided build
        stack:
          "React, Vite, React Router, Tailwind CSS, React Icons, React Toastify, json-server, Vercel, Render",
        challenge: null,
        solution: null,
      },
    },
  ],
};