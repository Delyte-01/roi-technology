"use client";

import { useRef } from "react";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Store,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/gsap";
import Image from "next/image";

// Platforms we work on. Plain text on purpose: no official logos, no partner claims.
const platforms = ["Shopify", "WordPress", "WooCommerce"];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Starts paused so nothing plays behind the loader
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "expo.out" },
        });

        tl.from("[data-line]", {
          yPercent: 115,
          rotate: 3,
          transformOrigin: "0% 100%",
          duration: 1.4,
          stagger: 0.1,
        })
          .from(
            "[data-fade]",
            { opacity: 0, y: 24, duration: 1, stagger: 0.08 },
            "-=1",
          )
          .from(
            "[data-card]",
            {
              opacity: 0,
              y: 64,
              scale: 0.96,
              clipPath: "inset(12% 8% 12% 8% round 28px)",
              duration: 1.5,
              ease: "expo.out",
            },
            "-=1.25",
          )
          .from(
            "[data-float]",
            { opacity: 0, y: 16, duration: 0.9, stagger: 0.12 },
            "-=0.7",
          );

        // Wait for the loader, then play
        const start = () => tl.play();
        let fallback = 0;

        if (document.documentElement.dataset.loaded) {
          start(); // loader already finished (e.g. returning visitor)
        } else {
          window.addEventListener("loader:done", start, { once: true });
          // Safety net: never leave the hero hidden if there is no loader
          fallback = window.setTimeout(start, 10000);
        }

        const cleanups: Array<() => void> = [];
        const hoverMM = gsap.matchMedia();

        hoverMM.add("(hover: hover) and (pointer: fine)", () => {
          const card = root.current?.querySelector<HTMLElement>("[data-card]");
          const stage =
            root.current?.querySelector<HTMLElement>("[data-stage]");

          if (card && stage) {
            const rx = gsap.quickTo(card, "rotationX", {
              duration: 0.9,
              ease: "power3.out",
            });
            const ry = gsap.quickTo(card, "rotationY", {
              duration: 0.9,
              ease: "power3.out",
            });
            gsap.set(card, { transformPerspective: 1100 });

            const move = (e: PointerEvent) => {
              const r = stage.getBoundingClientRect();
              const px = (e.clientX - r.left) / r.width - 0.5;
              const py = (e.clientY - r.top) / r.height - 0.5;
              ry(px * 7);
              rx(py * -7);

              // Feeds the cursor-following glare
              const c = card.getBoundingClientRect();
              card.style.setProperty(
                "--mx",
                `${((e.clientX - c.left) / c.width) * 100}%`,
              );
              card.style.setProperty(
                "--my",
                `${((e.clientY - c.top) / c.height) * 100}%`,
              );
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

          root.current
            ?.querySelectorAll<HTMLElement>("[data-magnetic]")
            .forEach((btn) => {
              const qx = gsap.quickTo(btn, "x", {
                duration: 0.6,
                ease: "power3.out",
              });
              const qy = gsap.quickTo(btn, "y", {
                duration: 0.6,
                ease: "power3.out",
              });

              const move = (e: PointerEvent) => {
                const r = btn.getBoundingClientRect();
                qx((e.clientX - (r.left + r.width / 2)) * 0.22);
                qy((e.clientY - (r.top + r.height / 2)) * 0.32);
              };
              const leave = () => {
                qx(0);
                qy(0);
              };

              btn.addEventListener("pointermove", move);
              btn.addEventListener("pointerleave", leave);
              cleanups.push(() => {
                btn.removeEventListener("pointermove", move);
                btn.removeEventListener("pointerleave", leave);
              });
            });
        });

        return () => {
          cleanups.forEach((fn) => fn());
          hoverMM.revert();
          window.removeEventListener("loader:done", start);
          window.clearTimeout(fallback);
        };
      });
    },
    { scope: root },
  );

  return (
    <section id="home" ref={root} className="relative isolate overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-24 sm:px-8 md:py-35 lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        {/* Copy */}
        <div>
          {/* Platform badge: first (and quietest) use of the Shopify green */}
          <div data-fade className="mb-7">
            <Badge
              variant="outline"
              className="h-auto gap-2 rounded-full border-shopify/40 bg-shopify-soft px-3.5 py-1.5 text-sm font-medium text-shopify"
            >
              <Store className="size-4" aria-hidden />
              Shopify &amp; WordPress ecommerce specialists
            </Badge>
          </div>

          <h1 className="text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[4.5rem]">
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-line className="block will-change-transform">
                We see what&apos;s
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span data-line className="block will-change-transform">
                costing your
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span
                data-line
                className="block text-primary will-change-transform"
              >
                store money.
              </span>
            </span>
          </h1>

          <p
            data-fade
            className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted-foreground sm:text-xl sm:leading-relaxed"
          >
            We find hidden problems in your Shopify or WordPress store and fix
            them, from conversion leaks to performance issues, so more visitors
            become customers.
          </p>

          <div
            data-fade
            className="mt-10 flex flex-col px-4  gap-4 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <Button
              asChild
              size="lg"
              data-magnetic
              className="group h-13 w-full rounded-full px-7 text-base will-change-transform sm:w-auto"
            >
              <a href="#contact">
                Get my free store check
                <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              data-magnetic
              className="h-13 w-full rounded-full px-6 text-base will-change-transform sm:w-auto"
            >
              <a href="#contact">See what&apos;s costing my store</a>
            </Button>
          </div> 
          {/* Platform strip: reads as a specialization, not a tech list */}
          <div data-fade className="mt-10 border-t border-border pt-6">
            <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <Store className="size-3.5 text-shopify-deep" aria-hidden />
              Built for
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              {platforms.map((name) => (
                <li
                  key={name}
                  className="flex items-center gap-2 text-base font-medium text-foreground"
                >
                  <Check
                    className="size-4 text-shopify-deep"
                    strokeWidth={3}
                    aria-hidden
                  />
                  {name}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Free, takes 2 minutes, no obligation.
            </p>
          </div>
        </div>

        {/* Audit panel */}
        <div data-stage className="relative lg:pl-4">
          <div
            data-card
            className="group relative aspect-[4/4] w-full overflow-hidden rounded-[1.75rem] border bg-muted shadow-2xl shadow-primary/10 will-change-transform"
          >
            {/* Oversized so it can drift on hover without exposing edges */}
            <div
              data-img
              className="absolute -inset-[6%] will-change-transform"
            >
              <Image
                src="https://res.cloudinary.com/dk5mfu099/image/upload/v1790617423/wmremove-transformed_2_u7ucxb.jpg"
                alt="Online store dashboard showing checkout performance"
                width={500}
                height={500}
                priority
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
            </div>

            {/* Legibility gradient */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
            />

            {/* Cursor-following glare (--mx / --my are set in the hover handler) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.22), transparent 60%)",
              }}
            />

            {/* Store audit pill (Shopify green accent) */}
            <div
              data-float
              className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-shopify/40 bg-shopify-soft px-3.5 py-2 text-sm font-medium text-shopify-deep shadow-lg sm:right-6 sm:top-6"
            >
              <ClipboardCheck className="size-4" aria-hidden />
              Store audit
            </div>

            {/* Floating chips: audit -> leak -> fix -> results */}
            <div
              data-float
              className="absolute left-5 top-5 flex items-center gap-3 rounded-2xl border border-white/20 bg-background/80 px-4 py-3 shadow-xl backdrop-blur-md sm:left-6 sm:top-6"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-leak-soft text-leak">
                <TrendingDown className="size-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-medium">Checkout leak</p>
                <p className="text-sm font-semibold tabular-nums text-leak">
                  -34%
                </p>
              </div>
            </div>

            <div
              data-float
              className="absolute bottom-5 right-5 flex items-center gap-3 rounded-2xl border border-white/20 bg-background/80 px-4 py-3 shadow-xl backdrop-blur-md sm:bottom-6 sm:right-6"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-profit-soft text-profit">
                <TrendingUp className="size-4" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-medium">Automated fix</p>
                <p className="text-sm font-semibold tabular-nums text-profit">
                  +28%
                </p>
              </div>
            </div>

            {/* Results chip: hidden on mobile so it can't collide with the fix chip */}
            <div
              data-float
              className="absolute bottom-5 left-5 hidden items-center gap-3 rounded-2xl border border-white/20 bg-background/80 px-4 py-3 shadow-xl backdrop-blur-md sm:bottom-6 sm:left-6 sm:flex"
            >
              <span className="grid size-9 place-items-center rounded-lg bg-shopify-soft text-shopify-deep">
                <Check className="size-4" strokeWidth={3} />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-medium">Results</p>
                <p className="text-sm font-semibold text-shopify-deep">
                  Improving
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
