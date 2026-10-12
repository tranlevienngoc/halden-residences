import { Meta, Rule, Words } from "./ui/primitives";

const STATS = [
  { k: "18", v: "Residences, never more" },
  { k: "42", v: "Hectares of protected forest" },
  { k: "1:12", v: "Built footprint to landscape" },
];

export default function Manifesto() {
  return (
    <section id="manifesto" aria-labelledby="manifesto-title" className="relative bg-bone text-ink">
      <div className="wrap py-[clamp(6rem,14vw,13rem)]">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 md:col-span-3">
            <Meta className="text-ink">01 — Philosophy</Meta>
            <Meta className="mt-2 text-stone-dark">Founding notes</Meta>
          </div>

          <div className="col-span-12 md:col-span-9">
            <Words
              as="h2"
              id="manifesto-title"
              className="t-statement text-balance"
              segments={[
                { text: "“Architecture should not" },
                { text: "compete", italic: true },
                { text: "with nature.", br: true },
                { text: "It should" },
                { text: "disappear", italic: true },
                { text: "into it.”" },
              ]}
            />
          </div>
        </div>

        <div className="grid-12 mt-[clamp(4rem,9vw,9rem)] gap-y-10">
          <div className="col-span-12 md:col-span-4 md:col-start-4" data-reveal="fade">
            <p className="t-body text-ink/80 text-pretty">
              Halden began with a single condition: that the forest should still be the forest when we leave. Every residence is
              sited around the trees that were already here, set low into the slope and oriented by the path of the sun rather than
              the line of the road.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9" data-reveal="fade" data-delay="0.1">
            <p className="t-body text-ink/80 text-pretty">
              Privacy is not a wall but a distance — each home is held a quiet walk from the next. Materials are chosen to weather
              rather than resist: board-formed concrete, oiled oak, stone from the valley floor. Nothing here is designed to look
              new for long.
            </p>
            <p className="mt-8 font-serif text-2xl italic text-ink">— Studio Halden</p>
          </div>
        </div>

        <div className="mt-[clamp(4.5rem,10vw,10rem)]">
          <Rule />
          <dl className="grid-12 gap-y-8 pt-8" data-reveal="fade" data-stagger>
            {STATS.map((s) => (
              <div key={s.k} className="col-span-12 flex items-baseline justify-between gap-6 sm:col-span-4 sm:block">
                <dt className="sr-only">{s.v}</dt>
                <dd className="font-display text-[clamp(3rem,6vw,6.5rem)] font-medium leading-none tracking-[-0.05em]">{s.k}</dd>
                <dd className="t-meta mt-3 text-stone-dark">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
