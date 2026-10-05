"use client";

import { useRef } from "react";
import { ArrowRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// "stage" maps each step to the journey: Problem (previous section) -> Audit -> Fix -> Optimize -> Grow
const steps = [
  {
    stage: "Audit",
    title: "We look",
    body: "We go through your Shopify or WordPress store the way a customer would and find where you lose sales or waste time.",
    result: "A ranked list of leaks",
    tone: "brand" as const,
  },
  {
    stage: "Fix",
    title: "We fix",
    body: "We start with the biggest leaks: checkout, product pages and store setup, so the wins show up early.",
    result: "Your top leaks closed",
    tone: "brand" as const,
  },
  {
    stage: "Optimize",
    title: "We automate",
    body: "We set up checkout, listings and follow-ups to run without you, correctly, every time.",
    result: "Live automations",
    tone: "brand" as const,
  },
  {
    stage: "Grow",
    title: "You profit",
    body: "Everything is judged by one question: did it make you more money? We report the numbers weekly.",
    result: "A weekly numbers report",
    tone: "profit" as const,
  },
];

export function Steps() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const items = gsap.utils.toArray<HTMLElement>("[data-step]");

      const setCount = (n: number) => {
        if (counter.current) counter.current.textContent = String(n);
        if (bar.current)
          bar.current.style.transform = `scaleX(${n / steps.length})`;
      };

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Progress line fills as you scroll through the list
        gsap.fromTo(
          fill.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
              trigger: list.current,
              start: "top 60%",
              end: "bottom 60%",
              scrub: 0.4,
            },
          },
        );

        // Each step: idle -> current -> done, and back again when scrolling up
        items.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "bottom 60%",
            onEnter: () => {
              step.dataset.state = "current";
              setCount(i + 1);
            },
            onEnterBack: () => {
              step.dataset.state = "current";
              setCount(i + 1);
            },
            onLeave: () => (step.dataset.state = "done"),
            onLeaveBack: () => {
              step.dataset.state = "idle";
              setCount(Math.max(i, 1));
            },
          });
        });
      });

      // Reduced motion: everything visible in its final state
      mm.add("(prefers-reduced-motion: reduce)", () => {
        items.forEach((s) => (s.dataset.state = "done"));
        setCount(steps.length);
      });
    },
    { scope: root },
  );

  return (
    <section id="how-it-works" ref={root} className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[5fr_7fr] lg:gap-20">
        {/* Left: sticky heading + live progress */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Four steps that turn a leaking store into a growing one.
          </h2>
          <p className="mt-5 max-w-md text-pretty text-lg text-muted-foreground">
            No long projects and no guesswork. Every step ends with something
            you can see working.
          </p>
          <p className="mt-5 flex max-w-md items-center gap-3 text-base text-muted-foreground">
            <Store className="size-5 shrink-0 text-shopify-deep" aria-hidden />
            Works on Shopify, WordPress and WooCommerce stores.
          </p>

          <div className="mt-10 hidden max-w-xs lg:block" aria-hidden>
            <div className="flex items-baseline gap-2 text-sm text-muted-foreground">
              <span
                ref={counter}
                className="text-4xl font-semibold tabular-nums tracking-tight text-foreground"
              >
                1
              </span>
              <span>of {steps.length}</span>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-border">
              <div
                ref={bar}
                className="h-full origin-left rounded-full bg-primary transition-transform duration-500 ease-out"
                style={{ transform: `scaleX(${1 / steps.length})` }}
              />
            </div>
          </div>
        </div>

        {/* Right: timeline */}
        <div ref={list} className="relative">
          <div
            aria-hidden
            className="absolute top-4 bottom-4 left-[19px] w-px bg-border"
          />
          <div aria-hidden className="absolute top-4 bottom-4 left-[19px] w-px">
            <div
              ref={fill}
              className="relative h-full w-full origin-top bg-primary"
            >
              {/* soft glow behind the line */}
              <div className="absolute inset-y-0 -inset-x-[3px] bg-primary/50 blur-[6px]" />
            </div>
          </div>

          <ol className="relative space-y-6">
            {steps.map((s, i) => (
              <li
                key={s.title}
                data-step
                data-state="idle"
                className="group/step relative pl-16"
              >
                <span
                  aria-hidden
                  className="absolute top-6 left-0 grid size-10 place-items-center rounded-full border border-border bg-background text-sm font-semibold tabular-nums text-muted-foreground transition-all duration-500 group-data-[state=current]/step:scale-110 group-data-[state=current]/step:border-primary group-data-[state=current]/step:bg-primary group-data-[state=current]/step:text-primary-foreground group-data-[state=current]/step:shadow-[0_0_0_6px_color-mix(in_oklab,var(--color-primary)_18%,transparent)] group-data-[state=done]/step:border-primary group-data-[state=done]/step:text-primary"
                >
                  {i + 1}
                </span>

                <div className="rounded-2xl border border-transparent p-6 opacity-60 transition-all duration-500 group-data-[state=current]/step:border-border group-data-[state=current]/step:bg-card group-data-[state=current]/step:opacity-100 group-data-[state=current]/step:shadow-lg group-data-[state=current]/step:shadow-black/5 group-data-[state=done]/step:opacity-80">
                  <p className="text-sm font-medium text-primary">{s.stage}</p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-pretty text-muted-foreground">
                    {s.body}
                  </p>
                  {s.tone === "profit" ? (
                    <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-profit/30 bg-profit-soft px-3 py-1 text-sm font-medium text-profit">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-profit"
                      />
                      {s.result}
                    </p>
                  ) : (
                    <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-sm text-foreground/80">
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-primary"
                      />
                      {s.result}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          {/* Next action */}
          <div className="mt-10 pl-16">
            <Button
              asChild
              size="lg"
              className="group h-13 rounded-full px-7 text-base"
            >
              <a href="#contact">
                Start with step one: free store check
                <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
