"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { gsap, useGSAP } from "@/lib/gsap";
import { nav } from "@/lib/site";
import Image from "next/image";

const NO_MOTION = "(prefers-reduced-motion: no-preference)";

function Logo() {
  return (
    <a
      href="#home"
      data-header-item
      className="flex items-center gap-2.5 rounded-md leading-none outline-offset-4"
      aria-label="ROI Technology home"
    >
      {/* Put your file in /public, e.g. /public/logo.png (SVG works too) */}
      <Image
        src="https://res.cloudinary.com/dk5mfu099/image/upload/v1790618021/WhatsApp_Image_2026-09-28_at_7.42.46_AM-removebg-preview_gza7d4.png"
        alt="logo"
        width={56}
        height={56}
        priority
        className="size-16  shrink-0 object-contain"
      />

      <span className="flex flex-col">
        <span className="text-xl font-semibold tracking-[-0.03em] uppercase">
          roi<span className="text-primary">technology</span>
        </span>
        <span className="mt-1 text-[10px] uppercase font-medium tracking-wide text-profit">El-roi .
          Return on investment
        </span>
      </span>
    </a>
  );
}

export function Header() {
  const root = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const move = useRef<{
    x: (v: number) => void;
    w: (v: number) => void;
  } | null>(null);

  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  /* Load sequence + scroll behaviour */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const el = root.current;
      if (!el) return;

      // Compact pill style once the page has scrolled. The header always stays visible.
      const setScrolled = () => {
        el.dataset.scrolled = String(window.scrollY > 16);
      };
      setScrolled();
      window.addEventListener("scroll", setScrolled, { passive: true });

      mm.add(NO_MOTION, () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(el, { yPercent: -130, duration: 1.3, clearProps: "transform" })
          .from(
            "[data-header-item]",
            {
              opacity: 0,
              y: -14,
              duration: 0.9,
              stagger: 0.07,
              clearProps: "opacity,transform",
            },
            "-=0.9",
          );
      });

      return () => window.removeEventListener("scroll", setScrolled);
    },
    { scope: root },
  );

  /* Sliding nav indicator */
  useGSAP(
    () => {
      const pill = indicator.current;
      if (!pill) return;
      move.current = {
        x: gsap.quickTo(pill, "x", { duration: 0.7, ease: "expo.out" }),
        w: gsap.quickTo(pill, "width", { duration: 0.7, ease: "expo.out" }),
      };
      gsap.set(pill, { opacity: 0 });
    },
    { scope: navRef },
  );

  const showIndicator = useCallback((target: HTMLElement | null) => {
    const pill = indicator.current;
    if (!pill || !move.current) return;
    if (!target) {
      gsap.to(pill, { opacity: 0, duration: 0.4, ease: "power2.out" });
      return;
    }
    const wasHidden = Number(gsap.getProperty(pill, "opacity")) < 0.05;
    if (wasHidden)
      gsap.set(pill, { x: target.offsetLeft, width: target.offsetWidth });
    move.current.x(target.offsetLeft);
    move.current.w(target.offsetWidth);
    gsap.to(pill, { opacity: 1, duration: 0.4, ease: "power2.out" });
  }, []);

  const restoreIndicator = useCallback(() => {
    const current =
      navRef.current?.querySelector<HTMLElement>('[aria-current="true"]') ??
      null;
    showIndicator(current);
  }, [showIndicator]);

  /* Scroll-spy for in-page anchors */
  useEffect(() => {
    const ids = nav
      .map((n) => n.href)
      .filter((h) => h.startsWith("#"))
      .map((h) => h.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((s): s is HTMLElement => Boolean(s));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    restoreIndicator();
  }, [active, restoreIndicator]);

  /* Mobile menu stagger */
  useEffect(() => {
    if (!open) return;
    const mm = gsap.matchMedia();
    mm.add(NO_MOTION, () => {
      const id = requestAnimationFrame(() => {
        gsap.from("[data-m-item]", {
          opacity: 0,
          y: 28,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.07,
          delay: 0.12,
        });
      });
      return () => cancelAnimationFrame(id);
    });
    return () => mm.revert();
  }, [open]);

  return (
    <header
      ref={root}
      data-scrolled="false"
      className="group fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between rounded-full border border-transparent px-4 transition-[background-color,border-color,box-shadow,backdrop-filter,max-width,padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-16 sm:px-6 group-data-[scrolled=true]:max-w-5xl group-data-[scrolled=true]:border-border/70 group-data-[scrolled=true]:bg-background/70 group-data-[scrolled=true]:shadow-lg group-data-[scrolled=true]:shadow-primary/5 group-data-[scrolled=true]:backdrop-blur-xl group-data-[scrolled=true]:backdrop-saturate-150">
        <Logo />

        <nav
          ref={navRef}
          className="relative hidden items-center lg:flex"
          aria-label="Main"
          onPointerLeave={restoreIndicator}
        >
          <span
            ref={indicator}
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 my-auto h-9 rounded-full bg-accent"
          />
          {nav.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                data-header-item
                aria-current={isActive ? "true" : undefined}
                onPointerEnter={(e) => showIndicator(e.currentTarget)}
                onFocus={(e) => showIndicator(e.currentTarget)}
                onBlur={restoreIndicator}
                className={
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 " +
                  (isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div data-header-item className="hidden sm:block">
            <Button asChild className="group/cta h-10 rounded-full px-5">
              <a href="#contact">
                Get free store check
                <ArrowRight className="size-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-1" />
              </a>
            </Button>
          </div>

          <div data-header-item className="lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-10 rounded-full"
                  aria-label="Open menu"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full max-w-sm border-l px-2 sm:max-w-sm"
              >
                <SheetHeader className="px-4 pb-2 pt-6">
                  <SheetTitle className="text-sm font-medium text-muted-foreground">
                    Menu
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Site navigation
                  </SheetDescription>
                </SheetHeader>

                <nav className="flex flex-col px-4" aria-label="Mobile">
                  {nav.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <a
                        href={item.href}
                        data-m-item
                        className="flex items-center justify-between border-b py-5 text-3xl font-semibold tracking-tight transition-colors hover:text-primary"
                      >
                        {item.label}
                        <ArrowRight className="size-5 text-muted-foreground" />
                      </a>
                    </SheetClose>
                  ))}

                  <SheetClose asChild>
                    <Button
                      asChild
                      size="lg"
                      data-m-item
                      className="mt-8 h-13 rounded-full text-base"
                    >
                      <a href="#contact">Get free store check</a>
                    </Button>
                  </SheetClose>
                  <p
                    data-m-item
                    className="mt-4 text-center text-sm text-muted-foreground"
                  >
                    Takes 2 minutes. No obligation.
                  </p>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
