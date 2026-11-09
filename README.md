<div align="center">

# TAN | Al-ameen Abass

**Full-stack developer portfolio. Dark, glowing, fast.**

[Live site](https://al-ameenabass.vercel.app/) · [GitHub](https://github.com/IbnAbass1401) · [X](https://x.com/tan_codez) · [LinkedIn](https://www.linkedin.com/in/abass1401)

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white)

</div>

---

## About

My personal portfolio. It shows what I build (full-stack MERN apps), the services I offer, selected projects with case studies, my journey, and how to reach me.

## Features

- "Midnight Glow" dark blue theme with glow, hover effects and scroll animations
- Typing-effect hero that cycles through my roles
- Tech marquee, services grid and selected work cards
- Expandable case study for each project
- Journey timeline and testimonials
- Contact form powered by EmailJS
- Downloadable CV
- Responsive on phones, tablets and desktop
- SEO ready: meta tags, Open Graph and Twitter cards, structured data

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | React + Vite |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Contact form | EmailJS |
| Hosting | Vercel |

## Getting Started

```bash
git clone https://github.com/IbnAbass1401/<REPO_NAME>.git
cd <REPO_NAME>
npm install
npm run dev
```

Open the local URL shown in the terminal.

### Environment variables

Create a `.env` file in the project root:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the build locally |

## Project Structure

```
public/          CV.pdf, favicon.svg, og-image.png, images
src/
  components/    Navbar, Hero, Marquee, About, Services,
                 Projects, Timeline, Testimonials, Contact, Footer
  constants/     index.js (all site content as data)
  hooks/         custom hooks (e.g. useTyping)
  App.jsx
  main.jsx
  index.css
```

All content (projects, case studies, services, journey) lives in `src/constants/index.js`, so updating the site never means touching components.

## Featured Projects

| Project | What it is | Links |
| --- | --- | --- |
| **Taskflow** | MERN task manager: auth, per-user tasks, profile, password reset | [Live](https://taskflow-xi-orcin-90.vercel.app) · [Code](https://github.com/IbnAbass1401/Taskflow) |
| **remoteHunt** | Remote job listings app (React + Tailwind) | [Live](<LINK>) · [Code](<LINK>) |
| **Car Haven** | Car listings app (React + Vite) | [Live](<LINK>) · [Code](<LINK>) |

## Deployment

Hosted on Vercel. Push to `main` and it redeploys automatically. Add the three `VITE_EMAILJS_*` variables in the Vercel project settings.

## Contact

- Email: alameenolamideabass@gmail.com
- GitHub: [IbnAbass1401](https://github.com/IbnAbass1401)
- X: [@tan_codez](https://x.com/tan_codez)
- LinkedIn: [abass1401](https://www.linkedin.com/in/abass1401)

## License

© 2026 Al-ameen Abass. Code is open for reference. Please don't copy the design or content and pass it off as your own.