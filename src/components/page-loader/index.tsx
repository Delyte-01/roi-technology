"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { IRIS_ORIGIN, LogoMark, Wordmark } from "@/components/logo-mark";

const BG = "#0d0818";
const SEEN_KEY = "roi-loader-seen";

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

      const finish = () => {
        html.style.overflow = "";
        html.dataset.loaded = "true";
        window.dispatchEvent(new Event("loader:done"));
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
        setGone(true);
      };

      // Returning visitor: get out of the way quickly.
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
      gsap.set("[data-l-content]", { autoAlpha: 1 });

      let introDone = false;
      let ready = document.readyState === "complete";
      let exiting = false;

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
        gsap
          .timeline({ onComplete: finish })
          .to("[data-l-content]", {
            y: -36,
            scale: 0.94,
            opacity: 0,
            duration: 0.8,
            ease: "power3.in",
          })
          // The whole curtain (with its curved lower edge) slides up off the screen.
          .to(
            el,
            {
              y: () => -(window.innerHeight + 260),
              duration: 1.3,
              ease: "expo.inOut",
            },
            "-=0.35",
          )
          // Let the hero start while the curtain is still leaving.
          .call(
            () => {
              html.dataset.loaded = "true";
              window.dispatchEvent(new Event("loader:done"));
            },
            [],
            "-=0.75",
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
      const safety = window.setTimeout(onLoad, 6000); // never trap the visitor

      const mm = gsap.matchMedia();

      mm.add(
        ignoreReducedMotion
          ? "(min-width: 0px)"
          : "(prefers-reduced-motion: no-preference)",
        () => {
          const tl = gsap.timeline({
            defaults: { ease: "expo.out" },
            onComplete: () => {
              introDone = true;
              tryExit();
            },
          });

          gsap.fromTo(
            "[data-l-progress]",
            { scaleX: 0 },
            { scaleX: 1, duration: 2.6, ease: "power2.inOut" },
          );

          tl.from("[data-l-glow]", { opacity: 0, scale: 0.6, duration: 2 }, 0)
            // Eye wings sweep out from the centre
            .from(
              "[data-logo-wing='left']",
              { x: 90, opacity: 0, duration: 1.5 },
              0.1,
            )
            .from(
              "[data-logo-wing='right']",
              { x: -90, opacity: 0, duration: 1.5 },
              0.1,
            )
            // Aperture blades open one by one around the iris
            .from(
              "[data-logo-blade]",
              {
                rotate: -80,
                scale: 0.3,
                opacity: 0,
                svgOrigin: IRIS_ORIGIN,
                duration: 1.5,
                stagger: 0.09,
              },
              0.35,
            )
            // The arrow swoops in along its own curve
            .fromTo(
              "[data-logo-arrow-mask]",
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 1.3, ease: "power3.inOut" },
              "-=0.8",
            )
            // Wordmark letters rise out of their masks
            .from(
              "[data-char]",
              { yPercent: 115, duration: 1.1, stagger: 0.03 },
              "-=0.9",
            )
            .from("[data-tag]", { opacity: 0, y: 10, duration: 0.9 }, "-=0.6")
            .to({}, { duration: 0.35 }); // short hold before leaving
        },
      );

      if (!ignoreReducedMotion) {
        mm.add("(prefers-reduced-motion: reduce)", () => {
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
      className="fixed inset-0 z-[100] flex items-center justify-center will-change-transform"
      style={{ backgroundColor: BG }}
    >
      {/* Curved lower edge that trails the curtain as it lifts */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-full h-[10vw] max-h-40 min-h-16 [border-radius:0_0_50%_50%/0_0_100%_100%]"
        style={{ backgroundColor: BG }}
      />

      <div
        aria-hidden
        data-l-glow
        className="pointer-events-none absolute left-1/2 top-1/2 size-[36rem] max-w-[140vw] -translate-x-1/2 -translate-y-[60%] rounded-full bg-primary/25 blur-[110px]"
      />

      <div
        data-l-content
        style={{ visibility: "hidden" }}
        className="relative flex flex-col items-center px-6 text-white"
      >
        <LogoMark className="h-auto w-56 sm:w-72" />
        <Wordmark
          size="lg"
          className="mt-8 items-center text-center"
          accentClassName="text-violet-400"
        />
      </div>

      <div className="absolute bottom-12 left-1/2 h-px w-44 -translate-x-1/2 overflow-hidden bg-white/15">
        <div data-l-progress className="h-full origin-left bg-violet-400" />
      </div>
    </div>
  );
}
