"use client";

import { useMemo, useRef, useState } from "react";
import { LOCATIONS } from "@/lib/content";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { Lines, Meta, Rule } from "./ui/primitives";

const HOME = { x: 50, y: 50 };

/** Deterministic organic contour ring (rounded to avoid SSR/CSR float drift). */
function ring(cx: number, cy: number, r: number, seed: number) {
  const pts: string[] = [];
  const steps = 72;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const k = 1 + 0.09 * Math.sin(3 * a + seed) + 0.05 * Math.sin(5 * a + seed * 1.7) + 0.025 * Math.sin(9 * a + seed * 0.6);
    const x = cx + Math.cos(a) * r * k * 1.08;
    const y = cy + Math.sin(a) * r * k * 0.92;
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}

function road(to: { x: number; y: number }, bend: number) {
  const mx = (HOME.x + to.x) / 2 + bend;
  const my = (HOME.y + to.y) / 2 - bend * 0.6;
  return `M${HOME.x} ${HOME.y}Q${mx.toFixed(1)} ${my.toFixed(1)} ${to.x} ${to.y}`;
}

function LocationMap({ active }: { active: number | null }) {
  const contours = useMemo(() => {
    const out: string[] = [];
    for (let i = 1; i <= 7; i++) out.push(ring(62, 38, i * 5.2, i * 0.9));
    for (let i = 1; i <= 5; i++) out.push(ring(26, 72, i * 4.4, i * 1.3 + 2));
    for (let i = 1; i <= 3; i++) out.push(ring(84, 82, i * 4, i * 2.1 + 4));
    return out;
  }, []);
  const lake = useMemo(() => ring(36, 40, 7, 5.5), []);
  const bends = [6, -8, 10, -6];

  return (
    <svg viewBox="0 0 100 100" className="loc-map h-full w-full" role="img" aria-labelledby="map-title">
      <title id="map-title">Abstract map showing Halden at the centre with travel times to nearby destinations</title>
      <defs>
        <pattern id="trees" width="2.2" height="2.2" patternUnits="userSpaceOnUse">
          <circle cx="1.1" cy="1.1" r="0.32" fill="currentColor" opacity="0.35" />
        </pattern>
        <clipPath id="forest-clip">
          <path d={ring(64, 40, 30, 1.2)} />
        </clipPath>
      </defs>

      {/* forest texture */}
      <rect width="100" height="100" fill="url(#trees)" clipPath="url(#forest-clip)" />

      {/* topography */}
      <g fill="none" stroke="currentColor" strokeWidth="0.16" opacity="0.5">
        {contours.map((d, i) => (
          <path key={i} d={d} pathLength={1} className="loc-draw" />
        ))}
      </g>

      {/* lake */}
      <path d={lake} fill="currentColor" opacity="0.1" />
      <text x="36" y="40.8" textAnchor="middle" className="fill-current font-mono" fontSize="1.6" letterSpacing="0.3" opacity="0.55">
        LAKE HALDEN
      </text>

      {/* radius rings */}
      <g fill="none" stroke="currentColor" strokeWidth="0.14" strokeDasharray="0.6 0.8" opacity="0.45">
        <circle cx={HOME.x} cy={HOME.y} r="16" />
        <circle cx={HOME.x} cy={HOME.y} r="32" />
        <circle cx={HOME.x} cy={HOME.y} r="48" />
      </g>
      <g className="fill-current font-mono" fontSize="1.5" opacity="0.5" letterSpacing="0.2">
        <text x={HOME.x + 16.6} y={HOME.y - 0.6}>5 KM</text>
        <text x={HOME.x + 32.6} y={HOME.y - 0.6}>10 KM</text>
      </g>

      {/* routes */}
      {LOCATIONS.map((loc, i) => (
        <path
          key={loc.label}
          d={road(loc, bends[i])}
          fill="none"
          stroke={active === i ? "var(--accent)" : "currentColor"}
          strokeWidth={active === i ? 0.4 : 0.22}
          strokeDasharray={active === i ? "none" : "1 0.9"}
          opacity={active === null || active === i ? 0.9 : 0.25}
          style={{ transition: "all .6s cubic-bezier(.19,1,.22,1)" }}
        />
      ))}

      {/* destinations */}
      {LOCATIONS.map((loc, i) => {
        const on = active === i;
        const right = loc.x < 70;
        return (
          <g key={loc.label} className="loc-pt">
          <g style={{ transition: "opacity .6s" }} opacity={active === null || on ? 1 : 0.35}>
            <circle cx={loc.x} cy={loc.y} r={on ? 1.3 : 0.9} fill={on ? "var(--accent)" : "currentColor"} style={{ transition: "all .5s" }} />
            <text
              x={right ? loc.x + 2.2 : loc.x - 2.2}
              y={loc.y + 0.6}
              textAnchor={right ? "start" : "end"}
              className="fill-current font-mono"
              fontSize="1.85"
              letterSpacing="0.25"
            >
              {loc.min} MIN — {loc.label.toUpperCase()}
            </text>
          </g>
          </g>
        );
      })}

      {/* Halden */}
      <g>
        <circle cx={HOME.x} cy={HOME.y} r="2" fill="var(--accent)" opacity="0.5" className="origin-center [transform-box:fill-box] animate-[pulse-ring_2.8s_ease-out_infinite]" />
        <circle cx={HOME.x} cy={HOME.y} r="1.25" fill="var(--accent)" />
        <text x={HOME.x} y={HOME.y + 4.6} textAnchor="middle" className="fill-current font-display" fontSize="2.6" fontWeight="600" letterSpacing="0.6">
          HALDEN
        </text>
      </g>
    </svg>
  );
}

export default function Location() {
  const [active, setActive] = useState<number | null>(null);
  const root = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".loc-draw",
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 2.6,
          ease: "power2.inOut",
          stagger: 0.06,
          scrollTrigger: { trigger: ".loc-frame", start: "top 75%", once: true },
        },
      );
      gsap.fromTo(
        ".loc-pt",
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1, stagger: 0.12, delay: 0.8, scrollTrigger: { trigger: ".loc-frame", start: "top 75%", once: true } },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="location" aria-labelledby="location-title" className="relative bg-bone text-ink">
      <div className="wrap py-[clamp(6rem,13vw,12rem)]">
        <div className="grid-12 gap-y-6">
          <Meta className="col-span-12 text-stone-dark md:col-span-3">
            <span className="text-ink">04</span> / Location
          </Meta>
          <Lines
            id="location-title"
            className="t-h2 col-span-12 md:col-span-9"
            lines={[
              "Close to everything.",
              <span key="b" className="serif-i text-stone-dark">
                Removed from everything.
              </span>,
            ]}
          />
        </div>

        <div className="grid-12 mt-[clamp(3.5rem,8vw,7rem)] items-start gap-y-14">
          <div className="loc-frame relative col-span-12 aspect-square border border-ink/15 md:col-span-7 lg:col-span-6" data-reveal="fade">
            <LocationMap active={active} />
            <Meta className="absolute left-4 top-4 text-stone-dark">N ↑</Meta>
            <Meta className="absolute right-4 top-4 text-stone-dark">46°31′N 7°58′E</Meta>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="block h-px w-10 bg-ink/60" />
              <Meta className="text-stone-dark">2 km</Meta>
            </div>
          </div>

          <div className="col-span-12 md:col-span-5 md:col-start-8 lg:col-span-5 lg:col-start-8">
            <p className="t-lead max-w-[28rem] text-ink/80 text-pretty" data-reveal="fade">
              Set within forty-two hectares of protected pine, a single private road connects Halden to the city — close enough for
              dinner, far enough to hear nothing at all.
            </p>

            <ul className="mt-8 lg:mt-10" onMouseLeave={() => setActive(null)}>
              <li>
                <Rule />
              </li>
              {LOCATIONS.map((loc, i) => (
                <li key={loc.label}>
                  <button
                    type="button"
                    id={`location-${i}`}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    onClick={() => setActive(active === i ? null : i)}
                    aria-pressed={active === i}
                    className="group flex w-full items-baseline gap-4 py-3.5 text-left transition-colors duration-300 lg:py-4"
                  >
                    <span
                      className={`font-display text-[clamp(2rem,3.5vw,3.5rem)] font-medium leading-none tracking-[-0.05em] tabular-nums transition-colors duration-500 ${
                        active === i ? "text-accent" : ""
                      }`}
                    >
                      {loc.min}
                    </span>
                    <span className="t-meta text-stone-dark">min</span>
                    <span className="ml-auto text-right">
                      <span className="block font-display text-base font-medium tracking-[-0.01em] lg:text-lg">{loc.label}</span>
                      <span className="t-meta mt-0.5 block text-stone-dark">{loc.note}</span>
                    </span>
                  </button>
                  <Rule />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
