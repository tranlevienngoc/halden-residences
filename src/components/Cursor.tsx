"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Minimal desktop cursor: a small dot that expands into a labelled disc over
 * elements marked `data-cursor="view"` (label from `data-cursor-label`) and a
 * ring over links/buttons. Disabled on touch and reduced motion.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = dot.current;
    if (!fine || reduced || !el) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
    let visible = false;
    let state = "";

    const setState = (next: string, text = "") => {
      if (next === state) return;
      state = next;
      if (label.current) label.current.textContent = text;
      const size = next === "view" ? 96 : next === "link" ? 44 : 8;
      gsap.to(el, {
        width: size,
        height: size,
        backgroundColor: next === "link" ? "rgba(242,238,230,0)" : "rgba(242,238,230,1)",
        borderColor: next === "link" ? "rgba(242,238,230,0.7)" : "rgba(242,238,230,0)",
        duration: 0.5,
        ease: "expo.out",
      });
      gsap.to(label.current, { autoAlpha: next === "view" ? 1 : 0, duration: 0.3 });
    };

    const onMove = (e: PointerEvent) => {
      if (!visible) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
        visible = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const t = e.target as HTMLElement | null;
      const view = t?.closest<HTMLElement>("[data-cursor='view']");
      if (view) return setState("view", view.dataset.cursorLabel || "View");
      if (t?.closest("a, button, select, label, [role='button'], input[type='checkbox']")) return setState("link");
      setState("");
    };
    const onLeave = () => {
      gsap.to(el, { autoAlpha: 0, duration: 0.3 });
      visible = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[95] hidden h-2 w-2 items-center justify-center rounded-full border border-transparent bg-ivory mix-blend-difference [@media(hover:hover)_and_(pointer:fine)]:flex"
      style={{ opacity: 0 }}
    >
      <span ref={label} className="t-meta text-[0.625rem] text-ink opacity-0" />
    </div>
  );
}
