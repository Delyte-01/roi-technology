# ROI Technology, Next.js 16 starter

Next.js 16 (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui + GSAP + Lenis.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

Other scripts: `npm run build`, `npm start`, `npm run typecheck`.

## What's included

- **shadcn/ui components** (in `src/components/ui`): button, card, badge, input, textarea, label, separator, accordion, tabs, slider, sheet.
  Add more any time: `npx shadcn@latest add dialog dropdown-menu ...` (`components.json` is already set up).
- **Lenis smooth scroll**: `src/components/providers/smooth-scroll.tsx`, synced to GSAP's ticker and ScrollTrigger. Turned off for visitors who prefer reduced motion.
- **GSAP**: import everything from `@/lib/gsap` (`gsap`, `ScrollTrigger`, `useGSAP`). Examples: hero load sequence in `sections/hero.tsx`, scroll-scrubbed timeline in `sections/steps.tsx`.
- **Light theme, purple primary**: colors are CSS variables in `src/app/globals.css`.
  Emerald (`profit`) marks positive results, rose (`leak`) marks losses. Change `--primary` to re-brand the whole site.
- **No backend**: the contact form builds a WhatsApp message in the browser.

## Edit first

Open `src/lib/site.ts` and replace the placeholder phone, WhatsApp number, email and company name.
The calculator's leak rate (18%) is a single constant at the top of `sections/calculator.tsx`.

## Structure

```
src/
  app/            layout, page, globals.css (theme)
  components/
    ui/           shadcn components
    sections/     header, hero, problem, steps, calculator, services, faq, contact, footer
    providers/    smooth-scroll (Lenis)
  lib/            utils (cn), gsap (plugin setup), site (your details)
```
