"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { initReveals } from "@/lib/reveals";

type ExperienceValue = {
  /** true once the preloader has handed over to the hero */
  ready: boolean;
  setReady: (v: boolean) => void;
  /** cinematic curtain transition to an in-page anchor */
  navigate: (hash: string) => void;
  lockScroll: (locked: boolean) => void;
};

const ExperienceContext = createContext<ExperienceValue | null>(null);

export function useExperience() {
  const ctx = useContext(ExperienceContext);
  if (!ctx) throw new Error("useExperience must be used inside <ExperienceProvider>");
  return ctx;
}

const LABELS: Record<string, string> = {
  "#residences": "Residences",
  "#architecture": "Architecture",
  "#location": "Location",
  "#lifestyle": "Lifestyle",
  "#availability": "Availability",
  "#private-access": "Private Access",
  "#top": "Halden",
};

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  // --- Smooth scroll -------------------------------------------------------
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, autoRaf: false });
    lenisRef.current = lenis;
    lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (ready) {
      html.classList.remove("is-loading");
      lenisRef.current?.start();
      ScrollTrigger.refresh();
    } else {
      lenisRef.current?.stop();
    }
  }, [ready]);

  // --- Global scroll reveals ----------------------------------------------
  // Runs after children's layout effects, so section-level pins exist first.
  useIsoLayoutEffect(() => {
    const mm = initReveals();
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      mm.revert();
    };
  }, []);

  const lockScroll = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, []);

  const jumpTo = useCallback((target: HTMLElement) => {
    const lenis = lenisRef.current;
    if (lenis) lenis.scrollTo(target, { immediate: true, force: true, offset: target === document.body ? 0 : -16 });
    else target.scrollIntoView({ behavior: "instant" });
  }, []);

  const navigate = useCallback(
    (hash: string) => {
      const target = hash === "#top" ? document.body : document.querySelector<HTMLElement>(hash);
      if (!target) return;
      history.replaceState(null, "", hash === "#top" ? " " : hash);

      const curtain = curtainRef.current;
      if (prefersReducedMotion() || !curtain) {
        jumpTo(target);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      if (labelRef.current) labelRef.current.textContent = LABELS[hash] ?? "Halden";

      const label = labelRef.current;
      gsap
        .timeline({
          defaults: { ease: "power4.inOut" },
          onComplete: () => {
            busy.current = false;
            gsap.set(curtain, { visibility: "hidden" });
          },
        })
        .set(curtain, { visibility: "visible", clipPath: "inset(100% 0% 0% 0%)" })
        .set(label, { yPercent: 110 })
        .to(curtain, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.52 })
        .to(label, { yPercent: 0, duration: 0.45, ease: "power3.out" }, "-=0.2")
        .add(() => {
          jumpTo(target);
          ScrollTrigger.update();
        })
        .to(label, { yPercent: -110, duration: 0.38, ease: "power3.in" }, "+=0.1")
        .to(curtain, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6 }, "-=0.12");
    },
    [jumpTo],
  );

  const value = useMemo(() => ({ ready, setReady, navigate, lockScroll }), [ready, navigate, lockScroll]);

  return (
    <ExperienceContext.Provider value={value}>
      {children}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-ink"
        style={{ visibility: "hidden" }}
      >
        <span className="block overflow-hidden">
          <span ref={labelRef} className="t-meta block text-ivory">
            Halden
          </span>
        </span>
        <span className="t-meta absolute bottom-8 left-[var(--pad)] text-stone">Halden Residences</span>
        <span className="t-meta absolute bottom-8 right-[var(--pad)] text-stone">Est. 2027</span>
      </div>
    </ExperienceContext.Provider>
  );
}
