"use client";

import { useRef } from "react";
import { NAV } from "@/lib/content";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { Arrow, Meta, NavLink, SlideLabel } from "./ui/primitives";


export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ft-text",
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: ".ft-word", start: "top 95%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={root} className="relative overflow-hidden bg-ink text-ivory">
      <div className="wrap border-t border-ivory/10 pt-[clamp(4rem,8vw,7rem)]">
        <div className="grid-12 gap-y-12">
          <div className="col-span-12 md:col-span-4">
            <p className="font-display text-2xl font-semibold leading-[1.05] tracking-[0.28em]">
              HALDEN
              <br />
              <span className="font-medium tracking-[0.42em] text-stone">RESIDENCES</span>
            </p>
            <p className="mt-6 max-w-[18rem] font-serif text-xl italic leading-snug text-ivory/70">
              Eighteen residences, held quietly within the forest.
            </p>
          </div>

          <nav aria-label="Footer" className="col-span-6 md:col-span-2 md:col-start-6">
            <Meta className="mb-5 text-stone">Navigation</Meta>
            <ul className="space-y-2.5">
              {NAV.map((n) => (
                <li key={n.href}>
                  <NavLink href={n.href} className="link-u text-[0.9375rem] text-ivory/85 hover:text-ivory">
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-6 md:col-span-2">
            <Meta className="mb-5 text-stone">Follow</Meta>
            <ul className="space-y-2.5 text-[0.9375rem] text-ivory/85">
              <li>
                <a className="link-u hover:text-ivory" href="https://instagram.com" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a className="link-u hover:text-ivory" href="https://pinterest.com" target="_blank" rel="noreferrer">
                  Pinterest
                </a>
              </li>
              <li>
                <NavLink href="#architecture" className="link-u hover:text-ivory">
                  Architecture
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <Meta className="mb-5 text-stone">Private client team</Meta>
            <address className="space-y-2.5 text-[0.9375rem] not-italic text-ivory/85">
              <p>Sales Gallery, Halden Valley</p>
              <p>
                <a className="link-u hover:text-ivory" href="mailto:private@haldenresidences.com">
                  private@haldenresidences.com
                </a>
              </p>
              <p>
                <a className="link-u hover:text-ivory" href="tel:+41000000000">
                  +41 00 000 00 00
                </a>
              </p>
            </address>
            <NavLink href="#private-access" className="btn btn-outline mt-8 text-ivory" id="footer-cta">
              <SlideLabel>Private Access</SlideLabel>
              <Arrow />
            </NavLink>
          </div>
        </div>
      </div>

      {/* Oversized wordmark — SVG textLength guarantees edge-to-edge fit */}
      <div className="ft-word wrap mt-[clamp(4rem,9vw,8rem)]" aria-hidden="true">
        <svg viewBox="0 0 1000 178" className="block w-full overflow-hidden text-ivory">
          <defs>
            <clipPath id="ft-clip">
              <rect x="0" y="0" width="1000" height="178" />
            </clipPath>
          </defs>
          <g clipPath="url(#ft-clip)">
            <text
              x="0"
              y="164"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              className="ft-text fill-current font-display"
              fontSize="226"
              fontWeight="600"
              letterSpacing="-8"
            >
              HALDEN
            </text>
          </g>
        </svg>
      </div>

      <div className="wrap flex flex-col gap-4 border-t border-ivory/10 py-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-meta text-[0.625rem] text-stone">
          © 2026 Halden Residences. A design concept — imagery illustrative. Nothing herein constitutes an offer.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="t-meta link-u text-[0.625rem] text-stone hover:text-ivory">
            Privacy
          </a>
          <a href="#" className="t-meta link-u text-[0.625rem] text-stone hover:text-ivory">
            Terms
          </a>
          <NavLink href="#top" className="btn text-stone hover:text-ivory" id="back-to-top">
            <SlideLabel>Back to top</SlideLabel>
            <Arrow dir="up" />
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
