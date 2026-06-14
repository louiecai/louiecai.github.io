# louiecai.com

Personal portfolio site for Louie Cai. Built with Vite 8, React 19, TypeScript, and Tailwind CSS. Deployed to GitHub Pages via GitHub Actions.

## Stack

- **Vite 8** + **React 19** + **TypeScript 5**
- **Tailwind CSS 3** — design tokens in `tailwind.config.js`
- **Framer Motion** — all scroll/cursor effects
- **Vitest** + **@testing-library/react** — 66 tests across 25 files

## Project structure

```
src/
├── components/        # UI components (one file per component + *.test.tsx)
│   ├── Hero.tsx       # Landing section
│   ├── Nav.tsx        # Sticky nav with active-section tracking
│   ├── Section.tsx    # Reusable section wrapper (title + divider animation)
│   ├── Experience.tsx / Projects.tsx / Skills.tsx / Activities.tsx / Education.tsx
│   ├── Footer.tsx
│   ├── AuroraBackground.tsx   # Ambient background blobs (CSS animation)
│   ├── CursorSpotlight.tsx    # Radial glow that follows the cursor
│   ├── ParticleField.tsx      # Canvas particle system
│   ├── ScrollRail.tsx         # Left-edge scroll progress rail + section dots
│   ├── CountUp.tsx            # Animated number count-up on scroll into view
│   ├── DecodeText.tsx         # Scramble-in heading animation
│   ├── MagneticButton.tsx     # Cursor-attracted button wrapper
│   ├── TiltCard.tsx           # 3D perspective tilt on hover
│   └── Logo.tsx               # < LC > bracket logo
├── data/
│   └── profile.ts     # All site content (experience, projects, skills, etc.)
├── hooks/
│   ├── useActiveSection.ts      # IntersectionObserver — which section is in view
│   ├── useMagnetic.ts           # Mouse-tracking for MagneticButton
│   ├── useTilt.ts               # Mouse-tracking for TiltCard
│   └── usePrefersReducedMotion.ts
├── lib/
│   ├── sections.ts    # SECTION_IDS and labels (shared by Nav + ScrollRail)
│   └── variants.ts    # Shared Framer Motion animation variants
├── test/
│   └── setup.ts       # Vitest setup: mocks framer-motion, canvas, matchMedia
└── index.css          # Tailwind base + custom keyframes (aurora, sheen)

public/
├── resume.pdf         # Generated from /Documents/resume.md — see below
├── CNAME              # louiecai.com
└── favicon.svg / favicon.ico / profile.jpg
```

## Content

All site content lives in **`src/data/profile.ts`**. Edit that file to update experience, projects, skills, education, and social links — everything else renders from it.

## Resume

The resume PDF is generated separately from [`~/Documents/resume.md/`](https://github.com/mikepqr/resume.md):

```bash
cd ~/Documents/resume.md
# edit resume.md, then:
python3 resume.py
cp resume.pdf ~/Documents/louiecai.com/public/resume.pdf
```

## Development

```bash
npm install
npm run dev       # dev server at localhost:5173
npm test          # run all tests
npm run build     # production build → dist/
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and deploys to GitHub Pages automatically.
