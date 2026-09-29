"use client";

import { useRef } from "react";
import { ArrowRight, Eye, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/gsap";
import { LogoMark, Wordmark } from "@/components/logo-mark";

gsap.registerPlugin(ScrollTrigger);

export function Origin() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Left: logo card unveils, then the two info chips rise in
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
              trigger: "[data-origin-card]",
              start: "top 82%",
              once: true,
            },
          })
          .from("[data-origin-card]", {
            clipPath: "inset(8% 8% 8% 8% round 28px)",
            opacity: 0,
            y: 40,
            scale: 0.97,
            duration: 1.4,
            clearProps: "clipPath",
          })
          .from(
            "[data-origin-chip]",
            { opacity: 0, y: 26, duration: 1, stagger: 0.15 },
            "-=0.8",
          );

        // Right: badge, two-tone heading, paragraphs, side note, pull-quote, CTA
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
              trigger: "[data-origin-copy]",
              start: "top 80%",
              once: true,
            },
          })
          .from("[data-origin-badge]", {
            opacity: 0,
            y: 14,
            scale: 0.9,
            duration: 0.8,
          })
          .from(
            "[data-origin-line]",
            {
              yPercent: 115,
              rotate: 2,
              transformOrigin: "0% 100%",
              duration: 1.2,
              stagger: 0.08,
            },
            "-=0.5",
          )
          .from(
            "[data-origin-p]",
            { opacity: 0, y: 18, duration: 0.9, stagger: 0.12 },
            "-=0.7",
          )
          .from(
            "[data-origin-note]",
            { opacity: 0, x: -20, duration: 0.9 },
            "-=0.5",
          )
          .from(
            "[data-origin-note-bar]",
            {
              scaleY: 0,
              transformOrigin: "0% 0%",
              duration: 0.7,
              ease: "power3.out",
            },
            "<",
          )
          .from(
            "[data-origin-quote]",
            { opacity: 0, y: 24, scale: 0.98, duration: 1 },
            "-=0.4",
          )
          .from(
            "[data-origin-cta]",
            { opacity: 0, y: 16, duration: 0.8 },
            "-=0.5",
          );

        // A single soft pulse on the pull-quote once it lands, to draw the eye
        gsap.fromTo(
          "[data-origin-quote]",
          { boxShadow: "0 0 0 0 rgba(217,119,6,0)" },
          {
            boxShadow: "0 0 0 10px rgba(217,119,6,0)",
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "[data-origin-quote]",
              start: "top 78%",
              once: true,
            },
          },
        );
      });

      // Pointer tilt on the logo card (mouse only)
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const card =
          root.current?.querySelector<HTMLElement>("[data-origin-card]");
        const stage = root.current?.querySelector<HTMLElement>(
          "[data-origin-stage]",
        );
        const cta = root.current?.querySelector<HTMLElement>(
          "[data-origin-magnetic]",
        );
        const cleanups: Array<() => void> = [];

        if (card && stage) {
          const rx = gsap.quickTo(card, "rotationX", {
            duration: 0.9,
            ease: "power3.out",
          });
          const ry = gsap.quickTo(card, "rotationY", {
            duration: 0.9,
            ease: "power3.out",
          });
          gsap.set(card, { transformPerspective: 1000 });

          const move = (e: PointerEvent) => {
            const r = stage.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            ry(px * 6);
            rx(py * -6);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          stage.addEventListener("pointermove", move);
          stage.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            stage.removeEventListener("pointermove", move);
            stage.removeEventListener("pointerleave", leave);
          });
        }

        if (cta) {
          const qx = gsap.quickTo(cta, "x", {
            duration: 0.6,
            ease: "power3.out",
          });
          const qy = gsap.quickTo(cta, "y", {
            duration: 0.6,
            ease: "power3.out",
          });
          const move = (e: PointerEvent) => {
            const r = cta.getBoundingClientRect();
            qx((e.clientX - (r.left + r.width / 2)) * 0.22);
            qy((e.clientY - (r.top + r.height / 2)) * 0.32);
          };
          const leave = () => {
            qx(0);
            qy(0);
          };
          cta.addEventListener("pointermove", move);
          cta.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            cta.removeEventListener("pointermove", move);
            cta.removeEventListener("pointerleave", leave);
          });
        }

        return () => cleanups.forEach((fn) => fn());
      });
    },
    { scope: root },
  );

  return (
    <section
      id="origin"
      ref={root}
      className="relative bg-muted/40 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Left: logo showcase card */}
          <div data-origin-stage className="lg:sticky lg:top-32 lg:self-start">
            <div
              data-origin-card
              className="overflow-hidden rounded-[1.75rem] border bg-card p-3 shadow-xl shadow-primary/5 will-change-transform"
            >
              <div className="flex items-center justify-center rounded-2xl border bg-muted/50 px-6 py-14">
                <div className="flex flex-col items-center gap-3 text-foreground">
                  <LogoMark className="h-auto w-24" arrowColor="#1f1235" />
                  <Wordmark accentClassName="text-primary" />
                </div>
              </div>

              <div className="space-y-3 p-3 pt-4">
                <div
                  data-origin-chip
                  className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/20 dark:bg-violet-500/10"
                >
                  <div className="flex items-center gap-2 text-violet-700 dark:text-violet-400">
                    <Eye className="size-4" />
                    <span className="text-sm font-semibold">
                      El-Roi (Hebrew Origin)
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;The God Who Sees&rdquo;, a name for someone who
                    notices what everyone else walks past without seeing.
                  </p>
                </div>

                <div
                  data-origin-chip
                  className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10"
                >
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <Target className="size-4" />
                    <span className="text-sm font-semibold">
                      Return On Investment
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    The primary metric every business owner chases. We judge
                    every technology system by what it earns you back.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: story copy */}
          <div data-origin-copy>
            <span
              data-origin-badge
              className="inline-flex items-center rounded-full bg-violet-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-500/15 dark:text-violet-400"
            >
              Our origin &amp; purpose
            </span>

            <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              <span className="block overflow-hidden pb-[0.1em]">
                <span data-origin-line className="block will-change-transform">
                  We See What <span className="text-primary">Others Miss.</span>
                </span>
              </span>
            </h2>

            <p
              data-origin-p
              className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              The name{" "}
              <span className="font-semibold text-foreground">ROI</span> means
              two things, on purpose. It stands for{" "}
              <span className="font-semibold text-primary">
                Return on Investment
              </span>
              , the exact number every business owner is striving to increase.
              And it comes from an older idea:{" "}
              <span className="font-semibold text-violet-600 dark:text-violet-400">
                El-Roi
              </span>
              , which means &ldquo;the God who sees.&rdquo; A name for someone
              who notices what everyone else walks past.
            </p>

            <p
              data-origin-p
              className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              That is the core mission of ROI Technology. We inspect your store
              closely enough to discover what is quietly holding it back, then
              we deploy smart technology to fix it, and we measure everything by
              the actual profit it earns you back.
            </p>

            <div data-origin-note className="relative mt-8 max-w-2xl pl-5">
              <span
                aria-hidden
                data-origin-note-bar
                className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-primary/40"
              />
              <p className="text-base leading-relaxed text-muted-foreground">
                We work with Shopify and WordPress stores, brand new or
                established, across social media, email marketing, SEO, and
                automated workflows.
              </p>
            </div>

            <blockquote
              data-origin-quote
              className="mt-8 max-w-2xl rounded-2xl border border-amber-300/70 bg-amber-50/60 p-6 dark:border-amber-500/25 dark:bg-amber-500/[0.06]"
            >
              <p className="text-lg font-medium italic leading-relaxed text-foreground">
                &ldquo;We don&apos;t just manage stores. We find what&apos;s
                quietly costing you money, and turn it into what you
                gain.&rdquo;
              </p>
              <footer className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                &mdash; The ROI Technology Promise
              </footer>
            </blockquote>

            <div data-origin-cta className="mt-9">
              <div
                data-origin-magnetic
                className="inline-block will-change-transform"
              >
                <Button
                  asChild
                  size="lg"
                  className="group/cta h-13 rounded-full px-7 text-base"
                >
                  <a href="#contact">
                    Get Your Free Store Check
                    <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
