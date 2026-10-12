"use client";

import { gsap } from "./gsap";

/**
 * Declarative scroll reveals. Components opt in with data attributes:
 *
 *   data-reveal="lines"  → children `.line-inner` slide up out of their `.line-mask`
 *   data-reveal="fade"   → soft rise + fade (use data-stagger to stagger children)
 *   data-reveal="clip"   → clip-path mask reveal (data-dir="up|down|left|right")
 *   data-reveal="words"  → scroll-scrubbed word illumination (`.word` children)
 *   data-reveal="rule"   → hairline draws from the left
 *   data-parallax="8"    → yPercent drift on scroll (desktop only)
 *   data-float="60"      → y drift in px on scroll (desktop only)
 *   data-delay="0.2"     → optional delay for lines/fade/clip
 *
 * Everything is skipped under prefers-reduced-motion, so content stays visible.
 */
export function initReveals() {
  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 768px)",
    },
    (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;

      const delayOf = (el: HTMLElement) => parseFloat(el.dataset.delay || "0");

      gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
        const inner = el.querySelectorAll(".line-inner");
        gsap.fromTo(
          inner,
          { yPercent: 118 },
          {
            yPercent: 0,
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.085,
            delay: delayOf(el),
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
        const targets = el.hasAttribute("data-stagger") ? Array.from(el.children) : el;
        gsap.fromTo(
          targets,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.08,
            delay: delayOf(el),
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      const clipFrom: Record<string, string> = {
        up: "inset(100% 0% 0% 0%)",
        down: "inset(0% 0% 100% 0%)",
        left: "inset(0% 0% 0% 100%)",
        right: "inset(0% 100% 0% 0%)",
        center: "inset(12% 12% 12% 12%)",
      };

      gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
        const inner = el.querySelector<HTMLElement>(".media-inner");
        const tl = gsap.timeline({
          delay: delayOf(el),
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
        tl.fromTo(
          el,
          { clipPath: clipFrom[el.dataset.dir || "up"] },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" },
        );
        if (inner) {
          tl.fromTo(inner, { scale: 1.22 }, { scale: 1, duration: 2.2, ease: "expo.out" }, 0.1);
        }
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="words"]').forEach((el) => {
        const words = el.querySelectorAll(".word");
        if (!words.length) return;
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end: "bottom 52%",
              scrub: 0.6,
            },
          })
          .fromTo(
            words,
            { opacity: 0.13 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.12,
            },
          );
      });

      gsap.utils.toArray<HTMLElement>('[data-reveal="rule"]').forEach((el) => {
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: "top 95%", once: true },
          })
          .fromTo(
            el,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 1.4,
              ease: "expo.inOut",
              delay: delayOf(el),
            },
          );
      });

      if (desktop) {
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amt = parseFloat(el.dataset.parallax || "8");
          const parent = el.parentElement || el;
          gsap.fromTo(
            el,
            { yPercent: -amt },
            {
              yPercent: amt,
              ease: "none",
              scrollTrigger: {
                trigger: parent,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el) => {
          const amt = parseFloat(el.dataset.float || "60");
          gsap.fromTo(
            el,
            { y: amt },
            {
              y: -amt,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      }
    },
  );

  return mm;
}
