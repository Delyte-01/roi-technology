"use client";

import { useRef, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

/* Inline stroke icons (24px grid) so no icon library is required. */
function Icon({
  children,
  className = "size-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

function Check({ className }: { className: string }) {
  return (
    <Icon className={`mt-0.5 size-5 shrink-0 ${className}`}>
      <circle cx="12" cy="12" r="10" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </Icon>
  );
}

const shopifyItems = [
  "Checkout and cart drop-off",
  "Theme and page speed",
  "Product, price and stock updates",
  "Abandoned-cart and follow-up flows",
];

const wordpressItems = [
  "WooCommerce checkout and cart flow",
  "Plugin and page-speed issues",
  "Mobile layout and product pages",
  "Tracking and reporting setup",
];

const journey = [
  { label: "Problem", line: "We spot where sales are leaking." },
  { label: "Audit", line: "Every step checked the way a buyer sees it." },
  { label: "Fix", line: "Nothing changes until you approve." },
  { label: "Optimize", line: "Tuned against real numbers." },
  { label: "Grow", line: "Progress reported weekly." },
];

type PlatformExpertiseProps = {
  /** Where the panel links point. Defaults to the contact / store check form. */
  ctaHref?: string;
};

export function PlatformExpertise({
  ctaHref = "#contact",
}: PlatformExpertiseProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
              trigger: "[data-plat-head]",
              start: "top 82%",
              once: true,
            },
          })
          .from("[data-plat-badge]", { opacity: 0, y: 14, duration: 0.8 })
          .from(
            "[data-plat-line]",
            {
              yPercent: 115,
              rotate: 2,
              transformOrigin: "0% 100%",
              duration: 1.2,
            },
            "-=0.5",
          )
          .from(
            "[data-plat-sub]",
            { opacity: 0, y: 18, duration: 0.9 },
            "-=0.7",
          );

        const panels = gsap.utils.toArray<HTMLElement>("[data-plat-panel]");
        gsap.set(panels, { opacity: 0, y: 40 });
        ScrollTrigger.batch(panels, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "expo.out",
              stagger: 0.12,
              overwrite: true,
            }),
        });

        // The one orchestrated moment: the journey line draws, then each stage lights up.
        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: "[data-plat-journey]",
              start: "top 82%",
              once: true,
            },
          })
          .from("[data-plat-track]", {
            scaleX: 0,
            transformOrigin: "0% 50%",
            duration: 1.2,
            ease: "power2.inOut",
          })
          .from(
            "[data-plat-stage]",
            { opacity: 0, y: 16, duration: 0.7, stagger: 0.14 },
            "-=1",
          );
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="platforms"
      ref={root}
      aria-labelledby="platforms-heading"
      className="relative bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div data-plat-head className="mx-auto max-w-2xl text-center">
          <span
            data-plat-badge
            className="inline-flex items-center gap-2 rounded-full bg-shopify-soft px-4 py-1.5 text-sm font-medium text-shopify-deep dark:bg-shopify/15 dark:text-shopify"
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-shopify-deep dark:bg-shopify"
            />
            Built for your platform
          </span>

          <h2
            id="platforms-heading"
            className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-plat-line className="block will-change-transform">
                Two platforms, one focus:{" "}
                <span className="text-muted-foreground">stores that earn.</span>
              </span>
            </span>
          </h2>

          <p
            data-plat-sub
            className="mt-5 text-lg leading-relaxed text-muted-foreground"
          >
            Shopify and WordPress leak money in different places. We check and
            fix each store the way its platform actually works.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:mt-16 lg:grid-cols-2">
          {/* Shopify: dark panel, where the Shopify green is designed to sit */}
          <article
            data-plat-panel
            className="relative flex flex-col overflow-hidden rounded-3xl bg-brand-deep p-8 text-white md:p-10"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/30 blur-3xl"
            />
            <div className="relative flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-shopify/15 text-shopify">
                <Icon>
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </Icon>
              </span>
              <h3 className="text-2xl font-bold tracking-tight">
                Shopify stores
              </h3>
            </div>

            <p className="relative mt-5 max-w-md text-base leading-relaxed text-white/75">
              Most Shopify stores lose sales between the product page and the
              paid order. That is where we start looking.
            </p>

            <ul className="relative mt-8 space-y-3.5">
              {shopifyItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-[0.95rem] leading-snug"
                >
                  <Check className="text-shopify" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={ctaHref}
              className="relative mt-10 inline-flex h-12 w-fit items-center justify-center rounded-full bg-white px-7 text-sm font-semibold text-brand-deep transition-colors duration-300 hover:bg-shopify focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get a free Shopify store check
            </a>
          </article>

          {/* WordPress / WooCommerce: light panel, purple-led */}
          <article
            data-plat-panel
            className="relative flex flex-col rounded-3xl border bg-card p-8 md:p-10"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary">
                <Icon>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </Icon>
              </span>
              <h3 className="text-2xl font-bold tracking-tight">
                WordPress &amp; WooCommerce
              </h3>
            </div>

            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              WordPress gives you freedom, and with it more places for slow
              pages and broken steps to hide. We find them and fix them.
            </p>

            <ul className="mt-8 space-y-3.5">
              {wordpressItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-[0.95rem] leading-snug"
                >
                  <Check className="text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={ctaHref}
              className="mt-10 inline-flex h-12 w-fit items-center justify-center rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors duration-300 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Get a free WordPress store check
            </a>
          </article>
        </div>

        {/* Same method on both platforms: Problem → Audit → Fix → Optimize → Grow */}
        <div data-plat-journey className="mt-16 md:mt-20">
          <p className="text-center text-sm font-medium text-muted-foreground">
            Same method on both platforms
          </p>

          <div className="relative mt-8">
            <span
              aria-hidden
              data-plat-track
              className="absolute left-[10%] right-[10%] top-[0.45rem] hidden h-px bg-gradient-to-r from-primary/40 via-primary to-shopify-deep lg:block"
            />
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {journey.map((step, i) => (
                <li
                  key={step.label}
                  data-plat-stage
                  className="relative flex gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
                >
                  <span
                    aria-hidden
                    className={`relative z-10 mt-1.5 size-3 shrink-0 rounded-full ring-4 ring-background lg:mt-0 ${
                      i === journey.length - 1
                        ? "bg-shopify-deep"
                        : "bg-primary"
                    }`}
                  />
                  <div className="lg:mt-5">
                    <h3 className="text-base font-semibold">{step.label}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground lg:mx-auto lg:max-w-[14rem]">
                      {step.line}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PlatformExpertise;
