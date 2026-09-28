"use client";

import { useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { IRIS_ORIGIN, LogoMark, Wordmark } from "@/components/logo-mark";

const BG = "#0d0818";
const SEEN_KEY = "roi-loader-seen";
const WORDS = ["Auditing", "Automating", "Growing"];

type PageLoaderProps = {
  /** Only play the full sequence on the first visit of a browser session. Off by default. */
  oncePerSession?: boolean;
  /** Play the full animation even if the device has "reduce motion" turned on. */
  ignoreReducedMotion?: boolean;
};

export function PageLoader({
  oncePerSession = false,
  ignoreReducedMotion = false,
}: PageLoaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const maskId = `roi-eye-${useId().replace(/:/g, "")}`;

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      const html = document.documentElement;
      const reduced =
        !ignoreReducedMotion &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      let seen = false;
      try {
        seen = oncePerSession && sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}

      const announce = () => {
        html.dataset.loaded = "true";
        window.dispatchEvent(new Event("loader:done"));
      };
      const finish = () => {
        html.style.overflow = "";
        announce();
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        setGone(true);
      };

      if (seen) {
        gsap.to(el, {
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
          onComplete: finish,
        });
        return;
      }

      html.style.overflow = "hidden";

      let introDone = false;
      let ready = document.readyState === "complete";
      let exiting = false;

      /* ---------- EXIT: the eye opens ---------- */
      const exit = () => {
        if (reduced) {
          gsap.to(el, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
            onComplete: finish,
          });
          return;
        }
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const tl = gsap.timeline({ onComplete: finish });
        tl.set(el, { pointerEvents: "none" })
          // UI leaves: logo zooms toward the viewer, counter and words slide out
          .to("[data-l-logo]", {
            scale: 1.2,
            opacity: 0,
            duration: 0.85,
            ease: "power3.in",
          })
          .to(
            ["[data-l-count-inner]", "[data-l-words-inner]"],
            { yPercent: -120, duration: 0.7, ease: "power3.in", stagger: 0.05 },
            "<0.05",
          )
          .to("[data-l-bar-wrap]", { opacity: 0, duration: 0.4 }, "<")
          .to("[data-l-glow]", { opacity: 0, duration: 0.6 }, "<")
          // Stage 1: the eyelid slit splits along the hairline
          .to(
            "[data-l-hole]",
            {
              attr: { rx: vw * 0.95, ry: 2.5 },
              duration: 0.95,
              ease: "expo.inOut",
            },
            "-=0.15",
          )
          .to("[data-l-line]", { opacity: 0, duration: 0.5 }, "<0.55")
          // Stage 2: it opens fully and the page underneath is revealed
          .call(announce, [], "-=0.05")
          .to(
            "[data-l-hole]",
            { attr: { ry: vh * 0.95 }, duration: 1.35, ease: "expo.inOut" },
            "<",
          );
      };

      const tryExit = () => {
        if (introDone && ready && !exiting) {
          exiting = true;
          exit();
        }
      };

      const onLoad = () => {
        ready = true;
        tryExit();
      };
      if (!ready) window.addEventListener("load", onLoad);
      const safety = window.setTimeout(onLoad, 7000); // never trap the visitor

      const mm = gsap.matchMedia();

      /* ---------- ENTRANCE ---------- */
      mm.add(
        ignoreReducedMotion
          ? "(min-width: 0px)"
          : "(prefers-reduced-motion: no-preference)",
        () => {
          const parts = gsap.utils.toArray<SVGPathElement>("[data-logo-part]");
          const countEl = el.querySelector<HTMLElement>("[data-l-count]");
          const progress = { v: 0 };

          // Starting states
          gsap.set("[data-l-layer]", { autoAlpha: 1 });
          gsap.set("[data-l-line]", { scaleX: 0, transformOrigin: "50% 50%" });
          gsap.set("[data-l-bar]", { scaleX: 0, transformOrigin: "0% 50%" });
          gsap.set("[data-l-words-inner]", { yPercent: 110 });
          gsap.set(parts, {
            stroke: "#c9a8ff",
            strokeWidth: 2.2,
            strokeDasharray: 1,
            strokeDashoffset: 1,
            fillOpacity: 0,
          });
          gsap.set("[data-logo-arrow]", { opacity: 1 });

          const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            onComplete: () => {
              introDone = true;
              tryExit();
            },
          });

          // Master counter drives the number and the progress line
          tl.to(
            progress,
            {
              v: 100,
              duration: 3.6,
              ease: "power2.inOut",
              onUpdate: () => {
                if (countEl)
                  countEl.textContent = String(Math.round(progress.v)).padStart(
                    3,
                    "0",
                  );
                gsap.set("[data-l-bar]", { scaleX: progress.v / 100 });
              },
            },
            0,
          );

          tl.from("[data-l-glow]", { opacity: 0, scale: 0.5, duration: 2.4 }, 0)
            .to(
              "[data-l-line]",
              { scaleX: 1, duration: 1.4, ease: "expo.inOut" },
              0.1,
            )
            .from(
              "[data-l-tick]",
              { opacity: 0, y: 14, duration: 1, stagger: 0.1 },
              0.3,
            )
            // Outlines draw themselves, wings first then the aperture blades
            .to(
              parts,
              {
                strokeDashoffset: 0,
                duration: 1.7,
                ease: "power2.inOut",
                stagger: 0.09,
              },
              0.35,
            )
            .from(
              "[data-logo-blade]",
              {
                rotate: -70,
                opacity: 0.001,
                svgOrigin: IRIS_ORIGIN,
                duration: 1.8,
                stagger: 0.09,
              },
              0.6,
            )
            // Fill floods in, outline dissolves
            .to(
              parts,
              {
                fillOpacity: 1,
                duration: 0.9,
                ease: "power2.out",
                stagger: 0.05,
              },
              1.9,
            )
            .to(
              parts,
              { strokeOpacity: 0, duration: 0.8, ease: "power1.out" },
              2.3,
            )
            // Arrow swoops along its own curve
            .fromTo(
              "[data-logo-arrow-mask]",
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 1.2, ease: "power3.inOut" },
              2.35,
            )
            // Wordmark
            .from(
              "[data-char]",
              { yPercent: 115, duration: 1.1, stagger: 0.03 },
              2.7,
            )
            .from("[data-tag]", { opacity: 0, y: 10, duration: 0.9 }, 3.1)
            // Status words cycle with the progress
            .to(
              "[data-l-words-inner]:nth-child(1)",
              { yPercent: 0, duration: 0.8 },
              0.4,
            )
            .to(
              "[data-l-words-inner]:nth-child(1)",
              { yPercent: -110, duration: 0.7, ease: "power3.in" },
              1.4,
            )
            .to(
              "[data-l-words-inner]:nth-child(2)",
              { yPercent: 0, duration: 0.8 },
              1.6,
            )
            .to(
              "[data-l-words-inner]:nth-child(2)",
              { yPercent: -110, duration: 0.7, ease: "power3.in" },
              2.6,
            )
            .to(
              "[data-l-words-inner]:nth-child(3)",
              { yPercent: 0, duration: 0.8 },
              2.8,
            )
            // Short hold on the finished logo before leaving
            .to({}, { duration: 0.4 }, ">");
        },
      );

      if (!ignoreReducedMotion) {
        mm.add("(prefers-reduced-motion: reduce)", () => {
          gsap.set("[data-l-layer]", { autoAlpha: 1 });
          gsap.delayedCall(0.9, () => {
            introDone = true;
            tryExit();
          });
        });
      }

      return () => {
        window.removeEventListener("load", onLoad);
        window.clearTimeout(safety);
        html.style.overflow = "";
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      role="status"
      aria-label="Loading ROI Technology"
      className="fixed inset-0 z-[100]"
    >
      {/* Dark backdrop with a growing almond-shaped hole that becomes the exit */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <rect width="100%" height="100%" fill="#fff" />
            <ellipse data-l-hole cx="50%" cy="50%" rx="0" ry="0" fill="#000" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill={BG} mask={`url(#${maskId})`} />
      </svg>

      <div
        data-l-layer
        style={{ visibility: "hidden" }}
        className="absolute inset-0 text-white"
      >
        <div
          aria-hidden
          data-l-glow
          className="pointer-events-none absolute left-1/2 top-1/2 size-[38rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[120px]"
        />

        {/* Hairline that the exit slit opens from */}
        <div
          aria-hidden
          data-l-line
          className="absolute inset-x-0 top-1/2 h-px bg-white/30"
        />

        {/* Logo + wordmark */}
        <div
          data-l-logo
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
        >
          <LogoMark className="h-auto w-56 sm:w-72 lg:w-80" />
          <Wordmark
            size="lg"
            className="mt-8 items-center text-center"
            accentClassName="text-violet-400"
          />
        </div>

        {/* Corner details */}
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between px-6 pt-6 text-[11px] uppercase tracking-[0.2em] text-white/50 sm:px-10 sm:pt-8">
          <span data-l-tick>ROI Technology</span>
          <span data-l-tick>Store audits &amp; automation</span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="overflow-hidden">
            <span
              data-l-count-inner
              className="block text-6xl font-semibold leading-none tracking-[-0.05em] tabular-nums sm:text-8xl"
            >
              <span data-l-count>000</span>
            </span>
          </div>

          <div className="relative h-5 w-28 overflow-hidden text-right text-xs uppercase tracking-[0.2em] text-violet-300 sm:w-36 sm:text-sm">
            {WORDS.map((w) => (
              <span
                key={w}
                data-l-words-inner
                className="absolute inset-x-0 top-0 block"
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        <div
          data-l-bar-wrap
          className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10"
        >
          <div data-l-bar className="h-full bg-violet-400" />
        </div>
      </div>
    </div>
  );
}
