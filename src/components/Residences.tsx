"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { RESIDENCES } from "@/lib/content";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { ArrowLink, Lines, Meta } from "./ui/primitives";

export default function Residences() {
  const [active, setActive] = useState(0);
  const prev = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const specs = useRef<HTMLDivElement>(null);
  const res = RESIDENCES[active];

  // Mask transition between residence images + spec values roll.
  useIsoLayoutEffect(() => {
    const el = stage.current;
    if (!el || prev.current === active) return;
    const layers = el.querySelectorAll<HTMLElement>(".res-layer");
    const incoming = layers[active];
    const reduced = prefersReducedMotion();

    layers.forEach((l, i) => {
      gsap.set(l, { zIndex: i === active ? 3 : i === prev.current ? 2 : 1 });
    });

    gsap.killTweensOf([incoming, incoming.firstElementChild]);
    if (reduced) {
      gsap.set(incoming, { clipPath: "inset(0% 0% 0% 0%)" });
    } else {
      gsap.fromTo(
        incoming,
        { clipPath: "inset(0% 0% 0% 100%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" },
      );
      gsap.fromTo(incoming.firstElementChild, { scale: 1.18, xPercent: 6 }, { scale: 1, xPercent: 0, duration: 1.6, ease: "expo.out" });
      const vals = specs.current?.querySelectorAll(".line-inner");
      if (vals) gsap.fromTo(vals, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.04 });
    }
    prev.current = active;
  }, [active]);

  const rows = [
    { k: "Interior", v: `${res.area} sqm` },
    { k: "Bedrooms", v: String(res.bedrooms).padStart(2, "0") },
    { k: "Bathrooms", v: String(res.bathrooms).padStart(2, "0") },
    { k: "Water", v: res.pool },
    { k: "Outlook", v: res.view },
  ];

  return (
    <section id="residences" aria-labelledby="residences-title" className="relative bg-ink-2 text-ivory">
      <div className="wrap py-[clamp(6rem,13vw,12rem)]">
        <div className="grid-12 gap-y-6">
          <Meta className="col-span-12 text-stone md:col-span-3">
            <span className="text-ivory">03</span> / Residences
          </Meta>
          <Lines
            id="residences-title"
            className="t-h1 col-span-12 md:col-span-9"
            lines={[
              "Spaces designed",
              <span key="around-life">
                around <span className="serif-i">your</span> life.
              </span>,
            ]}
          />
        </div>

        <div className="grid-12 mt-[clamp(3.5rem,8vw,7rem)] gap-y-12">
          {/* Selector */}
          <div className="col-span-12 flex flex-col md:col-span-5 lg:col-span-4">
            <div role="tablist" aria-label="Residence types" className="border-t border-ivory/15" data-reveal="fade" data-stagger>
              {RESIDENCES.map((r, i) => {
                const on = i === active;
                return (
                  <button
                    key={r.id}
                    id={`residence-tab-${r.id}`}
                    role="tab"
                    type="button"
                    aria-selected={on}
                    aria-controls="residence-panel"
                    onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    className={`group flex w-full items-baseline gap-5 border-b border-ivory/15 py-5 text-left transition-colors duration-500 ${
                      on ? "text-ivory" : "text-stone hover:text-ivory"
                    }`}
                  >
                    <span className="t-meta w-6">{r.id}</span>
                    <span className="flex-1">
                      <span className="block font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-none tracking-[-0.03em]">
                        {r.name}
                      </span>
                      <span className="mt-2 block font-serif text-lg italic opacity-80">{r.title}</span>
                    </span>
                    <span className="t-meta tabular-nums">{r.area} sqm</span>
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 self-center rounded-full bg-accent transition-transform duration-500 ${on ? "scale-100" : "scale-0"}`}
                    />
                  </button>
                );
              })}
            </div>

            <div
              id="residence-panel"
              role="tabpanel"
              aria-labelledby={`residence-tab-${res.id}`}
              ref={specs}
              className="mt-10"
            >
              <dl className="space-y-0">
                {rows.map((row) => (
                  <div key={row.k} className="flex items-baseline justify-between border-b border-ivory/10 py-3">
                    <dt className="t-meta text-stone">{row.k}</dt>
                    <dd className="line-mask t-meta text-right text-ivory">
                      <span className="line-inner">{row.v}</span>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="t-body mt-8 max-w-[26rem] text-ivory/70">{res.note}</p>
              <ArrowLink href="#availability" label="Explore residence" variant="outline" className="mt-10 text-ivory" id="explore-residence" />
            </div>
          </div>

          {/* Stage */}
          <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-7 lg:col-start-6">
            <div
              ref={stage}
              className="media relative aspect-[4/5] w-full sm:aspect-[5/4] md:aspect-[4/5] lg:aspect-[5/4]"
              data-reveal="clip"
              data-dir="right"
              data-cursor="view"
              data-cursor-label={res.id}
            >
              <div className="media-inner absolute inset-0">
                {RESIDENCES.map((r, i) => (
                  <div
                    key={r.id}
                    className="res-layer absolute inset-0 overflow-hidden"
                    style={{ zIndex: i === 0 ? 3 : 1, clipPath: i === 0 ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)" }}
                    aria-hidden={i !== active}
                  >
                    <div className="absolute inset-0">
                      <Image src={r.image} alt={r.alt} fill sizes="(min-width: 768px) 58vw, 100vw" quality={80} className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between bg-gradient-to-t from-ink/70 to-transparent p-5 md:p-7">
                <p className="font-serif text-[clamp(1.5rem,2.4vw,2.25rem)] italic leading-none text-ivory">{res.title}</p>
                <p className="t-meta tabular-nums text-ivory/80">
                  {String(active + 1).padStart(2, "0")} / {String(RESIDENCES.length).padStart(2, "0")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
