"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

// Placeholder content: replace names, numbers, images and links with your real projects.
// Images go in /public/images/results/ (about 1600px wide, landscape works best).
const projects = [
  {
    name: "Atelier Nova",
    category: "Fashion · Shopify",
    summary: "Rebuilt checkout and added abandoned-cart follow-up.",
    result: "+41%",
    resultLabel: "checkout completion",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783846532/photo-1612831197310-ff5cf7a211b6_n7f9th.jpg",
    href: "https://example.com",
    span: "lg:col-span-7",
  },
  {
    name: "Greenleaf Supply",
    category: "Home goods · WordPress",
    summary: "Automated stock and price updates across 1,200 listings.",
    result: "16 hrs",
    resultLabel: "saved every week",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783153700/smiling-student-holding-notebook-on-busy-school-escalator_hm9i3e.jpg",
    href: "https://example.com",
    span: "lg:col-span-5",
  },
  {
    name: "Kola & Co",
    category: "Beauty · Shopify",
    summary: "Post-purchase sequences that bring buyers back.",
    result: "+27%",
    resultLabel: "repeat orders",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783154244/university-student-woman-and-portrait-with-backpack-books-and-happy-for-back-to-school_xf78fh.jpg",
    href: "https://example.com",
    span: "lg:col-span-5",
  },
  {
    name: "Northwind Tools",
    category: "Hardware · WooCommerce",
    summary: "Fixed a payment-step leak and sped up every product page.",
    result: "-38%",
    resultLabel: "cart abandonment",
    image:
      "https://res.cloudinary.com/dk5mfu099/image/upload/v1783273126/23557_muizqi.jpgg",
    href: "https://example.com",
    span: "lg:col-span-7",
  },
];

export function Results() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Section heading
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
            rotate: 3,
            transformOrigin: "0% 100%",
            duration: 1.3,
            stagger: 0.1,
          })
          .from(
            "[data-r-fade]",
            { opacity: 0, y: 22, duration: 1, stagger: 0.1 },
            "-=0.9",
          );

        // Each project: unveil, rise, and parallax the photo while scrolling
        gsap.utils.toArray<HTMLElement>("[data-project]").forEach((card) => {
          const media = card.querySelector<HTMLElement>("[data-media]");
          const inner = card.querySelector<HTMLElement>("[data-parallax]");
          const meta = card.querySelectorAll("[data-meta]");
          if (!media || !inner) return;

          gsap
            .timeline({
              defaults: { ease: "expo.out" },
              scrollTrigger: { trigger: card, start: "top 88%", once: true },
            })
            .fromTo(
              media,
              { clipPath: "inset(100% 0% 0% 0% round 28px)", y: 40 },
              {
                clipPath: "inset(0% 0% 0% 0% round 28px)",
                y: 0,
                duration: 1.5,
                clearProps: "clipPath,transform",
              },
            )
            .from(inner, { scale: 1.25, duration: 2, ease: "expo.out" }, "<")
            .from(
              meta,
              { opacity: 0, y: 20, duration: 1, stagger: 0.08 },
              "-=1.1",
            );

          gsap.fromTo(
            inner,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: media,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });

        gsap.from("[data-results-cta]", {
          opacity: 0,
          y: 30,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: "[data-results-cta]",
            start: "top 92%",
            once: true,
          },
        });
      });

      // "Visit" pill that follows the cursor over each project image (mouse only)
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const cleanups: Array<() => void> = [];

        gsap.utils.toArray<HTMLElement>("[data-media]").forEach((media) => {
          const pill = media.querySelector<HTMLElement>("[data-cursor]");
          if (!pill) return;

          gsap.set(pill, {
            xPercent: -50,
            yPercent: -50,
            scale: 0,
            opacity: 0,
          });
          const qx = gsap.quickTo(pill, "x", {
            duration: 0.5,
            ease: "power3.out",
          });
          const qy = gsap.quickTo(pill, "y", {
            duration: 0.5,
            ease: "power3.out",
          });

          const enter = (e: PointerEvent) => {
            const r = media.getBoundingClientRect();
            gsap.set(pill, { x: e.clientX - r.left, y: e.clientY - r.top });
            gsap.to(pill, {
              scale: 1,
              opacity: 1,
              duration: 0.55,
              ease: "back.out(1.8)",
              overwrite: "auto",
            });
          };
          const move = (e: PointerEvent) => {
            const r = media.getBoundingClientRect();
            qx(e.clientX - r.left);
            qy(e.clientY - r.top);
          };
          const leave = () =>
            gsap.to(pill, {
              scale: 0,
              opacity: 0,
              duration: 0.4,
              ease: "power3.in",
              overwrite: "auto",
            });

          media.addEventListener("pointerenter", enter);
          media.addEventListener("pointermove", move);
          media.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            media.removeEventListener("pointerenter", enter);
            media.removeEventListener("pointermove", move);
            media.removeEventListener("pointerleave", leave);
          });
        });

        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root },
  );

  return (
    <section
      id="result"
      ref={root}
      className="relative bg-muted/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Heading */}
        <div
          data-results-head
          className="flex flex-col justify-between gap-8 md:flex-row md:items-end"
        >
          <h2 className="max-w-2xl text-4xl font-bold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-r-line className="block will-change-transform">
                Real stores.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
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
            className="max-w-sm text-lg leading-relaxed text-muted-foreground"
          >
            A few of the stores we&apos;ve fixed, and what changed once the
            leaks were closed.
          </p>
        </div>

        {/* Projects */}
        <div className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 lg:grid-cols-12 lg:gap-y-20">
          {projects.map((p) => (
            <article key={p.name} data-project className={p.span}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.name}: visit project (opens in a new tab)`}
                className="group block rounded-[1.75rem] outline-offset-4"
              >
                {/* Image */}
                <div
                  data-media
                  className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border bg-muted sm:aspect-[16/11] lg:aspect-auto lg:h-[26rem]"
                >
                  <div
                    data-parallax
                    className="absolute -inset-y-[8%] inset-x-0 will-change-transform"
                  >
                    <Image
                      src={p.image}
                      alt={`${p.name} website preview`}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  </div>

                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-100"
                  />

                  {/* Result chip */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-white/20 bg-background/85 py-2.5 pl-2.5 pr-4 shadow-xl backdrop-blur-md sm:bottom-5 sm:left-5">
                    <span className="grid size-9 place-items-center rounded-lg bg-profit-soft text-profit">
                      <TrendingUp className="size-4" />
                    </span>
                    <div className="leading-tight">
                      <p className="text-base font-semibold tabular-nums text-profit">
                        {p.result}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {p.resultLabel}
                      </p>
                    </div>
                  </div>

                  {/* Corner arrow (touch and keyboard friendly) */}
                  <span className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/20 bg-background/85 text-foreground backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:bg-primary group-hover:text-primary-foreground sm:right-5 sm:top-5">
                    <ArrowUpRight className="size-5 transition-transform duration-500 group-hover:-rotate-45" />
                  </span>

                  {/* Cursor-following pill (desktop with mouse) */}
                  <span
                    data-cursor
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 hidden items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-xl [@media(hover:hover)_and_(pointer:fine)]:flex"
                  >
                    Visit site
                    <ArrowRight className="size-4" />
                  </span>
                </div>

                {/* Text */}
                <div className="mt-6 flex items-start justify-between gap-6 px-1">
                  <div data-meta>
                    <p className="text-sm text-muted-foreground">
                      {p.category}
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary">
                      {p.name}
                    </h3>
                  </div>
                  <p
                    data-meta
                    className="max-w-[16rem] pt-1 text-right text-sm leading-relaxed text-muted-foreground"
                  >
                    {p.summary}
                  </p>
                </div>
              </a>
            </article>
          ))}
        </div>

        {/* Closing CTA */}
        <div
          data-results-cta
          className="mt-20 flex flex-col items-start justify-between gap-6 border-t pt-10 sm:flex-row sm:items-center lg:mt-28"
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
