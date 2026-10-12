"use client";

import Image from "next/image";
import { useRef } from "react";
import { IMG } from "@/lib/content";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";

export default function ImageBreak() {
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ib-media",
        { scale: 1.18 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
      );
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 65%", end: "center 45%", scrub: 0.8 } })
        .fromTo(".ib-line .line-inner", { yPercent: 110 }, { yPercent: 0, stagger: 0.15, ease: "power3.out" })
        .fromTo(".ib-meta", { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.1 }, 0.3);
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-label="Interlude" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink text-ivory">
      <div className="ib-media absolute inset-0 will-change-transform">
        <Image
          src={IMG.silence}
          alt="A dark concrete pavilion at the edge of a still, misty lake at dawn"
          fill
          sizes="100vw"
          quality={80}
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-ink/45" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-[var(--pad)] text-center">
        <h2 className="t-h1">
          <span className="ib-line line-mask">
            <span className="line-inner">Silence</span>
          </span>
          <span className="ib-line line-mask">
            <span className="line-inner">
              is the new <span className="serif-i">luxury.</span>
            </span>
          </span>
        </h2>
      </div>

      <p className="ib-meta t-meta absolute bottom-8 left-[var(--pad)] z-10 text-ivory/70">Interlude</p>
      <p className="ib-meta t-meta absolute bottom-8 right-[var(--pad)] z-10 text-ivory/70">Lake Halden — 06:12</p>
    </section>
  );
}
