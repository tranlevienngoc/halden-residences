"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { IMG } from "@/lib/content";
import { useExperience } from "./providers/ExperienceProvider";

const WORD = "HALDEN".split("");

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const img = new window.Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
    // Never hold the experience hostage on a slow network.
    setTimeout(resolve, 4000);
  });
}

export default function Preloader() {
  const { setReady } = useExperience();
  const root = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      const t = setTimeout(() => {
        setReady(true);
        el.style.display = "none";
      }, 300);
      return () => clearTimeout(t);
    }

    const ctx = gsap.context(() => {
      const progress = { v: 0 };
      const letters = el.querySelectorAll(".pl-letter");
      const line = el.querySelector(".pl-line");
      const metas = el.querySelectorAll(".pl-meta");

      const assets = Promise.all([document.fonts?.ready ?? Promise.resolve(), preloadImage(IMG.hero)]);

      const intro = gsap.timeline();
      intro
        .fromTo(letters, { yPercent: 105 }, { yPercent: 0, duration: 0.75, ease: "expo.out", stagger: 0.035 }, 0.05)
        .fromTo(metas, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.15)
        .to(
          progress,
          {
            v: 100,
            duration: 0.85,
            ease: "power2.inOut",
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = String(Math.round(progress.v)).padStart(3, "0");
              gsap.set(line, { scaleX: progress.v / 100 });
            },
          },
          0.1,
        );

      Promise.all([assets, intro.then()]).then(() => {
        gsap
          .timeline({
            onComplete: () => {
              el.style.display = "none";
            },
          })
          .to(letters, { yPercent: -105, duration: 0.55, ease: "power3.in", stagger: 0.02 })
          .to([line, metas], { autoAlpha: 0, duration: 0.3 }, "<0.05")
          .add(() => setReady(true), "-=0.25")
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.85, ease: "expo.inOut" }, "-=0.2");
      });
    }, el);

    return () => ctx.revert();
  }, [setReady]);

  return (
    <div
      id="preloader"
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink text-ivory"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden="true"
    >
      <div className="flex overflow-hidden font-display text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-[0.9] tracking-[-0.04em]">
        {WORD.map((l, i) => (
          <span key={i} className="pl-letter inline-block">
            {l}
          </span>
        ))}
      </div>

      <div className="mt-8 h-px w-[min(240px,50vw)] overflow-hidden bg-ivory/15">
        <span className="pl-line block h-full w-full origin-left scale-x-0 bg-ivory" />
      </div>

      <div className="pl-meta t-meta absolute bottom-8 left-[var(--pad)] text-stone">Private Residences</div>
      <div className="pl-meta t-meta absolute bottom-8 right-[var(--pad)] tabular-nums text-stone">
        <span ref={countRef}>000</span>
      </div>
      <div className="pl-meta t-meta absolute top-8 left-1/2 -translate-x-1/2 text-stone">Est. 2027</div>
    </div>
  );
}
