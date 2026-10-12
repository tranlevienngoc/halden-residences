"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { IMG, RESIDENCES } from "@/lib/content";
import { gsap, prefersReducedMotion, useIsoLayoutEffect } from "@/lib/gsap";
import { Arrow, Lines, Meta, SlideLabel } from "./ui/primitives";

type Values = { name: string; email: string; phone: string; residence: string; updates: boolean };
type Errors = Partial<Record<keyof Values, string>>;

const INITIAL: Values = { name: "", email: "", phone: "", residence: "", updates: true };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Please enter a valid email address.";
  const digits = v.phone.replace(/[^\d]/g, "");
  if (!/^\+?[\d\s().-]+$/.test(v.phone.trim()) || digits.length < 7 || digits.length > 15)
    e.phone = "Please enter a valid phone number, including country code.";
  if (!v.residence) e.residence = "Please select a residence of interest.";
  return e;
}

export default function PrivateAccess() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [ref, setRef] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Values) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, email: true, phone: true, residence: true });
    const first = Object.keys(errs)[0] as keyof Values | undefined;
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    // Replace with a real endpoint (CRM / Formspree / API route) when going live.
    await new Promise((r) => setTimeout(r, 1400));
    setRef(`HR-27-${String(Math.floor(1000 + Math.random() * 9000))}`);
    setStatus("done");
  };

  // Success choreography
  useIsoLayoutEffect(() => {
    if (status !== "done" || !successRef.current) return;
    const el = successRef.current;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(".sx-rule", { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "expo.inOut", transformOrigin: "left" })
        .fromTo(".sx-line .line-inner", { yPercent: 115 }, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.1 }, 0.3)
        .fromTo(".sx-fade", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: "power3.out" }, 0.8);
    }, el);
    successRef.current.focus({ preventScroll: true });
    return () => ctx.revert();
  }, [status]);

  const fieldProps = (k: "name" | "email" | "phone") => ({
    id: `pa-${k}`,
    name: k,
    value: values[k],
    placeholder: " ",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value),
    onBlur: () => blur(k),
    "aria-invalid": Boolean(touched[k] && errors[k]),
    "aria-describedby": touched[k] && errors[k] ? `pa-${k}-err` : undefined,
    className: "field-input",
  });

  const err = (k: keyof Values) =>
    touched[k] && errors[k] ? (
      <p id={`pa-${k}-err`} role="alert" className="t-meta mt-2 text-accent">
        {errors[k]}
      </p>
    ) : null;

  return (
    <section id="private-access" aria-labelledby="access-title" className="relative overflow-hidden bg-ink text-ivory">
      <div className="absolute inset-0" aria-hidden="true">
        <Image src={IMG.access} alt="" fill sizes="100vw" quality={70} className="object-cover object-right opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,10,0.96)_0%,rgba(11,11,10,0.85)_45%,rgba(11,11,10,0.55)_100%)]" />
      </div>

      <div className="wrap relative grid-12 gap-y-16 py-[clamp(6rem,13vw,12rem)]">
        <div className="col-span-12 md:col-span-5">
          <Meta className="text-stone">
            <span className="text-accent">●</span>&nbsp;&nbsp;Private Access
          </Meta>
          <Lines
            id="access-title"
            className="t-h1 mt-6"
            lines={[
              "Be among",
              <span key="first">
                <span className="serif-i">the</span> first.
              </span>,
            ]}
          />
          <p className="t-lead mt-8 max-w-[26rem] text-ivory/80 text-pretty" data-reveal="fade">
            Register for private access to floor plans, pricing and upcoming viewing appointments.
          </p>
          <dl className="mt-12 grid max-w-[26rem] grid-cols-2 gap-6 border-t border-ivory/15 pt-6" data-reveal="fade" data-delay="0.1">
            <div>
              <dt className="t-meta text-stone">Viewings</dt>
              <dd className="mt-2 font-display text-lg">Spring 2026</dd>
            </div>
            <div>
              <dt className="t-meta text-stone">Sales gallery</dt>
              <dd className="mt-2 font-display text-lg">By appointment</dd>
            </div>
          </dl>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          {status !== "done" ? (
            <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="pa-note" className="relative" data-reveal="fade">
              <Meta className="mb-2 text-stone">Invitation request — No. 018</Meta>

              <div className="space-y-2">
                <div>
                  <label className="field" data-invalid={Boolean(touched.name && errors.name)}>
                    <input type="text" autoComplete="name" {...fieldProps("name")} />
                    <span className="field-label t-meta">Full name</span>
                  </label>
                  {err("name")}
                </div>

                <div>
                  <label className="field" data-invalid={Boolean(touched.email && errors.email)}>
                    <input type="email" inputMode="email" autoComplete="email" {...fieldProps("email")} />
                    <span className="field-label t-meta">Email</span>
                  </label>
                  {err("email")}
                </div>

                <div>
                  <label className="field" data-invalid={Boolean(touched.phone && errors.phone)}>
                    <input type="tel" inputMode="tel" autoComplete="tel" {...fieldProps("phone")} />
                    <span className="field-label t-meta">Phone</span>
                  </label>
                  {err("phone")}
                </div>

                <div>
                  <label className="field" data-invalid={Boolean(touched.residence && errors.residence)}>
                    <select
                      id="pa-residence"
                      name="residence"
                      value={values.residence}
                      onChange={(e) => set("residence", e.target.value)}
                      onBlur={() => blur("residence")}
                      aria-invalid={Boolean(touched.residence && errors.residence)}
                      aria-describedby={touched.residence && errors.residence ? "pa-residence-err" : undefined}
                      className={`field-input pr-8 ${values.residence ? "has-value" : "text-transparent"}`}
                    >
                      <option value="" disabled hidden />
                      {RESIDENCES.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name} — {r.title}
                        </option>
                      ))}
                      <option value="Undecided">Not yet decided</option>
                    </select>
                    <span className="field-label t-meta">Interested residence</span>
                    <svg aria-hidden="true" className="pointer-events-none absolute bottom-5 right-0 text-stone" width="12" height="8" viewBox="0 0 12 8" fill="none">
                      <path d="M1 1.5l5 5 5-5" stroke="currentColor" strokeWidth="1.1" />
                    </svg>
                  </label>
                  {err("residence")}
                </div>
              </div>

              <label className="mt-8 flex cursor-pointer items-start gap-4">
                <input
                  type="checkbox"
                  id="pa-updates"
                  name="updates"
                  checked={values.updates}
                  onChange={(e) => set("updates", e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-ivory/40 transition-colors duration-300 peer-checked:border-ivory peer-checked:bg-ivory peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
                >
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="text-ink transition-opacity">
                    <path d="M1 3.5l2.2 2.2L8 1" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </span>
                <span className="t-body text-[0.9375rem] text-ivory/75">I would like to receive private updates.</span>
              </label>

              <button
                type="submit"
                id="pa-submit"
                disabled={status === "sending"}
                className="btn group mt-10 flex w-full justify-between bg-ivory px-6 py-6 text-ink transition-colors duration-500 hover:bg-bone-2 disabled:cursor-wait"
              >
                {status === "sending" ? (
                  <>
                    <span>Sending request</span>
                    <span className="relative block h-px w-12 overflow-hidden bg-ink/20" aria-hidden="true">
                      <span className="absolute inset-y-0 left-0 w-1/2 animate-[loadbar_1.2s_ease-in-out_infinite] bg-ink" />
                    </span>
                  </>
                ) : (
                  <>
                    <SlideLabel>Request private access</SlideLabel>
                    <Arrow />
                  </>
                )}
              </button>
              <p id="pa-note" className="t-meta mt-5 text-[0.625rem] leading-relaxed text-stone">
                Your details are held in confidence by the Halden private client team and never shared.
              </p>
              <p className="sr-only" aria-live="polite">
                {status === "sending" ? "Sending your request" : ""}
              </p>
            </form>
          ) : (
            <div ref={successRef} tabIndex={-1} className="outline-none" role="status" aria-live="polite">
              <span className="sx-rule block h-px w-full origin-left bg-accent" />
              <Meta className="sx-fade mt-6 text-stone">Request received — Ref. {ref}</Meta>
              <h3 className="t-h2 mt-8">
                <span className="sx-line line-mask">
                  <span className="line-inner">Thank you.</span>
                </span>
              </h3>
              <p className="mt-4 font-serif text-[clamp(1.75rem,3vw,2.75rem)] italic leading-[1.1] text-ivory/85">
                <span className="sx-line line-mask">
                  <span className="line-inner">Our private client team</span>
                </span>
                <span className="sx-line line-mask">
                  <span className="line-inner">will be in touch.</span>
                </span>
              </p>
              <p className="sx-fade t-body mt-10 max-w-[28rem] text-ivory/70">
                {values.name.split(" ")[0]}, a member of our team will contact you within one working day to share the private
                brochure for {values.residence === "Undecided" ? "the collection" : values.residence} and arrange a viewing.
              </p>
              <button
                type="button"
                id="pa-reset"
                onClick={() => {
                  setValues(INITIAL);
                  setTouched({});
                  setErrors({});
                  setStatus("idle");
                }}
                className="sx-fade btn link-u mt-10 text-stone hover:text-ivory"
              >
                Submit another request
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
