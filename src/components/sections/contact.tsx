"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
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

// Adds https:// when the visitor types just "yourstore.com"
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
        "group flex items-center gap-4 rounded-2xl border p-4 outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
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

// No backend: the form just builds a WhatsApp message from what the visitor typed.
export function Contact() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [problem, setProblem] = useState("");
  const [sentLink, setSentLink] = useState<string | null>(null);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const msg = `Hello, I'm ${name.trim()}. My store: ${normalizeUrl(url)}. My biggest problem: ${problem.trim()}. I'd like a free store check.`;
    const link = whatsappLink(msg);
    window.open(link, "_blank", "noopener,noreferrer");
    // Keep a fallback link in case the browser blocked the new tab
    setSentLink(link);
  }

  return (
    <section id="contact" className="py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[5fr_6fr] lg:gap-20">
        {/* Left: pitch + direct channels */}
        <div>
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

        {/* Right: form */}
        <Card className="gap-0 rounded-3xl p-6 shadow-sm sm:p-10">
          <h3 className="text-2xl font-semibold tracking-tight">
            Tell us about your store
          </h3>
          <p className="mt-1.5 text-muted-foreground">Three quick questions.</p>

          <form onSubmit={send} className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Okafor"
                className="h-12 rounded-xl px-4 text-base"
              />
            </div>

            <div className="space-y-2">
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
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yourstore.com"
                className="h-12 rounded-xl px-4 text-base"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="problem">Biggest problem right now</Label>
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Common problems"
              >
                {quickProblems.map((p) => {
                  const selected = problem === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setProblem(p)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-sm outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50",
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
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Or describe it in your own words."
                className="min-h-28 rounded-xl px-4 py-3 text-base"
              />
            </div>

            <div>
              <Button type="submit" size="lg" className="h-12 w-full text-base">
                <MessageCircle aria-hidden /> Send on WhatsApp
              </Button>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                This opens WhatsApp with your message ready to send. Nothing is
                stored on our site.
              </p>
            </div>

            {sentLink && (
              <p
                role="status"
                className="rounded-xl border border-profit/30 bg-profit/10 px-4 py-3 text-sm"
              >
                WhatsApp should have opened in a new tab.{" "}
                <a
                  href={sentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  Tap here if it didn&apos;t
                </a>
                .
              </p>
            )}
          </form>
        </Card>
      </div>
    </section>
  );
}
