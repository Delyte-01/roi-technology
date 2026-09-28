"use client";

import { useRef } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Hourglass,
  Moon,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/gsap";

// Safe to call even if @/lib/gsap already registers it.
gsap.registerPlugin(ScrollTrigger);

const problems = [
  {
    icon: ShoppingCart,
    title: "Where did that sale go?",
    body: "Most shoppers leave right before they buy, and you never find out why.",
    impact: "Lost checkout revenue, every day",
  },
  {
    icon: Hourglass,
    title: "There's never enough time.",
    body: "Updating listings, prices and stock by hand eats hours you don't have.",
    impact: "Hours lost to repetitive work",
  },
  {
    icon: Moon,
    title: "Your store never sleeps. You do.",
    body: "Without automation, follow-up stops the moment you log off.",
    impact: "No customer follow-up overnight",
  },
];

const headline =
  "Every store is losing money somewhere. Most owners can't see where.";

export function Problem() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Headline: words light up as you scroll through it.
        gsap.set("[data-word]", { opacity: 0.16 });
        gsap.to("[data-word]", {
          opacity: 1,
          ease: "none",
          stagger: 0.5,
          scrollTrigger: {
            trigger: "[data-headline]",
            start: "top 78%",
            end: "bottom 42%",
            scrub: 0.6,
          },
        });

        // 2. Problem rows: staggered rise, once.
        gsap.from("[data-row]", {
          opacity: 0,
          y: 56,
          duration: 1.2,
          ease: "expo.out",
          stagger: 0.14,
          clearProps: "opacity,transform",
          scrollTrigger: {
            trigger: "[data-list]",
            start: "top 82%",
            once: true,
          },
        });

        // 3. CTA panel: unveils with a clip-path, then its contents settle in.
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
              trigger: "[data-cta]",
              start: "top 85%",
              once: true,
            },
          })
          .from("[data-cta]", {
            clipPath: "inset(0% 12% 0% 12% round 40px)",
            scale: 0.95,
            duration: 1.5,
          })
          .from(
            "[data-cta-item]",
            { opacity: 0, y: 28, duration: 1, stagger: 0.1 },
            "-=0.9",
          );
      });

      // Cursor-following glow + magnetic button inside the CTA (mouse only).
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const cta = root.current?.querySelector<HTMLElement>("[data-cta]");
          const glow = cta?.querySelector<HTMLElement>("[data-cta-glow]");
          const magnet = cta?.querySelector<HTMLElement>("[data-magnetic]");
          if (!cta || !glow) return;

          const gx = gsap.quickTo(glow, "x", {
            duration: 1.2,
            ease: "power3.out",
          });
          const gy = gsap.quickTo(glow, "y", {
            duration: 1.2,
            ease: "power3.out",
          });
          const mx = magnet
            ? gsap.quickTo(magnet, "x", { duration: 0.6, ease: "power3.out" })
            : null;
          const my = magnet
            ? gsap.quickTo(magnet, "y", { duration: 0.6, ease: "power3.out" })
            : null;

          const onMove = (e: PointerEvent) => {
            const r = cta.getBoundingClientRect();
            gx(e.clientX - r.left - r.width / 2);
            gy(e.clientY - r.top - r.height / 2);

            if (magnet && mx && my) {
              const b = magnet.getBoundingClientRect();
              const dx = e.clientX - (b.left + b.width / 2);
              const dy = e.clientY - (b.top + b.height / 2);
              const near = Math.hypot(dx, dy) < 160;
              mx(near ? dx * 0.25 : 0);
              my(near ? dy * 0.3 : 0);
            }
          };
          const onLeave = () => {
            gx(0);
            gy(0);
            mx?.(0);
            my?.(0);
          };

          cta.addEventListener("pointermove", onMove);
          cta.addEventListener("pointerleave", onLeave);
          return () => {
            cta.removeEventListener("pointermove", onMove);
            cta.removeEventListener("pointerleave", onLeave);
          };
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      id="problem"
      ref={root}
      className="relative bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Headline (sticks while the rows scroll past on desktop) */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2
              data-headline
              className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-5xl"
            >
              {headline.split(" ").map((word, i) => (
                <span key={i} data-word className="inline-block">
                  {word}
                  {i < headline.split(" ").length - 1 ? "\u00A0" : ""}
                </span>
              ))}
            </h2>
          </div>

          {/* Problems */}
          <ul data-list className="border-t">
            {problems.map((p) => (
              <li key={p.title} data-row className="border-b">
                <div className="group relative flex flex-col gap-6 overflow-hidden px-2 py-8 sm:px-6 sm:py-10 md:flex-row md:items-center md:gap-8">
                  {/* Hover fill sweeps in from the left */}
                  <span
                    aria-hidden
                    className="absolute inset-0 origin-left scale-x-0 bg-accent/70 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />

                  <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-leak-soft text-leak transition-colors duration-500 group-hover:bg-leak group-hover:text-white">
                    <p.icon className="size-5" />
                  </span>

                  <div className="relative min-w-0 flex-1">
                    <h3 className="text-2xl font-semibold leading-snug tracking-tight transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5">
                      {p.title}
                    </h3>
                    <p className="mt-2 max-w-md text-base leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>
                  </div>

                  <div className="relative flex items-center gap-3 md:max-w-[15rem] md:flex-col md:items-end md:gap-4">
                    <p className="rounded-full bg-leak-soft px-4 py-2 text-[10px] font-medium text-leak md:text-right">
                      {p.impact}
                    </p>
                    <ArrowUpRight className="hidden size-5 text-muted-foreground opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground group-hover:opacity-100 md:block" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA panel */}
        <div
          data-cta
          className="relative mt-20 overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary to-violet-500 p-8 text-primary-foreground sm:p-12 lg:mt-28 lg:p-16"
        >
          <div
            aria-hidden
            data-cta-glow
            className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 blur-[90px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000,transparent)]"
          />

          <div className="relative flex flex-col items-start justify-between gap-10 md:flex-row md:items-center">
            <p
              data-cta-item
              className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
            >
              Want to find out where your store is leaking?
            </p>
            <div data-cta-item data-magnetic className="will-change-transform">
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="group/cta h-14 rounded-full px-8 text-base"
              >
                <a href="#contact">
                  Check my store now
                  <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
