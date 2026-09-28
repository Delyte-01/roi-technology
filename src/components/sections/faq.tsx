import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does the free store check work?",
    a: "We go through your store the way a real customer would and audit checkout speed, product pages and abandoned sales. We make no code changes until you approve.",
  },
  {
    q: "Do you work with Shopify and WordPress?",
    a: "Yes. We work with Shopify, and with WordPress stores running WooCommerce.",
  },
  {
    q: "Will automation slow down my store?",
    a: "No. Speed is one of the things we measure, and every change is tested before it goes live.",
  },
  {
    q: "What if I'm just starting out?",
    a: "You can still get value. A store health check on a new store helps you avoid leaks before they cost you sales.",
  },
  {
    q: "How quickly will I see results?",
    a: "Quick fixes such as a broken checkout button can show results within days. Email and SEO work builds over weeks.",
  },
  {
    q: "Is there a long-term contract?",
    a: "No. The free check is free and comes with no obligation.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-white py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Questions, answered plainly.</h2>
        <Accordion type="single" collapsible className="mt-10">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
