"use client";

import { useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/gsap";

gsap.registerPlugin(ScrollTrigger);

type Stat = {
  title: string;
  desc: string;
} & (
  | { kind: "count"; target: number; suffix: string }
  | { kind: "text"; display: string }
);

const stats: Stat[] = [
  {
    kind: "count",
    target: 2,
    suffix: "+ years",
    title: "Hands-on ecommerce experience",
    desc: "Running and growing real Shopify and WordPress stores.",
  },
  {
    kind: "text",
    display: "Zero",
    title: "Jargon in your reports",
    desc: "Plain English only. No confusing consultant buzzwords.",
  },
  {
    kind: "text",
    display: "24/7",
    title: "Automated systems active",
    desc: "Your store never stops capturing sales.",
  },
  {
    kind: "count",
    target: 100,
    suffix: "%",
    title: "Non-invasive store check",
    desc: "Zero code changes until you approve.",
  },
];

export function Credentials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Entrance + count-up. Skipped entirely under reduced motion, in which
      // case the server-rendered final values simply stay on screen.
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: {
              trigger: "[data-cred-head]",
              start: "top 82%",
              once: true,
            },
          })
          .from("[data-cred-badge]", { opacity: 0, y: 14, duration: 0.8 })
          .from(
            "[data-cred-line]",
            {
              yPercent: 115,
              rotate: 2,
              transformOrigin: "0% 100%",
              duration: 1.2,
            },
            "-=0.5",
          )
          .from(
            "[data-cred-sub]",
            { opacity: 0, y: 18, duration: 0.9 },
            "-=0.7",
          );

        gsap.utils
          .toArray<HTMLElement>("[data-cred-card]")
          .forEach((card, i) => {
            const numEl = card.querySelector<HTMLElement>("[data-cred-num]");
            const barEl = card.querySelector<HTMLElement>("[data-cred-bar]");
            const textEl = card.querySelector<HTMLElement>("[data-cred-text]");

            const tl = gsap.timeline({
              defaults: { ease: "expo.out" },
              scrollTrigger: { trigger: card, start: "top 88%", once: true },
            });

            tl.from(card, { opacity: 0, y: 40, duration: 1, delay: i * 0.08 });

            if (barEl) {
              tl.from(
                barEl,
                {
                  scaleX: 0,
                  transformOrigin: "0% 50%",
                  duration: 0.7,
                  ease: "power3.out",
                },
                "-=0.6",
              );
            }

            if (numEl && card.dataset.kind === "count") {
              const target = Number(card.dataset.target);
              const state = { v: 0 };
              numEl.textContent = "0";
              tl.to(
                state,
                {
                  v: target,
                  duration: 1.3,
                  ease: "power2.out",
                  onUpdate: () => {
                    numEl.textContent = String(Math.round(state.v));
                  },
                  onComplete: () => {
                    numEl.textContent = String(target);
                  },
                },
                "-=0.5",
              );
            } else if (textEl) {
              tl.from(
                textEl,
                { opacity: 0, y: 10, duration: 0.6, ease: "back.out(2)" },
                "-=0.4",
              );
            }
          });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="credentials-heading"
      className="relative bg-background py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div data-cred-head className="mx-auto max-w-2xl text-center">
          <span
            data-cred-badge
            className="inline-flex items-center gap-2 rounded-full bg-shopify-soft px-4 py-1.5 text-sm font-medium text-shopify-deep dark:bg-shopify/15 dark:text-shopify"
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-shopify-deep dark:bg-shopify"
            />
            Real Shopify &amp; WordPress experience
          </span>

          <h2
            id="credentials-heading"
            className="mt-5 text-3xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-5xl"
          >
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-cred-line className="block will-change-transform">
                Built from real{" "}
                <span className="text-shopify-deep dark:text-shopify">
                  Shopify &amp; WordPress
                </span>{" "}
                stores,{" "}
                <span className="text-muted-foreground">not theory.</span>
              </span>
            </span>
          </h2>

          <p
            data-cred-sub
            className="mt-5 text-lg leading-relaxed text-muted-foreground"
          >
            Over two years spent running and growing real Shopify and WordPress
            stores. ROI Technology wasn&apos;t built in a classroom. It was
            built by watching what actually makes stores win or lose money.
          </p>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          {stats.map((s) => (
            <li
              key={s.title}
              data-cred-card
              data-kind={s.kind}
              data-target={s.kind === "count" ? s.target : undefined}
              className="relative overflow-hidden rounded-2xl border bg-card p-6 transition-colors duration-300 hover:border-primary/40"
            >
              <span
                aria-hidden
                data-cred-bar
                className="absolute inset-x-0 top-0 h-1 origin-left bg-primary"
              />

              {s.kind === "count" ? (
                <p className="text-4xl font-bold tracking-tight text-primary tabular-nums">
                  <span data-cred-num>{s.target}</span>
                  <span className="text-shopify-deep dark:text-shopify">
                    {s.suffix}
                  </span>
                </p>
              ) : (
                <p
                  data-cred-text
                  className="text-4xl font-bold tracking-tight text-primary tabular-nums"
                >
                  {s.display}
                </p>
              )}

              <h3 className="mt-3 text-base font-semibold leading-snug">
                {s.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
