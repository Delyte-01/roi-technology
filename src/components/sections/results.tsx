"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

// Placeholder content: replace names, numbers, images and links with your real projects.
// Images go in /public/images/results/ (about 1000x1250px, portrait works best for this grid).
const projects = [
  {
    name: "Atelier Nova",
    category: "Fashion · Shopify",
    result: "+41%",
    resultLabel: "checkout completion",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783846532/photo-1612831197310-ff5cf7a211b6_n7f9th.jpg",
    href: "https://example.com",
  },
  {
    name: "Greenleaf Supply",
    category: "Home goods · WordPress",
    result: "16 hrs",
    resultLabel: "saved every week",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783153700/smiling-student-holding-notebook-on-busy-school-escalator_hm9i3e.jpg",
    href: "https://example.com",
  },
  {
    name: "Kola & Co",
    category: "Beauty · Shopify",
    result: "+27%",
    resultLabel: "repeat orders",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783154244/university-student-woman-and-portrait-with-backpack-books-and-happy-for-back-to-school_xf78fh.jpg",
    href: "https://example.com",
  },
  {
    name: "Northwind Tools",
    category: "Hardware · WooCommerce",
    result: "-38%",
    resultLabel: "cart abandonment",
    image: "/images/results/project-4.jpg",
    href: "https://example.com",
  },
  {
    name: "Harbor & Hearth",
    category: "Furniture · Shopify",
    result: "+19%",
    resultLabel: "average order value",
    image: "/images/results/project-5.jpg",
    href: "https://example.com",
  },
  {
    name: "Pure Botanics",
    category: "Skincare · WordPress",
    result: "+52%",
    resultLabel: "email revenue",
    image: "/images/results/project-6.jpg",
    href: "https://example.com",
  },
  {
    name: "Fieldstone Coffee",
    category: "Food & drink · Shopify",
    result: "12 hrs",
    resultLabel: "saved every week",
    image: "/images/results/project-7.jpg",
    href: "https://example.com",
  },
];

export function Results() {
  const root = useRef<HTMLElement>(null);

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
          .from("[data-r-fade]", { opacity: 0, y: 20, duration: 0.9 }, "-=0.7");

        // Cards reveal in row-batches as they scroll into view: a clean,
        // uniform rise rather than a per-card scrub, since every card is the same size.
        ScrollTrigger.batch("[data-project]", {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.from(batch, {
              opacity: 0,
              y: 36,
              scale: 0.97,
              duration: 0.9,
              ease: "expo.out",
              stagger: 0.09,
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
    },
    { scope: root },
  );

  return (
    <section
      id="results"
      ref={root}
      className="relative bg-muted/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div
          data-results-head
          className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
        >
          <h2 className="max-w-xl text-3xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
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
            A few of the stores we&apos;ve fixed, and what changed once the
            leaks were closed.
          </p>
        </div>

        {/* Uniform, responsive grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:mt-16 md:gap-7 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((p) => (
            <article key={p.name} data-project>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name}: visit project (opens in a new tab)`}
                className="group block h-full overflow-hidden rounded-[1.5rem] border bg-card shadow-sm outline-offset-4 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <Image
                    src={p.image}
                    alt={`${p.name} website preview`}
                    fill
                    sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                    className="object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  {/* Corner arrow */}
                  <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/85 text-foreground backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-rotate-45" />
                  </span>

                  {/* Result, overlaid on the image so every card stays the same height */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-xl font-semibold tabular-nums text-white">
                      {p.result}
                    </p>
                    <p className="text-xs text-white/75">{p.resultLabel}</p>
                  </div>
                </div>

                {/* Text */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                  <h3 className="mt-0.5 truncate text-base font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary">
                    {p.name}
                  </h3>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* Closing CTA */}
        <div
          data-results-cta
          className="mt-16 flex flex-col items-start justify-between gap-6 border-t pt-10 sm:flex-row sm:items-center lg:mt-20"
        >
          <p className="text-xl font-semibold tracking-tight sm:text-2xl">
            Your store could be next.
          </p>
          <Button
            asChild
            size="lg"
            className="group/cta h-14 rounded-full px-8 text-base"
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
