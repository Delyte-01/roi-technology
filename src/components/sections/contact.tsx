"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import {
  ArrowUpRight,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { site, whatsappLink } from "@/lib/site";

const quickProblems = [
  "Shoppers add to cart but don't pay",
  "My store is slow",
  "Sales have dropped",
  "Too much manual work",
];

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

let easesReady = false;
function ensureEases() {
  if (easesReady) return;
  gsap.registerPlugin(CustomEase);
  // Fast launch, long soft landing.
  CustomEase.create("premium", "0.16, 1, 0.3, 1");
  // Slow start, quick exit. Used for things leaving.
  CustomEase.create("exit", "0.7, 0, 0.84, 0");
  // Tiny overshoot for the success mark.
  CustomEase.create("settle", "0.34, 1.56, 0.64, 1");
  easesReady = true;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function normalizeUrl(value: string) {
  const v = value.trim();
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

function Channel({
  icon: Icon,
  label,
  value,
  href,
  external,
  featured,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
  external?: boolean;
  featured?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "group flex min-w-0 items-center gap-4 rounded-2xl border p-4 outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
        featured
          ? "border-primary/30 bg-primary/5 hover:border-primary/60"
          : "bg-card hover:border-foreground/20 hover:bg-accent/40",
      )}
    >
      <span
        className={cn(
          "grid size-11 shrink-0 place-items-center rounded-xl",
          featured
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm text-muted-foreground">{label}</span>
        <span className="block truncate font-medium">{value}</span>
      </span>
      <ArrowUpRight
        aria-hidden
        className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground motion-reduce:transition-none"
      />
    </a>
  );
}

const emptyForm = { name: "", email: "", url: "", problem: "" };
type FormState = typeof emptyForm;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function Contact() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState<"form" | "sent">("form");
  const [sent, setSent] = useState<FormState | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const sentPanelRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const sentHeadingRef = useRef<HTMLHeadingElement>(null);
  const busyRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    ensureEases();
    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const field =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  /**
   * Cross-fades the card between two panels.
   * 1. current panel's items lift away and blur out (staggered)
   * 2. the card's height eases to fit the next panel
   * 3. the next panel's items rise in (staggered)
   */
  function swapPanels(direction: "toSent" | "toForm", onArrive?: () => void) {
    const stage = stageRef.current;
    const fromEl =
      direction === "toSent" ? formPanelRef.current : sentPanelRef.current;
    const toEl =
      direction === "toSent" ? sentPanelRef.current : formPanelRef.current;
    if (!stage || !fromEl || !toEl) return;

    const items = (el: HTMLElement) =>
      Array.from(el.querySelectorAll<HTMLElement>("[data-item]"));

    // Reduced motion: swap instantly.
    if (prefersReducedMotion()) {
      fromEl.style.display = "none";
      toEl.style.display = "block";
      gsap.set(items(toEl), { clearProps: "all" });
      busyRef.current = false;
      onArrive?.();
      return;
    }

    busyRef.current = true;
    const startH = stage.offsetHeight;
    stage.style.height = `${startH}px`;
    stage.style.overflow = "hidden";

    tlRef.current?.kill();
    tlRef.current = gsap
      .timeline()
      // 1. out
      .to(items(fromEl), {
        opacity: 0,
        y: -18,
        filter: "blur(8px)",
        duration: 0.5,
        ease: "exit",
        stagger: { each: 0.045, from: "start" },
      })
      // 2 + 3. resize and in
      .add(() => {
        fromEl.style.display = "none";
        toEl.style.display = "block";

        const inItems = items(toEl);
        gsap.set(inItems, { opacity: 0, y: 28, filter: "blur(8px)" });

        const endH = toEl.offsetHeight;
        const inTl = gsap.timeline({
          onComplete: () => {
            gsap.set(inItems, { clearProps: "transform,filter,opacity" });
            stage.style.height = "";
            stage.style.overflow = "";
            busyRef.current = false;
            onArrive?.();
          },
        });

        inTl.to(stage, { height: endH, duration: 0.9, ease: "premium" }, 0);
        inTl.to(
          inItems,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "premium",
            stagger: 0.08,
          },
          0.2,
        );

        if (direction === "toSent") playSuccessMark(inTl, toEl);
        tlRef.current = inTl;
      });
  }

  /** The circle draws, the tick draws, a ring pulses out. */
  function playSuccessMark(tl: gsap.core.Timeline, root: HTMLElement) {
    const disc = root.querySelector("[data-disc]");
    const circle = root.querySelector("[data-circle]");
    const tick = root.querySelector("[data-tick]");
    const ring = root.querySelector("[data-ring]");
    if (!disc || !circle || !tick || !ring) return;

    gsap.set([circle, tick], { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(ring, { scale: 0.7, opacity: 0.5, transformOrigin: "50% 50%" });

    tl.fromTo(
      disc,
      { scale: 0.6 },
      { scale: 1, duration: 0.9, ease: "settle", transformOrigin: "50% 50%" },
      0.25,
    )
      .to(circle, { strokeDashoffset: 0, duration: 0.8, ease: "premium" }, 0.35)
      .to(tick, { strokeDashoffset: 0, duration: 0.55, ease: "premium" }, 0.85)
      .to(ring, { scale: 2, opacity: 0, duration: 1.3, ease: "premium" }, 0.85);
  }

  async function send(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || busyRef.current) return;
    setSubmitting(true);

    const { name, email, url, problem } = form;

    try {
      const formData = new FormData();
      formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_KEY!);
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("store", normalizeUrl(url));
      formData.append("problem", problem.trim());
      formData.append("subject", `New Store Check Request from ${name.trim()}`);
      formData.append("from_name", "ROI Technology Website");
      formData.append("replyto", email.trim());
      formData.append("botcheck", ""); // honeypot, must stay empty

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!result.success) {
        console.error("Web3Forms error:", result);
        toast.error("That didn't send. Check your connection and try again.");
        return;
      }

      // Render the recap into the success panel before we animate to it.
      flushSync(() => {
        setSent({
          name: name.trim(),
          email: email.trim(),
          url: normalizeUrl(url),
          problem: problem.trim(),
        });
        setView("sent");
      });

      setForm(emptyForm);
      swapPanels("toSent", () => sentHeadingRef.current?.focus());
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("That didn't send. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function sendAnother() {
    if (busyRef.current) return;
    setView("form");
    swapPanels("toForm", () => nameInputRef.current?.focus());
  }

  return (
    <section id="contact" className="overflow-x-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[5fr_6fr] lg:gap-20">
        {/* Left: pitch + direct channels */}
        <div className="min-w-0">
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            What is your store missing? Find out in one free check.
          </h2>
          <p className="mt-5 max-w-md text-pretty text-lg text-muted-foreground">
            No pressure, no sales pitch. Send us your store link and your
            biggest problem, and we&apos;ll reply with answers.
          </p>

          <div className="mt-10 space-y-3">
            <Channel
              featured
              external
              icon={MessageCircle}
              label="WhatsApp"
              value="Chat with us"
              href={whatsappLink("Hello, I'd like a free store check.")}
            />
            <Channel
              icon={Phone}
              label="Call"
              value={site.phone}
              href={`tel:${site.phone}`}
            />
            <Channel
              icon={Mail}
              label="Email"
              value={site.email}
              href={`mailto:${site.email}?subject=${encodeURIComponent("Free store check")}`}
            />
          </div>
        </div>

        {/* Right: form <-> confirmation */}
        <Card className="min-w-0 gap-0 rounded-3xl p-6 shadow-sm sm:p-10">
          {/* Stage: height is animated between panels. The small negative
              margin + padding keeps focus rings from being clipped. */}
          <div ref={stageRef} className="-m-1 p-1">
            {/* ---------------- Form panel ---------------- */}
            <div
              ref={formPanelRef}
              aria-hidden={view !== "form"}
              // @ts-expect-error inert is valid in React 19 / modern browsers
              inert={view !== "form" ? "" : undefined}
            >
              <div data-item>
                <h3 className="text-2xl font-semibold tracking-tight">
                  Tell us about your store
                </h3>
                <p className="mt-1.5 text-muted-foreground">
                  Takes about a minute.
                </p>
              </div>

              <form onSubmit={send} className="mt-8 space-y-6">
                <fieldset
                  disabled={submitting}
                  className="space-y-6 disabled:opacity-60"
                >
                  <div className="space-y-2" data-item>
                    <Label htmlFor="name">Your name</Label>
                    <Input
                      ref={nameInputRef}
                      id="name"
                      name="name"
                      autoComplete="name"
                      required
                      value={form.name}
                      onChange={field("name")}
                      placeholder="Ada Okafor"
                      className="h-12 w-full min-w-0 rounded-xl px-4 text-base"
                    />
                  </div>

                  <div className="space-y-2" data-item>
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={field("email")}
                      placeholder="you@example.com"
                      className="h-12 w-full min-w-0 rounded-xl px-4 text-base"
                    />
                  </div>

                  <div className="space-y-2" data-item>
                    <Label htmlFor="url">Store link</Label>
                    <Input
                      id="url"
                      name="url"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      value={form.url}
                      onChange={field("url")}
                      placeholder="yourstore.com"
                      className="h-12 w-full min-w-0 rounded-xl px-4 text-base"
                    />
                  </div>

                  <div className="space-y-3" data-item>
                    <Label htmlFor="problem">Biggest problem right now</Label>
                    <div
                      className="flex flex-wrap gap-2"
                      role="group"
                      aria-label="Common problems"
                    >
                      {quickProblems.map((p) => {
                        const selected = form.problem === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            aria-pressed={selected}
                            onClick={() =>
                              setForm((f) => ({ ...f, problem: p }))
                            }
                            className={cn(
                              "max-w-full whitespace-normal break-words rounded-full border px-3.5 py-1.5 text-left text-sm outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
                              selected
                                ? "border-primary bg-primary/10 text-foreground"
                                : "text-muted-foreground hover:border-foreground/25 hover:text-foreground",
                            )}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                    <Textarea
                      id="problem"
                      name="problem"
                      required
                      value={form.problem}
                      onChange={field("problem")}
                      placeholder="Or describe it in your own words."
                      className="min-h-28 w-full min-w-0 rounded-xl px-4 py-3 text-base"
                    />
                  </div>
                </fieldset>

                <div data-item>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    aria-busy={submitting}
                    className="h-12 w-full text-base"
                  >
                    {submitting ? (
                      <>
                        <Loader2 aria-hidden className="animate-spin" />{" "}
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send aria-hidden /> Send message
                      </>
                    )}
                  </Button>
                  <p className="mt-3 text-center text-sm text-muted-foreground">
                    Your message goes straight to our inbox. Nothing is stored
                    on our site.
                  </p>
                </div>
              </form>
            </div>

            {/* ---------------- Success panel ---------------- */}
            <div
              ref={sentPanelRef}
              className="hidden"
              role="status"
              aria-live="polite"
              aria-hidden={view !== "sent"}
              inert={view !== "sent"}
            >
              <div className="flex flex-col items-center py-6 text-center sm:py-10">
                {/* Success mark */}
                <div
                  data-item
                  className="relative grid size-24 place-items-center"
                >
                  <span
                    data-ring
                    aria-hidden
                    className="absolute inset-0 rounded-full border-2 border-primary/50"
                  />
                  <svg
                    data-disc
                    viewBox="0 0 96 96"
                    className="size-24 text-primary"
                    fill="none"
                    aria-hidden
                  >
                    <circle
                      cx="48"
                      cy="48"
                      r="46"
                      className="fill-primary/10"
                    />
                    <circle
                      data-circle
                      pathLength={1}
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      transform="rotate(-90 48 48)"
                    />
                    <path
                      data-tick
                      pathLength={1}
                      d="M32 49.5 43.5 61 65 37"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h3
                  ref={sentHeadingRef}
                  tabIndex={-1}
                  data-item
                  className="mt-8 text-3xl font-semibold tracking-tight outline-none sm:text-4xl"
                >
                  Message sent
                </h3>
                <p
                  data-item
                  className="mt-3 max-w-sm text-pretty text-muted-foreground"
                >
                  Thanks{sent?.name ? `, ${sent.name.split(" ")[0]}` : ""}. We
                  will review your store and reply to{" "}
                  <span className="break-all font-medium text-foreground">
                    {sent?.email}
                  </span>
                  .
                </p>

                {/* Recap */}
                <dl
                  data-item
                  className="mt-8 w-full min-w-0 divide-y rounded-2xl border bg-muted/40 text-left text-sm"
                >
                  <div className="flex gap-4 px-4 py-3">
                    <dt className="w-16 shrink-0 text-muted-foreground">
                      Store
                    </dt>
                    <dd className="min-w-0 break-all font-medium">
                      {sent?.url}
                    </dd>
                  </div>
                  <div className="flex gap-4 px-4 py-3">
                    <dt className="w-16 shrink-0 text-muted-foreground">
                      Problem
                    </dt>
                    <dd className="min-w-0 break-words font-medium">
                      {sent?.problem}
                    </dd>
                  </div>
                </dl>

                <p data-item className="mt-8 text-sm text-muted-foreground">
                  Forgot something?{" "}
                  <button
                    type="button"
                    onClick={sendAnother}
                    className="rounded-sm font-medium text-foreground underline decoration-foreground/30 underline-offset-4 outline-none transition-colors hover:decoration-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    Send another message
                  </button>
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
