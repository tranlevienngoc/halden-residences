"use client";

import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useExperience } from "./providers/ExperienceProvider";
import { Arrow, NavLink, SlideLabel } from "./ui/primitives";

export default function Header() {
  const { ready, lockScroll } = useExperience();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // transparent → translucent; hide on scroll down, reveal on scroll up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > window.innerHeight * 0.9 && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // intro after preloader
  useEffect(() => {
    if (!ready || !headerRef.current) return;
    if (prefersReducedMotion()) {
      gsap.set(headerRef.current.querySelectorAll(".hd-item"), { autoAlpha: 1 });
      return;
    }
    gsap.fromTo(
      headerRef.current.querySelectorAll(".hd-item"),
      { autoAlpha: 0, y: -12 },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.04, delay: 0.35 },
    );
  }, [ready]);

  // fullscreen menu
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    lockScroll(open);
    const links = menu.querySelectorAll(".mm-link .line-inner");
    const extras = menu.querySelectorAll(".mm-extra");
    const reduced = prefersReducedMotion();

    if (open) {
      gsap.set(menu, { visibility: "visible" });
      gsap
        .timeline()
        .fromTo(menu, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: reduced ? 0 : 0.9, ease: "expo.inOut" })
        .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: reduced ? 0 : 1, ease: "expo.out", stagger: 0.06 }, "-=0.35")
        .fromTo(extras, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, "-=0.6");
      menu.querySelector<HTMLAnchorElement>("a")?.focus({ preventScroll: true });

      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    } else if (menu.style.visibility === "visible") {
      gsap.to(menu, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: reduced ? 0 : 0.8,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(menu, { visibility: "hidden" });
        },
      });
      toggleRef.current?.focus({ preventScroll: true });
    }
  }, [open, lockScroll]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed inset-x-0 top-0 z-[60] transition-[transform,background-color,backdrop-filter,border-color] duration-700 ease-[var(--ease-expo)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled && !open
            ? "border-b border-ivory/10 bg-ink/75 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <NavLink
            href="#top"
            className="hd-item invisible font-display text-[1.0625rem] font-semibold tracking-[0.32em] text-ivory"
            aria-label="Halden Residences — back to top"
          >
            HALDEN
          </NavLink>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-[clamp(1.25rem,2.4vw,2.75rem)]">
              {NAV.map((item) => (
                <li key={item.href} className="hd-item invisible">
                  <NavLink href={item.href} className="btn text-ivory/80 transition-colors hover:text-ivory">
                    <SlideLabel>{item.label}</SlideLabel>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <NavLink
              id="header-cta"
              href="#private-access"
              className="hd-item btn btn-outline invisible hidden px-4 py-3 text-ivory sm:inline-flex"
            >
              <SlideLabel>Private Access</SlideLabel>
              <Arrow />
            </NavLink>
            <button
              ref={toggleRef}
              id="menu-toggle"
              type="button"
              className="hd-item btn invisible -mr-2 p-2 text-ivory lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="relative block h-[7px] w-5" aria-hidden="true">
                <span
                  className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-500 ${open ? "translate-y-[3px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-500 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="fixed inset-0 z-[55] flex flex-col bg-ink-2 pt-[var(--header-h)] lg:hidden"
        style={{ visibility: "hidden", clipPath: "inset(0% 0% 100% 0%)" }}
      >
        <nav aria-label="Mobile" className="wrap flex flex-1 flex-col justify-center">
          <ul className="space-y-1">
            {[...NAV, { label: "Private Access", href: "#private-access" }].map((item, i) => (
              <li key={item.href} className="mm-link flex items-baseline gap-4 border-b border-ivory/10 py-3">
                <span className="mm-extra t-meta w-8 text-stone">{String(i + 1).padStart(2, "0")}</span>
                <NavLink
                  href={item.href}
                  onNavigate={close}
                  className="line-mask font-display text-[clamp(2.25rem,9vw,4rem)] font-semibold uppercase leading-[0.95] tracking-[-0.04em] text-ivory"
                >
                  <span className="line-inner">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mm-extra wrap flex items-end justify-between pb-8 pt-6 text-stone">
          <p className="t-meta">
            Sales Gallery
            <br />
            By appointment
          </p>
          <a className="t-meta link-u text-ivory" href="mailto:private@haldenresidences.com">
            private@halden.com
          </a>
        </div>
      </div>
    </>
  );
}
