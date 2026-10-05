"use client";

import { useRef, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

type Platform = "Shopify" | "WordPress" | "Both";

type Service = {
  title: string;
  desc: string;
  platform: Platform;
  icon: ReactNode;
};

/* Inline stroke icons (24px grid) so no icon library is required. */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-5"
    >
      {children}
    </svg>
  );
}

const services: Service[] = [
  {
    title: "Shopify Development",
    desc: "Custom Shopify storefronts, features, integrations, and improvements built around how your store actually sells.",
    platform: "Shopify",
    icon: (
      <Icon>
        <path d="m16 18 6-6-6-6" />
        <path d="m8 6-6 6 6 6" />
      </Icon>
    ),
  },
  {
    title: "Shopify Store Optimization",
    desc: "Improve speed, user experience, and conversion opportunities on the store you already have.",
    platform: "Shopify",
    icon: (
      <Icon>
        <path d="m22 7-8.5 8.5-5-5L2 17" />
        <path d="M16 7h6v6" />
      </Icon>
    ),
  },
  {
    title: "WordPress / WooCommerce",
    desc: "Build, improve, and maintain WordPress and WooCommerce ecommerce experiences that are fast and easy to run.",
    platform: "WordPress",
    icon: (
      <Icon>
        <path d="m12 2 10 5-10 5L2 7l10-5z" />
        <path d="m2 17 10 5 10-5" />
        <path d="m2 12 10 5 10-5" />
      </Icon>
    ),
  },
  {
    title: "Store Audits",
    desc: "Find the technical, UX, performance, SEO, and conversion issues quietly costing you sales.",
    platform: "Both",
    icon: (
      <Icon>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </Icon>
    ),
  },
  {
    title: "Conversion Optimization",
    desc: "Smooth out the customer journey so more of your visitors turn into paying customers.",
    platform: "Both",
    icon: (
      <Icon>
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
      </Icon>
    ),
  },
  {
    title: "Ecommerce Automation",
    desc: "Cut repetitive work and tighten store operations by automating the tasks that eat your time.",
    platform: "Both",
    icon: (
      <Icon>
        <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
        <path d="M21 3v5h-5" />
      </Icon>
    ),
  },
];

const platformLabel: Record<Platform, string> = {
  Shopify: "Shopify",
  WordPress: "WordPress",
  Both: "Shopify & WordPress",
};

const platformStyle: Record<Platform, string> = {
  Shopify:
    "bg-shopify-soft text-shopify-deep dark:bg-shopify/15 dark:text-shopify",
  WordPress: "bg-secondary text-secondary-foreground",
  Both: "bg-shopify-soft text-shopify-deep dark:bg-shopify/15 dark:text-shopify",
};

type ShopifyWordPressServicesProps = {
  /** Where the closing link points. Defaults to the store check section. */
  ctaHref?: string;
};

export function ShopifyWordPressServices({
  ctaHref = "#contact",
}: ShopifyWordPressServicesProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
              trigger: "[data-svc-head]",
              start: "top 82%",
              once: true,
            },
          })
          .from("[data-svc-badge]", { opacity: 0, y: 14, duration: 0.8 })
          .from(
            "[data-svc-line]",
            {
              yPercent: 115,
              rotate: 2,
              transformOrigin: "0% 100%",
              duration: 1.2,
            },
            "-=0.5",
          )
          .from(
            "[data-svc-sub]",
            { opacity: 0, y: 18, duration: 0.9 },
            "-=0.7",
          );

        const cards = gsap.utils.toArray<HTMLElement>("[data-svc-card]");
        gsap.set(cards, { opacity: 0, y: 36 });
        ScrollTrigger.batch(cards, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.08,
              overwrite: true,
            }),
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="services"
      ref={root}
      aria-labelledby="services-heading"
      className="relative bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div data-svc-head className="mx-auto max-w-2xl text-center">
          <span
            data-svc-badge
            className="inline-flex items-center gap-2 rounded-full bg-shopify-soft px-4 py-1.5 text-sm font-medium text-shopify-deep dark:bg-shopify/15 dark:text-shopify"
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-shopify-deep dark:bg-shopify"
            />
            Shopify &amp; WordPress services
          </span>

          <h2
            id="services-heading"
            className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-svc-line className="block will-change-transform">
                Everything your store needs{" "}
                <span className="text-muted-foreground">
                  to perform better.
                </span>
              </span>
            </span>
          </h2>

          <p
            data-svc-sub
            className="mt-5 text-lg leading-relaxed text-muted-foreground"
          >
            We help Shopify and WordPress store owners build, optimize, fix, and
            grow their stores, starting with what the numbers say is actually
            holding them back.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {services.map((s) => (
            <li
              key={s.title}
              data-svc-card
              className="group relative flex flex-col rounded-2xl border bg-card p-6 transition-colors duration-300 hover:border-primary/40 md:p-7"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  {s.icon}
                </span>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${platformStyle[s.platform]}`}
                >
                  {platformLabel[s.platform]}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-semibold leading-snug">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-center text-sm text-muted-foreground md:mt-12">
          Not sure where to start?{" "}
          <a
            href={ctaHref}
            className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2"
          >
            Begin with a store check
          </a>
          .
        </p>
      </div>
    </section>
  );
}

export default ShopifyWordPressServices;
