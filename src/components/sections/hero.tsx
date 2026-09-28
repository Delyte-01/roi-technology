"use client";

import { useRef } from "react";
import { ArrowRight, Clock, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/gsap";
import Image from "next/image";

const auditRows = [
  {
    icon: TrendingDown,
    title: "Checkout leak",
    detail: "68 of 100 buyers drop off at payment",
    count: 34,
    prefix: "-",
    suffix: "%",
    tone: "leak" as const,
  },
  {
    icon: Clock,
    title: "Manual busywork",
    detail: "Stock and price updates done by hand",
    count: 14,
    prefix: "",
    suffix: " hrs/wk",
    tone: "leak" as const,
  },
  {
    icon: TrendingUp,
    title: "Automated fix",
    detail: "Checkout and follow-up sequences ready",
    count: 28,
    prefix: "+",
    suffix: "%",
    tone: "profit" as const,
  },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const counters = gsap.utils.toArray<HTMLElement>("[data-count]");

        counters.forEach((el) => {
          el.textContent = `${el.dataset.prefix ?? ""}0${el.dataset.suffix ?? ""}`;
        });

        // CHANGED: start paused so nothing plays behind the loader
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
            "[data-card-head]",
            { opacity: 0, y: 12, duration: 0.8 },
            "-=0.9",
          )
          .from(
            "[data-bar-paid]",
            {
              scaleX: 0,
              transformOrigin: "0% 50%",
              duration: 1.1,
              ease: "power4.out",
            },
            "-=0.6",
          )
          .from(
            "[data-bar-leak]",
            {
              scaleX: 0,
              transformOrigin: "0% 50%",
              duration: 1.4,
              ease: "power4.inOut",
            },
            "-=0.7",
          )
          .from(
            "[data-bar-label]",
            { opacity: 0, y: 8, duration: 0.7, stagger: 0.1 },
            "-=0.9",
          )
          .from(
            "[data-audit-row]",
            { opacity: 0, x: 32, duration: 0.9, stagger: 0.12 },
            "-=1.1",
          );

        counters.forEach((el, i) => {
          const state = { v: 0 };
          tl.to(
            state,
            {
              v: Number(el.dataset.count),
              duration: 1.6,
              ease: "power3.out",
              onUpdate: () => {
                el.textContent = `${el.dataset.prefix ?? ""}${Math.round(state.v)}${el.dataset.suffix ?? ""}`;
              },
            },
            i === 0 ? "-=1.2" : "<0.12",
          );
        });

        // NEW: wait for the loader, then play
        const start = () => tl.play();
        let fallback = 0;

        if (document.documentElement.dataset.loaded) {
          start(); // loader already finished (e.g. returning visitor)
        } else {
          window.addEventListener("loader:done", start, { once: true });
          // Safety net: if there is no loader on this page, never leave the hero hidden
          fallback = window.setTimeout(start, 10000);
        }

        // Ambient glow drift (starts immediately, it's hidden behind the loader anyway)
        gsap.to("[data-glow]", {
          x: 60,
          y: 30,
          duration: 9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

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
          // NEW: remove the loader listener and safety timer
          window.removeEventListener("loader:done", start);
          window.clearTimeout(fallback);
        };
      });
    },
    { scope: root },
  );
  return (
    <section id="home" ref={root} className="relative isolate overflow-hidden">
      {/* Backdrop: faint grid that fades out, plus one soft glow */}

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-24 md:py-35 sm:px-8  lg:min-h-[calc(100svh-4rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 ">
        {/* Copy */}
        <div>
          <h1 className="text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-[5rem]">
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
            className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground sm:text-xl sm:leading-relaxed"
          >
            We find the hidden problems in your online store, then fix them with
            smart automation, so you sell more without doing more.
          </p>

          <div data-fade className="mt-10 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              data-magnetic
              className="group h-13 rounded-full px-7 text-base will-change-transform"
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
              className="h-13 rounded-full px-6 text-base will-change-transform"
            >
              <a href="#">See how much you&apos;re losing</a>
            </Button>
          </div>

          <p data-fade className="mt-6 text-sm text-muted-foreground">
            Takes 2 minutes. No obligation. Built for Shopify and WordPress
            stores.
          </p>
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
                className="object-cover w-full  h-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
            </div>

            {/* Legibility gradient */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
            />

            {/* Cursor-following glare */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.22), transparent 60%)",
              }}
            />

            {/* Floating chips (different depths for parallax) */}
            <div
              data-float
              data-depth="26"
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
              data-depth="42"
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
          </div>
        </div>
      </div>
    </section>
  );
}
