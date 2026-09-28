// TODO: replace every placeholder below with your real details.
export const site = {
  name: "ROI Technology",
  company: "Your Company Ltd.",
  description:
    "We find the hidden problems in your online store, then fix them with smart automation, so you sell more without doing more.",
  // Phone in international format; WhatsApp number is digits only
  phone: "08088103400",
  whatsapp: "+2348088103400",
  email: "roismarttechnologiesltd@gmail.com",
  currency: "USD" as const,
  locale: "en-US",
};

export const nav = [
  { label: "The Problem", href: "#problem" },
  { label: "How We Fix It", href: "#how-it-works" },
  { label: "Our Result", href: "#result" },
  { label: "Services", href: "#services" },
  { label: "FAQ", href: "#faq" },
];

export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
