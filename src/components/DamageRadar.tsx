"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { caseArtMeta } from "@/data/case-art-meta";
import { getCaseArt } from "@/data/case-art";
import { axes, caseSlug, clamp, closestCases, closestFamily, distance } from "@/lib/data";
import { neutralProfile } from "@/lib/quiz";
import type { Axis } from "@/types/ssd";

const DISPLAY_AXES: Axis[] = [
  "melancholy",
  "introspection",
  "cinematicity",
  "aggression",
  "energy",
  "sociality",
  "sensuality",
  "absurdity",
  "escape",
];

const LABELS: Record<Axis, string> = {
  energy: "ENERGY",
  melancholy: "MELANCHOLY",
  aggression: "AGGRESSION",
  sensuality: "SENSUALITY",
  absurdity: "ABSURDITY",
  introspection: "INTROSPECTION",
  cinematicity: "CINEMATICITY",
  escape: "ESCAPE",
  sociality: "SOCIALITY",
};

const SIZE = 600;
const CENTER = SIZE / 2;
const RADIUS = 205;
const LABEL_RADIUS = 258;

function direction(index: number) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / DISPLAY_AXES.length;
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

function profileFromPoint(x: number, y: number): Record<Axis, number> {
  const next = { ...neutralProfile };
  DISPLAY_AXES.forEach((axis, index) => {
    const dir = direction(index);
    const projection = x * dir.x + y * dir.y;
    next[axis] = Math.round(clamp(50 + projection * 50));
  });
  return next;
}

function polygonPoints(profile: Record<Axis, number>, scale = 1) {
  return DISPLAY_AXES.map((axis, index) => {
    const dir = direction(index);
    const r = RADIUS * (profile[axis] / 100) * scale;
    return `${CENTER + dir.x * r},${CENTER + dir.y * r}`;
  }).join(" ");
}

function ringPoints(level: number) {
  return DISPLAY_AXES.map((_, index) => {
    const dir = direction(index);
    const r = RADIUS * level;
    return `${CENTER + dir.x * r},${CENTER + dir.y * r}`;
  }).join(" ");
}

export function DamageRadar() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [profile, setProfile] = useState<Record<Axis, number>>({ ...neutralProfile });
  const [dragging, setDragging] = useState(false);
  const [manual, setManual] = useState(false);

  const matches = useMemo(() => closestCases(profile, 3), [profile]);
  const family = useMemo(() => closestFamily(profile), [profile]);
  const primary = matches[0];
  const primaryArt = primary ? getCaseArt(primary) : null;
  const primaryMeta = primary ? caseArtMeta[primary.title as keyof typeof caseArtMeta] : undefined;
  const matchScore = primary ? Math.max(0, Math.round(100 - distance(profile, primary) / 3)) : 0;

  function setFromPointer(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    let x = ((clientX - rect.left) / rect.width) * SIZE;
    let y = ((clientY - rect.top) / rect.height) * SIZE;
    let nx = (x - CENTER) / RADIUS;
    let ny = (y - CENTER) / RADIUS;
    const length = Math.hypot(nx, ny);
    if (length > 1) {
      nx /= length;
      ny /= length;
      x = CENTER + nx * RADIUS;
      y = CENTER + ny * RADIUS;
    }
    setPoint({ x: nx, y: ny });
    setProfile(profileFromPoint(nx, ny));
    setManual(false);
  }

  function reset() {
    setPoint({ x: 0, y: 0 });
    setProfile({ ...neutralProfile });
    setManual(false);
  }

  return <div className="radar-shell">
    <section className="radar-stage">
      <div className="radar-instructions">
        <span className="eyebrow">POSITIONAL DIAGNOSTICS // EXPERIMENTAL</span>
        <p><strong>Drag the dot.</strong> The archive will attempt to interpret the consequences.</p>
        <p className="micro">PLACE YOUR DAMAGE APPROXIMATELY. PRECISION HAS NOT HELPED ANYONE SO FAR.</p>
      </div>

      <div className="radar-board">
        <svg
          ref={svgRef}
          className="radar-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="Interactive nine-axis damage radar. Drag the central point to change the recommendation."
          onPointerDown={(event) => {
            setDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
            setFromPointer(event.clientX, event.clientY);
          }}
          onPointerMove={(event) => dragging && setFromPointer(event.clientX, event.clientY)}
          onPointerUp={(event) => {
            setDragging(false);
            if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
          }}
          onPointerCancel={() => setDragging(false)}
        >
          {[1, .75, .5, .25].map((level) => <polygon key={level} points={ringPoints(level)} className="radar-ring" />)}
          {DISPLAY_AXES.map((axis, index) => {
            const dir = direction(index);
            const endX = CENTER + dir.x * RADIUS;
            const endY = CENTER + dir.y * RADIUS;
            const labelX = CENTER + dir.x * LABEL_RADIUS;
            const labelY = CENTER + dir.y * LABEL_RADIUS;
            const anchor = dir.x > .28 ? "start" : dir.x < -.28 ? "end" : "middle";
            return <g key={axis}>
              <line x1={CENTER} y1={CENTER} x2={endX} y2={endY} className="radar-axis-line" />
              <text x={labelX} y={labelY} textAnchor={anchor} dominantBaseline="middle" className="radar-label">{LABELS[axis]}</text>
            </g>;
          })}
          <polygon points={polygonPoints(profile)} className="radar-profile" />
          <circle cx={CENTER + point.x * RADIUS} cy={CENTER + point.y * RADIUS} r="18" className="radar-dot-halo" />
          <circle cx={CENTER + point.x * RADIUS} cy={CENTER + point.y * RADIUS} r="10" className="radar-dot" />
        </svg>
        <div className="radar-status"><span>{manual ? "FINE TUNE ACTIVE" : dragging ? "DAMAGE MOVING" : "DRAG TO RECLASSIFY"}</span><button type="button" onClick={reset}>RESET DAMAGE</button></div>
      </div>
    </section>

    <aside className="radar-result" aria-live="polite">
      <div className="eyebrow">CURRENT DAMAGE PROFILE</div>
      <div className="radar-family">{family.family}</div>
      <div className="radar-match-label">NEAREST CASE // {matchScore}% MATCH</div>
      {primary && <article className="radar-primary">
        {primaryArt && <div className="radar-primary-art"><Image src={primaryArt} alt={primaryMeta?.alt ?? ""} fill sizes="(max-width: 900px) 92vw, 34vw" /></div>}
        <div className="case-id">{primary.case_id} // RECOMMENDED TREATMENT</div>
        <h2>{primary.title}</h2>
        <p>{primary.ssd_description}</p>
        <div className="action-row"><Link className="button" href={`/case/${caseSlug(primary)}`}>Administer Treatment</Link></div>
      </article>}

      <div className="radar-alternatives">
        <div className="eyebrow">ALTERNATIVE TREATMENTS</div>
        {matches.slice(1).map((item) => <Link key={item.case_id} href={`/case/${caseSlug(item)}`} className="radar-alt-case"><span>{item.case_id}</span><strong>{item.title}</strong></Link>)}
      </div>
    </aside>

    <section className="radar-finetune">
      <div className="section-head"><div><div className="eyebrow">FINE TUNE THE DAMAGE</div><h2>Nine knobs nobody asked for.</h2></div><p className="section-copy">The dot is fast. These are for people who distrust approximate emotional geometry.</p></div>
      <div className="radar-sliders">
        {axes.map((axis) => <label key={axis} className="radar-slider"><span>{LABELS[axis]}</span><input type="range" min="0" max="100" value={profile[axis]} onChange={(event) => {setProfile((current) => ({ ...current, [axis]: Number(event.target.value) }));setManual(true);}}/><b>{profile[axis]}</b></label>)}
      </div>
    </section>
  </div>;
}
