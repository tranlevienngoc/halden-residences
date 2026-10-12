"use client";

import Image from "next/image";
import { useRef } from "react";
import { HERO_VIDEO, IMG } from "@/lib/content";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { useExperience } from "./providers/ExperienceProvider";
import { Lines, NavLink } from "./ui/primitives";

export default function Hero() {
  const { ready } = useExperience();
  const root = useRef<HTMLElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);

  // Build intro (paused) + scroll choreography once.
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const frame = el.querySelector(".hero-frame");
      const media = el.querySelector(".hero-media");
      const lines = el.querySelectorAll(".hero-title .line-inner");
      const metas = el.querySelectorAll(".hero-meta");
      const sub = el.querySelector(".hero-sub");
      const scrollCue = el.querySelector(".hero-scroll");

      if (reduced) {
        intro.current = gsap
          .timeline({ paused: true })
          .fromTo([...metas, sub, scrollCue], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });
        return;
      }

      intro.current = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        // 1 — image reveals from subtle architectural letterbox to full bleed
        .fromTo(
          frame,
          { clipPath: "inset(3.5% 2.5% 3.5% 2.5%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power3.inOut" },
          0,
        )
        .fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1.8, ease: "power3.out" }, 0)
        // 2 — headline line by line with dignified luxury pacing
        .fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.08, ease: "power4.out" }, 0.25)
        // 3 — metadata + subheading
        .fromTo([...metas, sub], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.05, ease: "power2.out" }, 0.65)
        // 4 — scroll cue
        .fromTo(scrollCue, { autoAlpha: 0, y: -6 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.9);

      // Scroll: slow push-in on the image, gentle drift on the headline
      gsap.to(el.querySelector(".hero-zoom"), {
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(el.querySelector(".hero-content"), {
        yPercent: -18,
        autoAlpha: 0.15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  useIsoLayoutEffect(() => {
    if (ready) intro.current?.play();
  }, [ready]);

  return (
    <section ref={root} id="top" aria-label="Introduction" className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink">
      <div className="hero-frame absolute inset-0 overflow-hidden">
        <div className="hero-zoom absolute inset-0">
        <div className="hero-media absolute inset-0 will-change-transform">
          {HERO_VIDEO ? (
            <video className="h-full w-full object-cover" src={HERO_VIDEO} poster={IMG.hero} autoPlay muted loop playsInline />
          ) : (
            <Image
              src={IMG.hero}
              alt="Concrete and glass residence glowing at blue hour in a pine forest, mirrored in a still reflecting pool"
              fill
              preload
              loading="eager"
              sizes="100vw"
              quality={80}
              className="object-cover object-[50%_60%]"
            />
          )}
        </div>
        </div>
        {/* readability veil — restrained, not a colour gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,10,0.55)_0%,rgba(11,11,10,0.05)_35%,rgba(11,11,10,0.1)_60%,rgba(11,11,10,0.78)_100%)]" />
      </div>

      <div className="hero-content relative z-10 flex h-full flex-col">
        <div className="wrap grid-12 pt-[calc(var(--header-h)+2.5rem)]">
          <p className="hero-meta invisible t-meta col-span-6 text-ivory/80 md:col-span-3">Private Residences</p>
          <p className="hero-meta invisible t-meta col-span-6 text-right text-ivory/80 md:col-span-3 md:col-start-10">
            <span className="text-ivory">01</span> / 05
          </p>
        </div>

        <div className="wrap mt-auto pb-[clamp(1.75rem,4vw,3.5rem)]">
          <Lines
            as="h1"
            auto={false}
            className="hero-title t-display text-ivory"
            lines={[
              "Live",
              <span key="beyond">
                Beyond <span className="serif-i text-ivory/90">the</span>
              </span>,
              "Ordinary.",
            ]}
          />

          <div className="grid-12 mt-[clamp(1.5rem,3vw,2.75rem)] items-end gap-y-8">
            <p className="hero-sub invisible t-lead col-span-12 max-w-[30rem] text-ivory/85 md:col-span-5">
              A limited collection of architectural residences shaped by landscape, light and silence.
            </p>

            <NavLink
              href="#manifesto"
              className="hero-scroll invisible btn col-span-6 text-ivory md:col-span-3 md:col-start-7"
              id="hero-scroll"
            >
              <span>Scroll to discover</span>
              <span className="relative block h-9 w-px overflow-hidden bg-ivory/25" aria-hidden="true">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-ivory" />
              </span>
            </NavLink>

            <div className="hero-meta invisible col-span-6 text-right md:col-span-3 md:col-start-10">
              <p className="t-meta text-ivory/70">Blue hour — North Ridge</p>
              <p className="t-meta mt-1 text-stone">46°31′N / 7°58′E</p>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
