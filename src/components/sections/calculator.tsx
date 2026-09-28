"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { site } from "@/lib/site";

const MIN = 2000;
const MAX = 100000;
const LEAK_RATE = 0.18; // typical share of revenue lost. Adjust to your own benchmark.

const money = (n: number) =>
  new Intl.NumberFormat(site.locale, {
    style: "currency",
    currency: site.currency,
    maximumFractionDigits: 0,
  }).format(n);

export function Calculator() {
  const [revenue, setRevenue] = useState(15000);

  const monthlyLeak = Math.round(revenue * LEAK_RATE);
  const annual = monthlyLeak * 12;
  const hours = Math.round(6 + ((revenue - MIN) / (MAX - MIN)) * 14);

  return (
    <section id="calculator" className="bg-white py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How much is your store quietly losing each month?
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Drag the slider to your monthly sales to see what automated store optimization could recover.
        </p>

        <Card className="mt-10 p-6 sm:p-10">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor="revenue" className="text-sm font-medium text-muted-foreground">
              Monthly store revenue
            </label>
            <output id="revenue" className="text-3xl font-bold tabular-nums">
              {money(revenue)}
            </output>
          </div>

          <Slider
            className="mt-6"
            min={MIN}
            max={MAX}
            step={1000}
            value={[revenue]}
            onValueChange={([v]) => setRevenue(v)}
            aria-label="Monthly store revenue"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{money(MIN)}</span>
            <span>{money(MAX)}+</span>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-leak-soft p-5">
              <p className="text-sm text-leak">Estimated monthly leak</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-leak">{money(monthlyLeak)}</p>
            </div>
            <div className="rounded-xl bg-profit-soft p-5 ring-2 ring-profit/30">
              <p className="text-sm text-profit">Annual opportunity</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-profit">{money(annual)}</p>
            </div>
            <div className="rounded-xl bg-accent p-5">
              <p className="text-sm text-accent-foreground">Hours saved per week</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-accent-foreground">~{hours} hrs</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <p className="max-w-md text-xs text-muted-foreground">
              Estimates based on typical store benchmarks. A free store check gives you exact numbers.
            </p>
            <Button asChild size="lg">
              <a href="#contact">Verify my store leaks</a>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
