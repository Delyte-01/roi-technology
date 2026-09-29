"use client";

import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  title: string;
  desc: string;
} & (
  | { kind: "count"; target: number; prefix?: string; suffix: string }
  | { kind: "text"; display: string }
);

const stats: Stat[] = [
  {
    kind: "count",
    target: 2,
    suffix: "+ Years",
    title: "Hands-on E-Commerce Experience",
    desc: "Running & growing real Shopify & WordPress stores.",
  },
  {
    kind: "text",
    display: "Zero",
    title: "100% Plain English Guarantees",
    desc: "No confusing consultant buzzwords.",
  },
  {
    kind: "text",
    display: "24/7",
    title: "Automated Systems Active",
    desc: "Your store never stops capturing sales.",
  },
  {
    kind: "count",
    target: 100,
    suffix: "%",
    title: "Non-Invasive Store Check",
    desc: "Zero code changes until you approve.",
  },
];

export function Credentials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: "[data-cred-head]", start: "top 82%", once: true },
          })
          .from("[data-cred-badge]", { opacity: 0, y: 14, scale: 0.9, duration: 0.8 })
          .from(
            "[data-cred-line]",
            { yPercent: 115, rotate: 2, transformOrigin: "0% 100%", duration: 1.2, stagger: 0.08 },
            "-=0.5",
          )
          .from("[data-cred-sub]", { opacity: 0, y: 18, duration: 0.9 }, "-=0.7");

        gsap.utils.toArray<HTMLElement>("[data-cred-card]").forEach((card, i) => {
          const valueEl = card.querySelector<HTMLElement>("[data-cred-value]");
          const isCount = card.dataset.kind === "count";

          const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          });

          tl.from(card, {
            opacity: 0,
            y: 48,
            scale: 0.96,
            duration: 1,
            delay: i * 0.08,
          }).from(
            "[data-cred-bar]",
            { scaleX: 0, transformOrigin: "0% 50%", duration: 0.7, ease: "power3.out" },
            "-=0.6",
          );

          if (isCount && valueEl) {
            const target = Number(card.dataset.target);
            const suffix = card.dataset.suffix ?? "";
            const state = { v: 0 };
            tl.to(
              state,
              {
                v: target,
                duration: 1.3,
                ease: "power2.out",
                onUpdate: () => {
                  valueEl.textContent = `${Math.round(state.v)}${suffix}`;
                },
              },
              "-=0.5",
            );
          } else if (valueEl) {
            tl.from(valueEl, { opacity: 0, y: 10, duration: 0.6, ease: "back.out(2)" }, "-=0.4");
          }
        });
      });

      // Lift + glow on hover (any pointer, harmless on touch since nothing to leave)
      const cleanups: Array<() => void> = [];
      gsap.utils.toArray<HTMLElement>("[data-cred-card]").forEach((card) => {
        const glow = card.querySelector<HTMLElement>("[data-cred-glow]");
        if (!glow) return;
        const enter = () => gsap.to(glow, { opacity: 1, duration: 0.5, ease: "power2.out" });
        const leave = () => gsap.to(glow, { opacity: 0, duration: 0.6, ease: "power2.out" });
        card.addEventListener("pointerenter", enter);
        card.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          card.removeEventListener("pointerenter", enter);
          card.removeEventListener("pointerleave", leave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-background py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div data-cred-head className="mx-auto max-w-2xl text-center">
          <span
            data-cred-badge
            className="inline-flex items-center rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
          >
            Real experience
          </span>

          <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-cred-line className="block will-change-transform">
                Built from real stores,{" "}
                <span className="text-muted-foreground">not theory.</span>
              </span>
            </span>
          </h2>

          <p data-cred-sub className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Over two years spent running and growing real Shopify and WordPress stores. ROI
            Technology wasn&apos;t built in a classroom, it was built by watching what actually
            makes stores win or lose money.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.title}
              data-cred-card
              data-kind={s.kind}
              data-target={s.kind === "count" ? s.target : undefined}
              data-suffix={s.kind === "count" ? s.suffix : undefined}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 will-change-transform"
            >
              <span
                aria-hidden
                data-cred-glow
                className="pointer-events-none absolute -top-16 left-1/2 size-40 -translate-x-1/2 rounded-full bg-primary/20 opacity-0 blur-2xl transition-opacity"
              />
              <span
                aria-hidden
                data-cred-bar
                className="absolute inset-x-0 top-0 h-1 origin-left bg-primary"
              />

              <p
                data-cred-value
                className="relative text-4xl font-bold tracking-tight text-primary tabular-nums"
              >
                {s.kind === "count" ? `0${s.suffix}` : s.display}
              </p>
              <h3 className="relative mt-3 text-base font-semibold leading-snug">{s.title}</h3>
              <p className="relative mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}