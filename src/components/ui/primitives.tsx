"use client";

import Image from "next/image";
import type { ElementType, ReactNode } from "react";
import { useExperience } from "@/components/providers/ExperienceProvider";

/* -------------------------------------------------------------------------- */
/* Lines — masked line-by-line heading reveal                                  */
/* -------------------------------------------------------------------------- */

type LinesProps = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  delay?: number;
  id?: string;
  /** set false when a parent timeline animates the lines (e.g. hero) */
  auto?: boolean;
  lineClassName?: string;
};

export function Lines({ lines, as: Tag = "h2", className, delay, id, auto = true, lineClassName }: LinesProps) {
  return (
    <Tag id={id} className={className} data-reveal={auto ? "lines" : undefined} data-delay={delay}>
      {lines.map((line, i) => (
        <span key={i} className={`line-mask ${lineClassName ?? ""}`}>
          <span className="line-inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* Words — scroll-scrubbed word illumination                                   */
/* -------------------------------------------------------------------------- */

export type Segment = { text: string; italic?: boolean; accent?: boolean; br?: boolean };

export function Words({
  segments,
  as: Tag = "p",
  className,
  id,
}: {
  segments: Segment[];
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  return (
    <Tag id={id} className={className} data-reveal="words">
      {segments.map((seg, si) => {
        const words = seg.text.split(" ").filter(Boolean);
        return (
          <span key={si} className={seg.italic ? "serif-i" : undefined} style={seg.accent ? { color: "var(--accent)" } : undefined}>
            {words.map((w, wi) => (
              <span key={wi} className="word">
                {w}
                {wi < words.length - 1 || !seg.br ? " " : ""}
              </span>
            ))}
            {seg.br && <br className="hidden md:block" />}
          </span>
        );
      })}
    </Tag>
  );
}

/* -------------------------------------------------------------------------- */
/* Arrow + buttons                                                             */
/* -------------------------------------------------------------------------- */

function ArrowSvg({ dir = "right" }: { dir?: "right" | "down" | "up" }) {
  const rot = dir === "down" ? 90 : dir === "up" ? -90 : 0;
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true" style={{ rotate: `${rot}deg` }}>
      <path d="M0 5h12.5M8.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function Arrow({ dir }: { dir?: "right" | "down" | "up" }) {
  return (
    <span className="btn-arrow" aria-hidden="true">
      <ArrowSvg dir={dir} />
      <ArrowSvg dir={dir} />
    </span>
  );
}

export function SlideLabel({ children }: { children: string }) {
  return (
    <span className="btn-label">
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
  id?: string;
  "aria-label"?: string;
};

/** In-page anchor that routes through the curtain transition. */
export function NavLink({ href, children, className, onNavigate, id, ...rest }: NavLinkProps) {
  const { navigate } = useExperience();
  return (
    <a
      id={id}
      href={href}
      className={className}
      aria-label={rest["aria-label"]}
      onClick={(e) => {
        if (!href.startsWith("#")) return;
        e.preventDefault();
        onNavigate?.();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}

export function ArrowLink({
  href,
  label,
  className = "",
  variant = "plain",
  id,
  onLight,
}: {
  href: string;
  label: string;
  className?: string;
  variant?: "plain" | "outline";
  id?: string;
  onLight?: boolean;
}) {
  return (
    <NavLink
      id={id}
      href={href}
      className={`btn ${variant === "outline" ? "btn-outline" : ""} ${onLight ? "on-light" : ""} ${className}`}
    >
      <SlideLabel>{label}</SlideLabel>
      <Arrow />
    </NavLink>
  );
}

/* -------------------------------------------------------------------------- */
/* Media — image with clip reveal + parallax + hover scale                     */
/* -------------------------------------------------------------------------- */

type MediaProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  reveal?: "up" | "down" | "left" | "right" | "center" | false;
  parallax?: number | false;
  hover?: boolean;
  preload?: boolean;
  delay?: number;
  cursor?: string;
  quality?: 70 | 80;
};

export function Media({
  src,
  alt,
  sizes,
  className = "",
  reveal = "up",
  parallax = 6,
  hover = true,
  preload,
  delay,
  cursor,
  quality = 80,
}: MediaProps) {
  return (
    <div
      className={`media ${hover ? "media-hover" : ""} ${className}`}
      data-reveal={reveal ? "clip" : undefined}
      data-dir={reveal || undefined}
      data-delay={delay}
      data-cursor={cursor ? "view" : undefined}
      data-cursor-label={cursor}
    >
      <div className={`media-inner absolute ${parallax ? "media-parallax" : "inset-0"}`}>
        <div className="absolute inset-0" data-parallax={parallax || undefined}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            quality={quality}
            preload={preload}
            loading={preload ? "eager" : "lazy"}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small metadata pieces                                                       */
/* -------------------------------------------------------------------------- */

export function Meta({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`t-meta ${className}`}>{children}</p>;
}

export function Rule({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" data-reveal="rule" className={`block h-px w-full bg-current opacity-20 ${className}`} />;
}
