import { MATERIALS } from "@/lib/content";
import { Lines, Media, Meta } from "./ui/primitives";

// Catalogue composition — each sample has its own column span, ratio and drift.
const PLACEMENT = [
  { cls: "col-span-8 md:col-span-4 md:col-start-1", ratio: "aspect-[3/4]", float: 30, dir: "up" as const },
  { cls: "col-span-7 col-start-6 mt-[-10vw] md:col-span-3 md:col-start-6 md:mt-[14vw]", ratio: "aspect-[3/4]", float: 80, dir: "down" as const },
  { cls: "col-span-6 mt-10 md:col-span-3 md:col-start-10 md:mt-[4vw]", ratio: "aspect-square", float: 50, dir: "left" as const },
  { cls: "col-span-12 mt-10 md:col-span-6 md:col-start-2 md:mt-[-2vw]", ratio: "aspect-[16/9]", float: 20, dir: "right" as const },
  { cls: "col-span-8 col-start-5 mt-10 md:col-span-3 md:col-start-9 md:mt-[-6vw]", ratio: "aspect-[3/4]", float: 70, dir: "up" as const },
];

export default function Materials() {
  return (
    <section id="materials" aria-labelledby="materials-title" className="relative overflow-hidden bg-bone text-ink">
      <div className="wrap pb-[clamp(6rem,12vw,11rem)] pt-[clamp(7.5rem,14vw,14rem)]">
        <div className="grid-12 items-end gap-y-10">
          <div className="col-span-12 md:col-span-8">
            <Meta className="text-stone-dark">
              <span className="text-ink">06</span> / Materials
            </Meta>
            <Lines
              id="materials-title"
              className="t-h1 mt-6"
              lines={[
                "Materials",
                <span key="age">
                  that <span className="serif-i">age</span>
                </span>,
                "beautifully.",
              ]}
            />
          </div>
          <div className="col-span-12 md:col-span-3 md:col-start-10" data-reveal="fade">
            <p className="t-body text-ink/75 text-pretty">
              A palette of five, drawn from the valley and left honest. Stone softens, oak silvers, concrete holds the memory of the
              timber that formed it.
            </p>
            <Meta className="mt-6 text-stone-dark">Catalogue — 05 samples</Meta>
          </div>
        </div>

        <div className="grid-12 mt-[clamp(4rem,9vw,9rem)] gap-x-[var(--gutter)]">
          {MATERIALS.map((m, i) => {
            const p = PLACEMENT[i];
            return (
              <figure key={m.code} className={`${p.cls} relative`} data-float={p.float}>
                <div className="relative">
                  <Media src={m.image} alt={m.alt} sizes="(min-width: 768px) 34vw, 70vw" className={p.ratio} reveal={p.dir} parallax={5} quality={70} />
                  {/* catalogue crosshairs */}
                  <span aria-hidden="true" className="pointer-events-none absolute -left-2 -top-2 h-4 w-4">
                    <span className="absolute left-1/2 top-0 h-full w-px bg-ink/50" />
                    <span className="absolute left-0 top-1/2 h-px w-full bg-ink/50" />
                  </span>
                  <span className="t-meta pointer-events-none absolute right-3 top-3 bg-bone/85 px-2 py-1 text-[0.625rem] text-ink">
                    {m.code}
                  </span>
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4" data-reveal="fade">
                  <span className="font-display text-[1.0625rem] font-medium tracking-[-0.01em]">{m.name}</span>
                  <span className="t-meta text-right text-[0.625rem] text-stone-dark">{m.spec}</span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
