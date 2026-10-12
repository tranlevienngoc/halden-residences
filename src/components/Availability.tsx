"use client";

import { useMemo, useRef, useState } from "react";
import { RESIDENCES, UNITS, type ResidenceType, type Unit, type UnitStatus } from "@/lib/content";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { ArrowLink, Lines, Meta } from "./ui/primitives";

/* ----------------------------- Floor plans ------------------------------- */

type Room = { x: number; y: number; w: number; h: number; label?: string; pool?: boolean };

const PLANS: Record<ResidenceType, Room[]> = {
  A: [
    { x: 4, y: 6, w: 46, h: 36, label: "Living" },
    { x: 50, y: 6, w: 22, h: 18, label: "Kitchen" },
    { x: 50, y: 24, w: 22, h: 18, label: "Dining" },
    { x: 72, y: 6, w: 24, h: 24, label: "Principal" },
    { x: 72, y: 30, w: 24, h: 12, label: "Bath" },
    { x: 4, y: 42, w: 22, h: 20, label: "Bed 02" },
    { x: 26, y: 42, w: 22, h: 20, label: "Bed 03" },
    { x: 48, y: 42, w: 16, h: 20, label: "Entry" },
    { x: 64, y: 42, w: 32, h: 20, label: "Terrace" },
    { x: 56, y: 64, w: 40, h: 8, pool: true, label: "Pool" },
  ],
  B: [
    { x: 4, y: 6, w: 30, h: 30, label: "Principal" },
    { x: 4, y: 36, w: 30, h: 12, label: "Spa" },
    { x: 34, y: 6, w: 38, h: 42, label: "Living" },
    { x: 72, y: 6, w: 24, h: 20, label: "Kitchen" },
    { x: 72, y: 26, w: 24, h: 22, label: "Dining" },
    { x: 4, y: 48, w: 22, h: 18, label: "Bed 02" },
    { x: 26, y: 48, w: 22, h: 18, label: "Bed 03" },
    { x: 48, y: 48, w: 22, h: 18, label: "Bed 04" },
    { x: 70, y: 48, w: 26, h: 18, label: "Entry" },
    { x: 4, y: 67, w: 54, h: 6, pool: true },
  ],
  C: [
    { x: 4, y: 6, w: 28, h: 30, label: "Principal" },
    { x: 32, y: 6, w: 36, h: 18, label: "Living" },
    { x: 68, y: 6, w: 28, h: 30, label: "Kitchen" },
    { x: 4, y: 36, w: 18, h: 18, label: "Bed 02" },
    { x: 78, y: 36, w: 18, h: 18, label: "Dining" },
    { x: 32, y: 30, w: 36, h: 18, pool: true, label: "Courtyard pool" },
    { x: 4, y: 54, w: 18, h: 18, label: "Bed 03" },
    { x: 22, y: 54, w: 18, h: 18, label: "Bed 04" },
    { x: 40, y: 54, w: 20, h: 18, label: "Entry" },
    { x: 60, y: 54, w: 18, h: 18, label: "Bed 05" },
    { x: 78, y: 54, w: 18, h: 18, label: "Studio" },
  ],
};

function FloorPlan({ type }: { type: ResidenceType }) {
  const rooms = PLANS[type];
  return (
    <svg viewBox="0 0 100 78" className="h-full w-full" role="img" aria-label={`Indicative floor plan, Residence ${type}`}>
      <defs>
        <pattern id="hatch" width="1.6" height="1.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="1.6" stroke="currentColor" strokeWidth="0.25" opacity="0.5" />
        </pattern>
      </defs>
      <g className="fp-rooms">
        {rooms.map((r, i) => (
          <g key={`${type}-${i}`}>
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              fill={r.pool ? "url(#hatch)" : "none"}
              stroke="currentColor"
              strokeWidth={r.pool ? 0.2 : 0.35}
              opacity={r.pool ? 0.8 : 0.9}
            />
            {r.label && (
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2 + 0.6}
                textAnchor="middle"
                className="fill-current font-mono"
                fontSize="1.7"
                letterSpacing="0.25"
                opacity="0.7"
              >
                {r.label.toUpperCase()}
              </text>
            )}
          </g>
        ))}
      </g>
      {/* outer wall */}
      <rect x="4" y="6" width="92" height={type === "A" ? 56 : type === "B" ? 60 : 66} fill="none" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

/* ------------------------------ Site plan -------------------------------- */

const SITE = [
  [14, 14], [24, 10], [36, 12], [48, 9], [62, 12], [74, 10],
  [84, 18], [88, 32], [80, 44], [68, 48], [56, 44], [44, 48],
  [32, 46], [20, 42], [12, 30], [28, 28], [52, 28], [70, 28],
] as const;

function SitePlan({ unit }: { unit: Unit }) {
  const bySite = useMemo(() => new Map(UNITS.map((u) => [u.site, u])), []);
  return (
    <svg viewBox="0 0 100 58" className="h-full w-full" role="img" aria-label={`Site plan with ${unit.id} highlighted`}>
      <path d="M2 56 C 20 40, 30 36, 50 37 S 86 30, 98 4" fill="none" stroke="currentColor" strokeWidth="0.35" strokeDasharray="1 1" opacity="0.4" />
      {SITE.map(([x, y], i) => {
        const u = bySite.get(i);
        const on = u?.id === unit.id;
        const sold = u?.status === "Sold";
        return (
          <rect
            key={i}
            x={x - 2.6}
            y={y - 1.8}
            width="5.2"
            height="3.6"
            fill={on ? "var(--accent)" : sold ? "currentColor" : "none"}
            fillOpacity={on ? 1 : sold ? 0.25 : 0}
            stroke={on ? "var(--accent)" : "currentColor"}
            strokeWidth="0.3"
            strokeDasharray={!u ? "0.6 0.6" : "none"}
            opacity={u ? 1 : 0.35}
            style={{ transition: "all .5s cubic-bezier(.19,1,.22,1)" }}
          />
        );
      })}
    </svg>
  );
}

/* ------------------------------ Section ---------------------------------- */

function StatusTag({ status }: { status: UnitStatus }) {
  const cls =
    status === "Available"
      ? "bg-ivory"
      : status === "Reserved"
        ? "border border-accent bg-transparent"
        : "bg-stone-dark";
  return (
    <span className={`t-meta inline-flex items-center gap-2.5 ${status === "Sold" ? "text-stone-dark line-through" : status === "Reserved" ? "text-accent" : "text-ivory"}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${cls}`} />
      {status}
    </span>
  );
}

const FILTERS = ["All", "Available"] as const;

export default function Availability() {
  const [activeId, setActiveId] = useState(UNITS[0].id);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const planRef = useRef<HTMLDivElement>(null);
  const lastType = useRef<ResidenceType>(UNITS[0].type);

  const unit = UNITS.find((u) => u.id === activeId) ?? UNITS[0];
  const res = RESIDENCES.find((r) => r.id === unit.type)!;
  const list = filter === "All" ? UNITS : UNITS.filter((u) => u.status === "Available");
  const availableCount = UNITS.filter((u) => u.status === "Available").length;

  useIsoLayoutEffect(() => {
    if (lastType.current === unit.type || !planRef.current || prefersReducedMotion()) {
      lastType.current = unit.type;
      return;
    }
    lastType.current = unit.type;
    gsap.fromTo(planRef.current.querySelectorAll(".fp-rooms > g"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.03, ease: "power2.out" });
  }, [unit.type]);

  return (
    <section id="availability" aria-labelledby="availability-title" className="relative bg-ink text-ivory">
      <div className="wrap py-[clamp(6rem,13vw,12rem)]">
        <div className="grid-12 items-end gap-y-8">
          <div className="col-span-12 md:col-span-8">
            <Meta className="text-stone">
              <span className="text-ivory">07</span> / Availability
            </Meta>
            <Lines
              id="availability-title"
              className="t-h1 mt-6"
              lines={[
                "A limited",
                <span key="collection">
                  <span className="serif-i">collection.</span>
                </span>,
              ]}
            />
          </div>
          <div className="col-span-12 md:col-span-4 md:text-right" data-reveal="fade">
            <p className="font-display text-[clamp(3rem,5vw,5rem)] font-medium leading-none tracking-[-0.05em]">
              {String(availableCount).padStart(2, "0")}
              <span className="text-stone">/18</span>
            </p>
            <Meta className="mt-3 text-stone">Residences available — Phase I</Meta>
          </div>
        </div>

        <div className="grid-12 mt-[clamp(3.5rem,7vw,6rem)] items-start gap-y-14">
          {/* Unit list */}
          <div className="col-span-12 lg:col-span-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex gap-2" role="group" aria-label="Filter residences">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    id={`filter-${f.toLowerCase()}`}
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                    className={`t-meta border px-3.5 py-2 transition-colors duration-500 ${
                      filter === f ? "border-ivory bg-ivory text-ink" : "border-ivory/20 text-stone hover:border-ivory/60 hover:text-ivory"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <Meta className="hidden text-stone sm:block">Hover to preview</Meta>
            </div>

            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Residence availability, Phase I</caption>
              <thead>
                <tr className="border-b border-ivory/15">
                  <th scope="col" className="t-meta pb-3 font-normal text-stone">Residence</th>
                  <th scope="col" className="t-meta hidden pb-3 font-normal text-stone sm:table-cell">Type</th>
                  <th scope="col" className="t-meta hidden pb-3 font-normal text-stone md:table-cell">Plot</th>
                  <th scope="col" className="t-meta pb-3 font-normal text-stone">Area</th>
                  <th scope="col" className="t-meta pb-3 text-right font-normal text-stone">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => {
                  const r = RESIDENCES.find((x) => x.id === u.type)!;
                  const on = u.id === activeId;
                  return (
                    <tr
                      key={u.id}
                      onMouseEnter={() => setActiveId(u.id)}
                      onClick={() => setActiveId(u.id)}
                      className={`group cursor-pointer border-b border-ivory/10 transition-colors duration-500 ${on ? "bg-ivory/[0.045]" : "hover:bg-ivory/[0.03]"}`}
                    >
                      <td className="py-0">
                        <button
                          type="button"
                          id={`unit-${u.id}`}
                          onFocus={() => setActiveId(u.id)}
                          aria-pressed={on}
                          className="flex w-full items-center gap-3 py-5 text-left"
                        >
                          <span
                            aria-hidden="true"
                            className={`block h-px bg-accent transition-all duration-500 ${on ? "w-6" : "w-0"}`}
                          />
                          <span
                            className={`font-display text-[clamp(1.5rem,2.4vw,2.25rem)] font-medium leading-none tracking-[-0.03em] transition-colors duration-500 ${
                              u.status === "Sold" ? "text-stone-dark" : ""
                            }`}
                          >
                            {u.id}
                          </span>
                        </button>
                      </td>
                      <td className="t-meta hidden text-ivory/80 sm:table-cell">{r.name}</td>
                      <td className="t-meta hidden text-stone md:table-cell">{u.plot}</td>
                      <td className="t-meta tabular-nums text-ivory/80">{r.area} sqm</td>
                      <td className="text-right">
                        <StatusTag status={u.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Meta className="mt-6 text-stone">+ 8 residences to be released in Phase II — 2027</Meta>
          </div>

          {/* Preview panel */}
          <aside className="col-span-12 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-span-5 lg:col-start-8" aria-live="polite" aria-label="Selected residence">
            <div className="border border-ivory/15">
              <div className="flex items-baseline justify-between border-b border-ivory/15 px-5 py-4">
                <p className="font-display text-xl font-medium tracking-[-0.02em]">
                  {unit.id} <span className="font-serif text-lg italic text-stone">— {res.title}</span>
                </p>
                <StatusTag status={unit.status} />
              </div>

              <div ref={planRef} className="aspect-[100/78] px-5 py-6 text-ivory">
                <FloorPlan type={unit.type} />
              </div>

              <div className="grid grid-cols-2 border-t border-ivory/15">
                <div className="border-r border-ivory/15 p-5 text-ivory">
                  <Meta className="mb-3 text-stone">Site plan</Meta>
                  <div className="aspect-[100/58]">
                    <SitePlan unit={unit} />
                  </div>
                </div>
                <dl className="space-y-2.5 p-5">
                  {[
                    ["Type", res.name],
                    ["Interior", `${res.area} sqm`],
                    ["Bed / Bath", `${res.bedrooms} / ${res.bathrooms}`],
                    ["Levels", unit.level],
                    ["Price", "On request"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <dt className="t-meta text-stone">{k}</dt>
                      <dd className="t-meta text-right text-ivory">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <ArrowLink href="#private-access" label="Request floor plans" variant="outline" className="mt-6 w-full justify-between text-ivory" id="request-plans" />
          </aside>
        </div>
      </div>
    </section>
  );
}
