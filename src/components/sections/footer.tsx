import { ArrowUp } from "lucide-react";
import { nav, site, whatsappLink } from "@/lib/site";
import Image from "next/image";

const linkClass =
  "rounded-sm text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/60";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-deep text-white/80">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-sm">
            <a
              href="#home"
              data-header-item
              className="flex items-center gap-2.5 rounded-md leading-none outline-offset-4"
              aria-label="ROI Technology home"
            >
              {/* Put your file in /public, e.g. /public/logo.png (SVG works too) */}
              <Image
                src="https://res.cloudinary.com/dk5mfu099/image/upload/v1791353426/roi-mark-green-white-arrow-removebg-preview_bgmhcf.png"
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
                <span className="mt-1 text-[10px] uppercase font-medium tracking-wide text-profit">
                  El-roi . Return on investment
                </span>
              </span>
            </a>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-white/70">
              {site.description}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold text-white">Explore</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className={linkClass}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-white">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href={whatsappLink("Hello, I'd like a free store check.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`tel:${site.phone}`} className={linkClass}>
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className={`${linkClass} break-all`}
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.company}. All rights reserved.
          </p>
        </div>
      </div>

      {/* Oversized wordmark, decorative only */}
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.16em] select-none whitespace-nowrap text-center text-[17vw] leading-none font-bold tracking-tighter text-white/[0.05] lg:text-[13rem]"
      >
        roitechnology
      </p>
    </footer>
  );
}
