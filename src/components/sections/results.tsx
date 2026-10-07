"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

type Platform = "Shopify" | "WordPress" | "WooCommerce";
type Filter = "all" | "shopify" | "wordpress";

type Project = {
  name: string;
  /** Optional industry label, e.g. "Fashion". */
  sector?: string;
  platform: Platform;
  /** Both result fields are optional: a card without a verified number simply shows no badge. */
  result?: string;
  resultLabel?: string;
  image: string;
  href: string;
};

// ⚠ PLACEHOLDER CONTENT. Before launch, every name, number, image and link below must be
// replaced with (or confirmed against) real work ROI Technology actually did and has
// permission to show. Do not publish results for stores you did not work on.
// Images are desktop screenshots. Any size works: the card crops to a landscape
// frame from the top of the page, and tall full-page shots slowly scroll on hover.
const projects: Project[] = [
  {
    name: "ZARA",
    sector: "Fashion",
    platform: "Shopify",
    result: "+41%",
    resultLabel: "checkout completion",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1790692449/Screenshot_from_2026-09-29_15-33-26_fdbuuh.png",
    href: "https://www.zara.com/uk/",
  },
  {
    name: "UNIMATIC WATCHES",
    sector: "Time pieces",
    platform: "WordPress",
    result: "16 hrs",
    resultLabel: "saved every week",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1790693604/Screenshot_from_2026-09-29_15-52-51_lcvbs4.png",
    href: "https://www.unimaticwatches.com/",
  },
  {
    name: "COCOON BLANKET",
    sector: "Home",
    platform: "Shopify",
    result: "+27%",
    resultLabel: "repeat orders",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1790693745/Screenshot_from_2026-09-29_15-55-27_dw2veb.png",
    href: "https://www.cocoonblanket.com/",
  },
  {
    name: "THEIR NIBS",
    sector: "Home",
    platform: "WooCommerce",
    result: "-38%",
    resultLabel: "cart abandonment",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1790693881/Screenshot_from_2026-09-29_15-57-30_oz1hb0.png",
    href: "https://www.theirnibs.com/en-us",
  },
  {
    name: "VILLA AURELIA",
    platform: "Shopify",
    result: "+19%",
    resultLabel: "average order value",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1790693970/Screenshot_from_2026-09-29_15-59-13_rfyaj1.png",
    href: "https://hotelaurelia.online/",
  },
  {
    name: "LITTLE ONE SHOP",
    sector: "Kids",
    platform: "WordPress",
    result: "+52%",
    resultLabel: "email revenue",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1790694438/Screenshot_from_2026-09-29_16-06-59_kfde4w.png",
    href: "https://littleoneshop.com",
  },
];

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All stores" },
  { id: "shopify", label: "Shopify" },
  { id: "wordpress", label: "WordPress & WooCommerce" },
];

function matchesFilter(p: Project, f: Filter) {
  if (f === "all") return true;
  if (f === "shopify") return p.platform === "Shopify";
  return p.platform === "WordPress" || p.platform === "WooCommerce";
}

function hostOf(href: string) {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
}

export function Results() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [hasFiltered, setHasFiltered] = useState(false);

  const visible = projects.filter((p) => matchesFilter(p, filter));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Heading
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
              trigger: "[data-results-head]",
              start: "top 82%",
              once: true,
            },
          })
          .from("[data-r-line]", {
            yPercent: 115,
            rotate: 2,
            transformOrigin: "0% 100%",
            duration: 1.2,
            stagger: 0.08,
          })
          .from("[data-r-fade]", { opacity: 0, y: 20, duration: 0.9 }, "-=0.7")
          .from(
            "[data-r-filters]",
            { opacity: 0, y: 14, duration: 0.8 },
            "-=0.6",
          );

        // Cards reveal in row-batches as they scroll into view. They are hidden up front
        // so they never flash visible before animating in.
        const cards = gsap.utils.toArray<HTMLElement>("[data-project]");
        gsap.set(cards, { opacity: 0, y: 36 });
        ScrollTrigger.batch(cards, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.09,
              overwrite: true,
            }),
        });

        gsap.from("[data-results-cta]", {
          opacity: 0,
          y: 24,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-results-cta]",
            start: "top 92%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      id="results"
      ref={root}
      aria-labelledby="results-heading"
      className="relative bg-muted/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div
          data-results-head
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <h2
            id="results-heading"
            className="max-w-xl text-3xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-r-line className="block will-change-transform">
                Real stores.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span
                data-r-line
                className="block text-primary will-change-transform"
              >
                Real results.
              </span>
            </span>
          </h2>
          <p
            data-r-fade
            className="max-w-sm text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            A few of the Shopify and WordPress stores we&apos;ve fixed, and what
            changed once the leaks were closed.
          </p>
        </div>

        {/* Platform filter */}
        <div
          data-r-filters
          role="group"
          aria-label="Filter stores by platform"
          className="mt-10 flex flex-wrap gap-2 md:mt-12"
        >
          {filters.map((f) => {
            const active = filter === f.id;
            const count = projects.filter((p) => matchesFilter(p, f.id)).length;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setHasFiltered(true);
                  setFilter(f.id);
                }}
                className={`inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {f.label}
                <span
                  className={`text-xs tabular-nums ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 1 column on phones, 2 on tablets, 3 on desktop */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {visible.map((p) => (
            <article
              key={p.name}
              data-project
              className={`min-w-0 ${hasFiltered ? "animate-in fade-in slide-in-from-bottom-3 duration-500" : ""}`}
            >
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name}: visit project (opens in a new tab)`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm outline-offset-4 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {/* Browser frame: tells the eye this is a website, not a photo */}
                <div
                  aria-hidden
                  className="flex items-center gap-3 border-b bg-muted/60 px-3.5 py-2.5"
                >
                  <span className="flex shrink-0 gap-1.5">
                    <i className="size-2 rounded-full bg-foreground/15" />
                    <i className="size-2 rounded-full bg-foreground/15" />
                    <i className="size-2 rounded-full bg-foreground/15" />
                  </span>
                  <span className="min-w-0 flex-1 truncate rounded-md bg-background/80 px-2.5 py-0.5 text-center text-[11px] text-muted-foreground">
                    {hostOf(p.href)}
                  </span>
                </div>

                {/* Screenshot: landscape frame, anchored to the top of the page */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src={p.image}
                    alt={`${p.name} website preview`}
                    fill
                    sizes="(min-width: 1280px) 384px, (min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                    className="object-cover [object-position:50%_0%] transition-[object-position] duration-[3500ms] ease-in-out group-hover:[object-position:50%_100%] motion-reduce:transition-none"
                  />

                  {/* Result badge: emerald = money gained */}
                  {p.result && (
                    <div className="absolute bottom-3 left-3 flex items-baseline gap-2 rounded-xl bg-background px-3 py-2 shadow-md">
                      <span className="text-lg font-semibold tabular-nums leading-none text-profit">
                        {p.result}
                      </span>
                      {p.resultLabel && (
                        <span className="text-xs leading-none text-muted-foreground">
                          {p.resultLabel}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary">
                      {p.name}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          p.platform === "Shopify"
                            ? "bg-shopify-soft text-shopify-deep dark:bg-shopify/15 dark:text-shopify"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {p.platform}
                      </span>
                      {p.sector && (
                        <span className="truncate text-sm text-muted-foreground">
                          {p.sector}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border text-foreground transition-colors duration-500 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* Closing CTA */}
        <div
          data-results-cta
          className="mt-16 flex flex-col  justify-center md:justify-between gap-6 border-t pt-10 sm:flex-row items-center lg:mt-20"
        >
          <p className="text-xl font-semibold tracking-tight sm:text-2xl">
            Your store could be next.
          </p>
          <Button
            asChild
            size="lg"
            className="group/cta h-14 rounded-full px-8 text-base "
          >
            <a href="#contact">
              Get my free store check
              <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
