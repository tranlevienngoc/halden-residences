"use client";

import Image from "next/image";
import { useRef } from "react";
import { LIFESTYLE } from "@/lib/content";
import { gsap, useIsoLayoutEffect } from "@/lib/gsap";
import { Lines, Meta } from "./ui/primitives";

// Editorial rhythm: each panel gets its own height + vertical offset on desktop.
const LAYOUT = [
  "lg:h-[64vh] lg:w-[min(30vw,520px)] lg:-translate-y-[6vh]",
  "lg:h-[76vh] lg:w-[min(36vw,620px)] lg:translate-y-[3vh]",
  "lg:h-[54vh] lg:w-[min(26vw,440px)] lg:-translate-y-[10vh]",
  "lg:h-[70vh] lg:w-[min(34vw,580px)] lg:translate-y-[6vh]",
  "lg:h-[60vh] lg:w-[min(28vw,480px)] lg:-translate-y-[4vh]",
];

export default function Lifestyle() {
  const root = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    const track = rail.current;
    if (!el || !track) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      el.dataset.pinned = "true";
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          pin: true,
          anticipatePin: 1,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
        },
      });

      gsap.utils.toArray<HTMLElement>(".ls-panel", el).forEach((panel) => {
        const img = panel.querySelector(".ls-img");
        gsap.fromTo(
          img,
          { xPercent: -7 },
          {
            xPercent: 7,
            ease: "none",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
          },
        );
        gsap.fromTo(
          panel.querySelector(".ls-cap"),
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 85%", toggleActions: "play none none reverse" },
          },
        );
      });

      return () => {
        delete el.dataset.pinned;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="lifestyle"
      aria-labelledby="lifestyle-title"
      className="group/ls relative overflow-hidden bg-ink text-ivory data-[pinned=true]:h-[100svh]"
    >
      <div
        ref={rail}
        className="flex flex-col py-[clamp(6rem,13vw,12rem)] group-data-[pinned=true]/ls:h-full group-data-[pinned=true]/ls:w-max group-data-[pinned=true]/ls:flex-row group-data-[pinned=true]/ls:items-center group-data-[pinned=true]/ls:py-0 will-change-transform"
      >
        {/* Intro */}
        <div className="wrap shrink-0 group-data-[pinned=true]/ls:mx-0 group-data-[pinned=true]/ls:w-[min(40vw,640px)] group-data-[pinned=true]/ls:max-w-none group-data-[pinned=true]/ls:pr-[6vw]">
          <Meta className="text-stone">
            <span className="text-ivory">05</span> / Lifestyle
          </Meta>
          <Lines
            id="lifestyle-title"
            className="t-h1 mt-6"
            lines={[
              "A life",
              <span key="balance">
                in <span className="serif-i">balance.</span>
              </span>,
            ]}
          />
          <p className="t-body mt-8 max-w-[24rem] text-ivory/70" data-reveal="fade">
            Days at Halden are measured in light rather than hours — from the first coffee at the glass to the last ember on the
            terrace.
          </p>
          <p className="t-meta mt-10 hidden items-center gap-3 text-stone group-data-[pinned=true]/ls:flex" aria-hidden="true">
            Scroll <span className="block h-px w-10 bg-stone" /> Five moments
          </p>
          <p className="t-meta mt-10 text-stone group-data-[pinned=true]/ls:hidden" aria-hidden="true">
            Swipe →
          </p>
        </div>

        {/* Panels */}
        <ul
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--pad)] group-data-[pinned=true]/ls:mt-0 group-data-[pinned=true]/ls:snap-none group-data-[pinned=true]/ls:items-center group-data-[pinned=true]/ls:gap-[4vw] group-data-[pinned=true]/ls:overflow-visible group-data-[pinned=true]/ls:pl-0 group-data-[pinned=true]/ls:pr-[12vw]"
          aria-label="Lifestyle moments"
        >
          {LIFESTYLE.map((item, i) => (
            <li key={item.n} className={`ls-panel w-[78vw] shrink-0 snap-start sm:w-[52vw] ${LAYOUT[i]}`}>
              <figure className="flex h-full flex-col">
                <div className="media media-hover relative aspect-[3/4] w-full lg:aspect-auto lg:flex-1" data-cursor="view" data-cursor-label={item.title}>
                  <div className="ls-img absolute inset-y-0 -left-[9%] -right-[9%]">
                    <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1024px) 36vw, 78vw" quality={70} className="object-cover" />
                  </div>
                </div>
                <figcaption className="ls-cap mt-4 flex items-baseline justify-between gap-6">
                  <span className="t-meta text-ivory">
                    {item.n} — {item.title}
                  </span>
                  <span className="max-w-[17rem] text-right font-serif text-[1.125rem] italic leading-snug text-ivory/70">
                    {item.caption}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      {/* progress */}
      <div className="pointer-events-none absolute inset-x-[var(--pad)] bottom-8 hidden items-center gap-6 group-data-[pinned=true]/ls:flex" aria-hidden="true">
        <span className="t-meta text-stone">01</span>
        <span className="relative block h-px flex-1 bg-ivory/15">
          <span ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-ivory" />
        </span>
        <span className="t-meta text-stone">05</span>
      </div>
    </section>
  );
}
