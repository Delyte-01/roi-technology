"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Activity,
  Bot,
  Check,
  ChevronDown,
  Mail,
  Search,
  Share2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  name: string;
  icon: LucideIcon;
  what: string;
  problem: string;
  fix: string;
  get: string[];
};

const services: Service[] = [
  {
    id: "health",
    name: "Store health check",
    icon: Activity,
    what: "A complete, non-invasive audit of your whole store funnel.",
    problem:
      "You know sales are lower than they should be, but not whether it's slow pages, a broken checkout or a poor mobile layout.",
    fix: "We go line by line through checkout, page speed, mobile layout and tracking, as a real buyer would.",
    get: [
      "Every leak explained in plain English",
      "Priority steps to fix them first",
      "No code changes until you approve",
    ],
  },
  {
    id: "automation",
    name: "AI and automation",
    icon: Bot,
    what: "Systems that run your store's repetitive work for you.",
    problem:
      "Stock, prices and listings are updated by hand, and customers wait for replies overnight.",
    fix: "We connect inventory sync, listing updates and customer replies so they run day and night.",
    get: [
      "Fewer manual updates",
      "Faster customer replies",
      "Fewer errors in stock and pricing",
    ],
  },
  {
    id: "social",
    name: "Social media",
    icon: Share2,
    what: "Consistent posting that keeps your brand visible.",
    problem: "Your accounts go quiet whenever you get busy running the store.",
    fix: "We plan, design and schedule content that matches your products and your voice.",
    get: [
      "A monthly content plan",
      "Scheduled posts",
      "A simple performance summary",
    ],
  },
  {
    id: "email",
    name: "Email marketing",
    icon: Mail,
    what: "Emails that win back lost sales and bring buyers back.",
    problem: "Shoppers abandon their carts and one-time buyers never return.",
    fix: "We set up abandoned-cart, welcome and repeat-purchase sequences.",
    get: [
      "Automated recovery emails",
      "Templates that fit your brand",
      "Revenue tracked per campaign",
    ],
  },
  {
    id: "seo",
    name: "SEO",
    icon: Search,
    what: "Helping new customers find your store on Google.",
    problem:
      "Your products exist, but shoppers searching for them land on someone else's store.",
    fix: "We improve product pages, titles, speed and structure so search engines understand your store.",
    get: [
      "Keyword-optimized product pages",
      "Technical fixes",
      "Monthly ranking updates",
    ],
  },
];

export function Services() {
  const [active, setActive] = useState(services[0].id);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const panelId = useId();

  const current = services.find((s) => s.id === active) ?? services[0];
  const index = services.findIndex((s) => s.id === active) + 1;

  // Desktop: position the sliding pill behind the active tab
  const measure = useCallback(() => {
    const el = triggers.current[active];
    if (el && el.offsetWidth > 0)
      setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [active]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    const node = list.current;
    if (!node) return;
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => ro.disconnect();
  }, [measure]);

  // Mobile: close the filter panel with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const pick = (id: string) => {
    setActive(id);
    setOpen(false);
  };

  return (
    <section id="services" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Everything your store needs, in one place.
        </h2>
        <p className="mt-5 max-w-xl text-pretty text-lg text-muted-foreground">
          Start with the one that hurts most. Add the rest when you're ready.
        </p>

        <Tabs value={active} onValueChange={setActive} className="mt-12 gap-6">
          {/* ───────── Mobile / tablet: filter panel ───────── */}
          <div className="lg:hidden">
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpen((o) => !o)}
              className="flex w-full items-center gap-3 rounded-2xl border bg-card p-3 text-left shadow-sm outline-none transition-colors hover:bg-accent/50 focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <current.icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-muted-foreground">
                  Service
                </span>
                <span className="block truncate font-semibold capitalize">
                  {current.name}
                </span>
              </span>
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                {index}/{services.length}
              </span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-5 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none",
                  open && "rotate-180",
                )}
              />
            </button>

            {/* expanding panel */}
            <div
              id={panelId}
              aria-hidden={!open}
              className={cn(
                "grid transition-[grid-template-rows,margin] duration-300 ease-out motion-reduce:transition-none",
                open ? "mt-2 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <ul className="grid gap-1 rounded-2xl border bg-card p-1.5 shadow-lg shadow-black/5 sm:grid-cols-2">
                  {services.map((s) => {
                    const selected = s.id === active;
                    return (
                      <li key={s.id}>
                        <button
                          type="button"
                          tabIndex={open ? 0 : -1}
                          aria-current={selected ? "true" : undefined}
                          onClick={() => pick(s.id)}
                          className={cn(
                            "flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
                            selected
                              ? "bg-primary/10 text-foreground"
                              : "hover:bg-accent",
                          )}
                        >
                          <s.icon
                            className={cn(
                              "size-4 shrink-0",
                              selected
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                            aria-hidden
                          />
                          <span
                            className={cn(
                              "flex-1",
                              selected && "font-semibold",
                            )}
                          >
                            {s.name}
                          </span>
                          {selected && (
                            <Check
                              className="size-4 shrink-0 text-primary"
                              aria-hidden
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* ───────── Desktop: sliding-pill tab bar ───────── */}
          <TabsList
            ref={list}
            className="relative hidden h-auto w-fit justify-start gap-1 rounded-full border bg-muted/60 p-1 lg:inline-flex"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-1 left-0 rounded-full bg-background shadow-sm ring-1 ring-border transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
              style={{
                width: pill?.w ?? 0,
                transform: `translateX(${pill?.x ?? 0}px)`,
                opacity: pill ? 1 : 0,
              }}
            />
            {services.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                ref={(el) => {
                  triggers.current[s.id] = el;
                }}
                className="relative z-10 h-10 flex-none gap-2 rounded-full border-transparent px-4 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-transparent [&_svg]:transition-colors data-[state=active]:[&_svg]:text-primary capitalize"
              >
                <s.icon className="size-4" aria-hidden />
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ───────── Content ───────── */}
          {services.map((s) => (
            <TabsContent
              key={s.id}
              value={s.id}
              className="overflow-hidden rounded-3xl border bg-card shadow-sm data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300"
            >
              <div className="grid lg:grid-cols-[1.15fr_1fr]">
                <div className="p-6 sm:p-10">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-6 max-w-md text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                    {s.what}
                  </h3>

                  <dl className="mt-8 space-y-6">
                    <div className="border-l-2 border-leak pl-4">
                      <dt className="text-sm font-semibold text-leak">
                        The problem
                      </dt>
                      <dd className="mt-1 text-pretty text-muted-foreground">
                        {s.problem}
                      </dd>
                    </div>
                    <div className="border-l-2 border-primary pl-4">
                      <dt className="text-sm font-semibold text-primary">
                        How we fix it
                      </dt>
                      <dd className="mt-1 text-pretty text-muted-foreground">
                        {s.fix}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-col border-t bg-muted/40 p-6 sm:p-10 lg:border-t-0 lg:border-l">
                  <h4 className="text-sm font-semibold text-profit">
                    What you get
                  </h4>
                  <ul className="mt-5 space-y-4">
                    {s.get.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-profit/15 text-profit">
                          <Check
                            className="size-3"
                            strokeWidth={3}
                            aria-hidden
                          />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    size="lg"
                    className="mt-10 w-full sm:w-auto lg:mt-auto lg:self-start"
                  >
                    <a href="#contact">Get a free store check</a>
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
