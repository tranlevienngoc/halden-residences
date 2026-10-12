import { IMG } from "@/lib/content";
import { Lines, Media, Meta, Rule } from "./ui/primitives";

const SPECS = [
  { k: "Architect", v: "Studio Halden" },
  { k: "Materials", v: "Concrete / Oak / Natural Stone" },
  { k: "Residences", v: "18" },
  { k: "Completion", v: "2027" },
];

export default function Architecture() {
  return (
    <section id="architecture" aria-labelledby="architecture-title" className="relative bg-ink text-ivory">
      <div className="wrap pt-[clamp(6rem,13vw,12rem)]">
        <div className="grid-12 gap-y-6">
          <Meta className="col-span-12 text-stone md:col-span-3">
            <span className="text-ivory">02</span> / Architecture
          </Meta>
          <Lines
            id="architecture-title"
            className="t-h1 col-span-12 md:col-span-9"
            lines={[
              "Formed by",
              <span key="landscape">
                <span className="serif-i">the</span> Landscape.
              </span>,
            ]}
          />
        </div>

        {/* Fig. 01 — large landscape */}
        <figure className="grid-12 mt-[clamp(3.5rem,8vw,8rem)] gap-y-4">
          <Media
            src={IMG.archLandscape}
            alt="Low board-formed concrete residence with a green roof emerging from a forested hillside above a misty valley"
            sizes="(min-width: 768px) 84vw, 100vw"
            className="col-span-12 aspect-[4/3] md:col-span-10 md:aspect-[16/9]"
            reveal="up"
            cursor="Explore"
          />
          <figcaption className="col-span-12 flex justify-between md:col-span-2 md:flex-col md:justify-end md:pb-1">
            <Meta className="text-ivory">Fig. 01</Meta>
            <Meta className="text-stone md:mt-2">North ridge,
              <br className="hidden md:block" /> early morning
            </Meta>
          </figcaption>
        </figure>

        {/* Fig. 02 — portrait offset right with metadata */}
        <div className="grid-12 mt-[clamp(4rem,10vw,10rem)] items-end gap-y-14">
          <div className="col-span-12 md:col-span-5 md:col-start-1 md:pb-6">
            <p className="t-lead max-w-[30rem] text-ivory/85 text-pretty" data-reveal="fade">
              Long, low volumes are pressed into the contour so that from the valley the houses read as a single horizontal line —
              a shadow beneath the canopy. Glass is reserved for where the land opens up.
            </p>

            <dl className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-2 gap-x-[var(--gutter)]">
              {SPECS.map((s, i) => (
                <div key={s.k} className={i > 1 ? "mt-8" : ""}>
                  <Rule className="mb-4" />
                  <dt className="t-meta text-stone" data-reveal="fade">
                    {s.k}
                  </dt>
                  <dd
                    className="mt-2 font-display text-[clamp(1.125rem,1.6vw,1.5rem)] font-medium tracking-[-0.02em]"
                    data-reveal="fade"
                    data-delay="0.08"
                  >
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="col-span-12 sm:col-span-8 sm:col-start-5 md:col-span-5 md:col-start-8">
            <Media
              src={IMG.archPortrait}
              alt="Raw concrete wall meeting a floor-to-ceiling glass corner, a birch tree casting soft shadows"
              sizes="(min-width: 768px) 40vw, 90vw"
              className="aspect-[3/4]"
              reveal="down"
              parallax={8}
              cursor="Detail"
            />
            <figcaption className="mt-4 flex justify-between">
              <Meta className="text-ivory">Fig. 02</Meta>
              <Meta className="text-stone">Courtyard glazing, Residence C</Meta>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Fig. 03 — full bleed */}
      <figure className="mt-[clamp(5rem,12vw,12rem)]">
        <Media
          src={IMG.archPool}
          alt="Infinity pool on a stone terrace beneath a floating concrete roof, overlooking a forest valley at dusk"
          sizes="100vw"
          className="h-[70svh] w-full md:h-[100svh]"
          reveal="center"
          parallax={10}
          hover={false}
        />
        <figcaption className="wrap flex justify-between pb-[clamp(5rem,10vw,9rem)] pt-4">
          <Meta className="text-ivory">Fig. 03</Meta>
          <Meta className="text-right text-stone">The Ridge Pavilion — west terrace, dusk</Meta>
        </figcaption>
      </figure>
    </section>
  );
}
