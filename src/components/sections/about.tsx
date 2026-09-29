"use client";

import { useRef, useState } from "react";
import { ArrowRight, Eye, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap, useGSAP } from "@/lib/gsap";
import { LogoMark, Wordmark } from "@/components/logo-mark";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const meanings = [
  {
    id: "el-roi",
    tab: "El-Roi",
    icon: Eye,
    title: "El-Roi (Hebrew origin)",
    body: "\u201CThe God Who Sees\u201D, a name for someone who notices what everyone else walks past without seeing.",
    tint: "border-violet-200 bg-violet-50 dark:border-violet-500/20 dark:bg-violet-500/10",
    accent: "text-violet-700 dark:text-violet-400",
  },
  {
    id: "roi",
    tab: "ROI",
    icon: Target,
    title: "Return on investment",
    body: "The primary metric every business owner chases. We judge every technology system by what it earns you back.",
    tint: "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10",
    accent: "text-amber-700 dark:text-amber-400",
  },
];

const steps = [
  { label: "Inspect", sub: "Find the leaks" },
  { label: "Deploy", sub: "Fix with tech" },
  { label: "Measure", sub: "Track the profit" },
];

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Origin() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectTab(next: number, focus = false) {
    if (next === active) return;
    const out = panelRefs.current[active];
    const inn = panelRefs.current[next];
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
    if (!out || !inn || !root.current) return;

    const pill = root.current.querySelector("[data-tab-pill]");
    gsap.killTweensOf([out, inn, pill]);

    if (reduced()) {
      gsap.set(out, { opacity: 0 });
      gsap.set(inn, { opacity: 1, y: 0, filter: "none" });
      gsap.set(pill, { xPercent: next * 100 });
      return;
    }

    gsap.to(pill, { xPercent: next * 100, duration: 0.8, ease: "expo.out" });
    gsap.to(out, {
      opacity: 0,
      y: -12,
      filter: "blur(6px)",
      duration: 0.35,
      ease: "power3.in",
    });
    gsap.fromTo(
      inn,
      { opacity: 0, y: 18, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        delay: 0.25,
        ease: "expo.out",
        clearProps: "filter",
      },
    );
  }

  function onTabKey(e: React.KeyboardEvent, i: number) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown")
      selectTab((i + 1) % meanings.length, true);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      selectTab((i - 1 + meanings.length) % meanings.length, true);
  }

  useGSAP(
    () => {
      // Static setup (safe for every motion preference)
      gsap.set("[data-origin-border]", { xPercent: -50, yPercent: -50 });
      gsap.set(panelRefs.current[1], { opacity: 0 });

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Left card: unveil, then stage, tabs and steps in sequence
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
            "[data-ring]",
            {
              opacity: 0,
              scale: 0.6,
              svgOrigin: "200 130",
              duration: 1.4,
              stagger: 0.12,
            },
            "-=1",
          )
          .from(
            "[data-origin-logo]",
            { opacity: 0, scale: 0.85, filter: "blur(10px)", duration: 1.2 },
            "-=1.1",
          )
          .from(
            "[data-origin-tabs]",
            { opacity: 0, y: 22, duration: 1 },
            "-=0.8",
          )
          .from(
            "[data-step-line]",
            { scaleX: 0, transformOrigin: "0% 50%", duration: 1.2 },
            "-=0.5",
          )
          .from(
            "[data-step]",
            { opacity: 0, y: 14, duration: 0.8, stagger: 0.14 },
            "<0.1",
          );

        // Ambient motion: border sweep, radar sweep, dashed ring, blips
        gsap.to("[data-origin-border]", {
          rotation: 360,
          duration: 12,
          ease: "none",
          repeat: -1,
        });
        gsap.to("[data-radar]", {
          rotation: 360,
          duration: 7,
          ease: "none",
          repeat: -1,
        });
        gsap.to("[data-ring-spin]", {
          rotation: -360,
          svgOrigin: "200 130",
          duration: 60,
          ease: "none",
          repeat: -1,
        });
        gsap.utils.toArray<SVGElement>("[data-blip]").forEach((el, i) => {
          gsap.fromTo(
            el,
            { scale: 1, opacity: 0.7 },
            {
              scale: 4.5,
              opacity: 0,
              duration: 2.4,
              ease: "expo.out",
              repeat: -1,
              repeatDelay: 0.6,
              delay: 1.2 + i * 0.9,
            },
          );
        });

        // Right column
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

        gsap.fromTo(
          "[data-origin-quote]",
          { boxShadow: "0 0 0 0 rgba(217,119,6,0.25)" },
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

      // Pointer effects (mouse only)
      mm.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const q = <T extends HTMLElement>(s: string) =>
            root.current?.querySelector<T>(s) ?? null;
          const card = q("[data-origin-card]");
          const stage = q("[data-origin-stage]");
          const view = q("[data-origin-view]");
          const spot = q("[data-spot]");
          const logo = q("[data-origin-logo]");
          const cta = q("[data-origin-magnetic]");
          const cleanups: Array<() => void> = [];

          if (card && stage && view && logo) {
            const rx = gsap.quickTo(card, "rotationX", {
              duration: 0.9,
              ease: "power3.out",
            });
            const ry = gsap.quickTo(card, "rotationY", {
              duration: 0.9,
              ease: "power3.out",
            });
            const lx = gsap.quickTo(logo, "x", {
              duration: 1.1,
              ease: "power3.out",
            });
            const ly = gsap.quickTo(logo, "y", {
              duration: 1.1,
              ease: "power3.out",
            });
            gsap.set(card, { transformPerspective: 1000 });

            // Spotlight follows the pointer with a soft lag
            const cur = { x: 0, y: 0 };
            const tgt = { x: 0, y: 0 };
            const centre = () => {
              const r = view.getBoundingClientRect();
              tgt.x = r.width / 2;
              tgt.y = r.height / 2;
            };
            centre();
            cur.x = tgt.x;
            cur.y = tgt.y;
            const tick = () => {
              const dx = tgt.x - cur.x;
              const dy = tgt.y - cur.y;
              if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) return;
              cur.x += dx * 0.12;
              cur.y += dy * 0.12;
              view.style.setProperty("--mx", `${cur.x}px`);
              view.style.setProperty("--my", `${cur.y}px`);
            };
            gsap.ticker.add(tick);

            const move = (e: PointerEvent) => {
              const s = stage.getBoundingClientRect();
              const px = (e.clientX - s.left) / s.width - 0.5;
              const py = (e.clientY - s.top) / s.height - 0.5;
              ry(px * 6);
              rx(py * -6);
              lx(px * -14);
              ly(py * -14);
              const v = view.getBoundingClientRect();
              tgt.x = e.clientX - v.left;
              tgt.y = e.clientY - v.top;
            };
            const enter = () =>
              gsap.to(spot, { opacity: 1, duration: 0.6, ease: "power2.out" });
            const leave = () => {
              rx(0);
              ry(0);
              lx(0);
              ly(0);
              centre();
              gsap.to(spot, { opacity: 0, duration: 0.8, ease: "power2.out" });
            };
            stage.addEventListener("pointermove", move);
            stage.addEventListener("pointerenter", enter);
            stage.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              gsap.ticker.remove(tick);
              stage.removeEventListener("pointermove", move);
              stage.removeEventListener("pointerenter", enter);
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
        },
      );
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
          {/* ------------------------------------------------------------ */}
          {/* Left: the lens                                                */}
          {/* ------------------------------------------------------------ */}
          <div data-origin-stage className="lg:sticky lg:top-32 lg:self-start">
            {/* Outer shell doubles as the animated border */}
            <div
              data-origin-card
              className="relative overflow-hidden rounded-[1.75rem] bg-border p-px shadow-2xl shadow-primary/10 will-change-transform"
            >
              <div
                aria-hidden
                data-origin-border
                className="absolute left-1/2 top-1/2 aspect-square w-[170%]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, transparent 240deg, rgba(139,92,246,0.9) 305deg, rgba(217,119,6,0.9) 340deg, transparent 360deg)",
                }}
              />

              <div className="relative rounded-[calc(1.75rem-1px)] bg-card p-3">
                {/* Stage */}
                <div
                  data-origin-view
                  className="relative h-72 overflow-hidden rounded-2xl border bg-gradient-to-b from-background to-muted/60 sm:h-80"
                >
                  {/* Grid, fading out toward the edges */}
                  <svg
                    aria-hidden
                    className="absolute inset-0 size-full text-foreground/[0.07]"
                    style={{
                      maskImage:
                        "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse at center, black 30%, transparent 75%)",
                    }}
                  >
                    <defs>
                      <pattern
                        id="origin-grid"
                        width="28"
                        height="28"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M28 0H0V28"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#origin-grid)" />
                  </svg>

                  {/* Pointer spotlight */}
                  <div
                    aria-hidden
                    data-spot
                    className="pointer-events-none absolute inset-0 opacity-0"
                    style={{
                      background:
                        "radial-gradient(240px circle at var(--mx, 50%) var(--my, 50%), rgba(139,92,246,0.18), transparent 70%)",
                    }}
                  />

                  {/* Radar sweep */}
                  <div
                    aria-hidden
                    data-radar
                    className="absolute left-1/2 top-1/2 size-[17rem] -translate-x-1/2 -translate-y-1/2 rounded-full sm:size-[19rem]"
                    style={{
                      background:
                        "conic-gradient(from 0deg, transparent 0deg, transparent 290deg, rgba(139,92,246,0.28) 360deg)",
                      maskImage:
                        "radial-gradient(circle, transparent 18%, black 19%, black 70%, transparent 71%)",
                      WebkitMaskImage:
                        "radial-gradient(circle, transparent 18%, black 19%, black 70%, transparent 71%)",
                    }}
                  />

                  {/* Rings + blips */}
                  <svg
                    aria-hidden
                    viewBox="0 0 400 260"
                    preserveAspectRatio="xMidYMid slice"
                    className="absolute inset-0 size-full"
                    fill="none"
                  >
                    <circle
                      data-ring
                      cx="200"
                      cy="130"
                      r="62"
                      className="stroke-violet-500/30"
                    />
                    <circle
                      data-ring
                      cx="200"
                      cy="130"
                      r="96"
                      className="stroke-violet-500/20"
                    />
                    <g data-ring-spin>
                      <circle
                        data-ring
                        cx="200"
                        cy="130"
                        r="128"
                        strokeDasharray="2 7"
                        strokeLinecap="round"
                        className="stroke-violet-500/40"
                      />
                    </g>
                    {[
                      [262, 92],
                      [138, 176],
                      [286, 176],
                    ].map(([x, y]) => (
                      <g key={`${x}-${y}`}>
                        <circle
                          data-blip
                          cx={x}
                          cy={y}
                          r="3"
                          className="fill-amber-500"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="3"
                          className="fill-amber-500"
                        />
                      </g>
                    ))}
                  </svg>

                  {/* Logo */}
                  <div className="absolute inset-0 grid place-items-center">
                    <div
                      data-origin-logo
                      className="flex flex-col items-center gap-3 text-foreground will-change-transform"
                    >
                      <LogoMark className="h-auto w-20" arrowColor="#1f1235" />
                      <Wordmark accentClassName="text-primary" />
                    </div>
                  </div>

                  {/* Status chip */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-500/70 motion-reduce:animate-none" />
                      <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
                    </span>
                    Scanning for leaks
                  </div>
                </div>

                {/* Meanings: tabs */}
                <div data-origin-tabs className="mt-4 px-1">
                  <div
                    role="tablist"
                    aria-label="What ROI means"
                    className="relative grid grid-cols-2 rounded-full border bg-muted/60 p-1"
                  >
                    <span
                      aria-hidden
                      data-tab-pill
                      className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem-0.5px)] rounded-full border bg-background shadow-sm"
                    />
                    {meanings.map((m, i) => (
                      <button
                        key={m.id}
                        ref={(el) => {
                          tabRefs.current[i] = el;
                        }}
                        type="button"
                        role="tab"
                        id={`origin-tab-${m.id}`}
                        aria-selected={active === i}
                        aria-controls={`origin-panel-${m.id}`}
                        tabIndex={active === i ? 0 : -1}
                        onClick={() => selectTab(i)}
                        onKeyDown={(e) => onTabKey(e, i)}
                        className="relative z-10 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors duration-300 focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-selected:text-foreground"
                      >
                        {m.tab}
                      </button>
                    ))}
                  </div>

                  {/* Panels share one grid cell so the card never changes height */}
                  <div className="mt-3 grid">
                    {meanings.map((m, i) => {
                      const Icon = m.icon;
                      return (
                        <div
                          key={m.id}
                          ref={(el) => {
                            panelRefs.current[i] = el;
                          }}
                          role="tabpanel"
                          id={`origin-panel-${m.id}`}
                          aria-labelledby={`origin-tab-${m.id}`}
                          aria-hidden={active !== i}
                          className={cn(
                            "rounded-xl border p-4 [grid-area:1/1]",
                            m.tint,
                            active !== i && "pointer-events-none",
                          )}
                        >
                          <div
                            className={cn("flex items-center gap-2", m.accent)}
                          >
                            <Icon className="size-4" aria-hidden />
                            <span className="text-sm font-semibold">
                              {m.title}
                            </span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                            {m.body}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Process: a real sequence, so the connecting line earns its place */}
                <ol className="relative mt-6 grid grid-cols-3 gap-2 px-1 pb-2">
                  <span
                    aria-hidden
                    className="absolute left-[16.66%] right-[16.66%] top-[7px] h-px bg-border"
                  >
                    <span
                      data-step-line
                      className="absolute inset-0 bg-primary/60"
                    />
                  </span>
                  {steps.map((s) => (
                    <li
                      key={s.label}
                      data-step
                      className="relative flex flex-col items-center text-center"
                    >
                      <span className="relative z-10 size-3.5 rounded-full border-2 border-primary bg-card" />
                      <span className="mt-2 text-sm font-semibold">
                        {s.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {s.sub}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------ */}
          {/* Right: story copy (unchanged)                                 */}
          {/* ------------------------------------------------------------ */}
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
