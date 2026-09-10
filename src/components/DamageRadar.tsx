"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { caseArtMeta } from "@/data/case-art-meta";
import { getCaseArt } from "@/data/case-art";
import { axes, caseSlug, cases, closestCases, closestFamily, distance } from "@/lib/data";
import { neutralProfile } from "@/lib/quiz";
import type { Axis, CaseFile } from "@/types/ssd";

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
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function direction(index: number) {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / DISPLAY_AXES.length;
  return { x: Math.cos(angle), y: Math.sin(angle) };
}

function ringPoints(level: number) {
  return DISPLAY_AXES.map((_, index) => {
    const dir = direction(index);
    const r = RADIUS * level;
    return `${CENTER + dir.x * r},${CENTER + dir.y * r}`;
  }).join(" ");
}

function polygonPoints(profile: Record<Axis, number>) {
  return DISPLAY_AXES.map((axis, index) => {
    const dir = direction(index);
    const r = RADIUS * (profile[axis] / 100);
    return `${CENTER + dir.x * r},${CENTER + dir.y * r}`;
  }).join(" ");
}

function profileOf(item: CaseFile): Record<Axis, number> {
  return Object.fromEntries(axes.map((axis) => [axis, item[axis]])) as Record<Axis, number>;
}

const ELIGIBLE_CASES = cases.filter((item) => item.quiz_eligible !== "REVIEW");

/*
  This is deliberately an archive-navigation field, not a 2D claim about the
  nine-dimensional data. A deterministic sunflower layout gives every case its
  own reachable patch of territory. The actual 9D profile is shown separately.
*/
const ARCHIVE_FIELD = ELIGIBLE_CASES.map((item, index) => {
  const radius = Math.sqrt((index + .5) / ELIGIBLE_CASES.length) * .94;
  const angle = index * GOLDEN_ANGLE;
  return { item, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
});

function nearestArchiveCases(point: { x: number; y: number }, count = 3) {
  return ARCHIVE_FIELD
    .map((entry) => ({ ...entry, score: Math.hypot(point.x - entry.x, point.y - entry.y) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

export function DamageRadar() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [manualProfile, setManualProfile] = useState<Record<Axis, number>>({ ...neutralProfile });
  const [dragging, setDragging] = useState(false);
  const [manual, setManual] = useState(false);

  const positionalMatches = useMemo(() => nearestArchiveCases(point, 3), [point]);
  const manualMatches = useMemo(() => closestCases(manualProfile, 3), [manualProfile]);
  const matches = manual ? manualMatches : positionalMatches.map((entry) => entry.item);
  const primary = matches[0];
  const primaryEntry = manual ? null : positionalMatches[0] ?? null;
  const profile = manual ? manualProfile : primary ? profileOf(primary) : neutralProfile;
  const family = manual ? closestFamily(profile).family : primary?.primary_damage ?? "COSMIC MALFUNCTION";
  const primaryArt = primary ? getCaseArt(primary) : null;
  const primaryMeta = primary ? caseArtMeta[primary.title as keyof typeof caseArtMeta] : undefined;
  const positionalDistance = positionalMatches[0]?.score ?? 1;
  const matchScore = primary
    ? manual
      ? Math.max(0, Math.round(100 - distance(profile, primary) / 3))
      : Math.max(68, Math.round(100 - positionalDistance * 90))
    : 0;

  function setFromPointer(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    let nx = (((clientX - rect.left) / rect.width) * SIZE - CENTER) / RADIUS;
    let ny = (((clientY - rect.top) / rect.height) * SIZE - CENTER) / RADIUS;
    const length = Math.hypot(nx, ny);
    if (length > 1) {
      nx /= length;
      ny /= length;
    }
    setPoint({ x: nx, y: ny });
    setManual(false);
  }

  function reset() {
    setPoint({ x: 0, y: 0 });
    setManualProfile({ ...neutralProfile });
    setManual(false);
  }

  return <div className="radar-shell">
    <section className="radar-stage">
      <div className="radar-instructions">
        <span className="eyebrow">ARCHIVE FIELD // 125 CASES</span>
        <p><strong>Drag the cursor through the archive.</strong> Every small point is an actual case. The red point is the treatment currently selected.</p>
        <p className="micro">CURSOR = YOU // RED = NEAREST CASE // POSITIONS ARE FOR NAVIGATION, NOT DIAGNOSIS</p>
      </div>

      <div className="radar-board archive-board">
        <svg
          ref={svgRef}
          className="radar-svg archive-field-svg"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="Interactive archive field containing the full playlist archive. Drag the cursor to choose nearby cases."
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
          <circle cx={CENTER} cy={CENTER} r={RADIUS} className="archive-boundary" />
          <circle cx={CENTER} cy={CENTER} r={RADIUS * .67} className="archive-guide" />
          <circle cx={CENTER} cy={CENTER} r={RADIUS * .34} className="archive-guide" />
          <line x1={CENTER - RADIUS} y1={CENTER} x2={CENTER + RADIUS} y2={CENTER} className="archive-crosshair" />
          <line x1={CENTER} y1={CENTER - RADIUS} x2={CENTER} y2={CENTER + RADIUS} className="archive-crosshair" />

          {ARCHIVE_FIELD.map((entry) => {
            const isPrimary = !manual && primary?.case_id === entry.item.case_id;
            const isAlternative = !manual && matches.slice(1).some((item) => item.case_id === entry.item.case_id);
            return <circle
              key={entry.item.case_id}
              cx={CENTER + entry.x * RADIUS}
              cy={CENTER + entry.y * RADIUS}
              r={isPrimary ? 6 : isAlternative ? 4 : 2.5}
              className={isPrimary ? "radar-case-dot is-primary" : isAlternative ? "radar-case-dot is-alt" : "radar-case-dot"}
            ><title>{entry.item.title}</title></circle>;
          })}

          {!manual && primaryEntry && <line
            x1={CENTER + point.x * RADIUS}
            y1={CENTER + point.y * RADIUS}
            x2={CENTER + primaryEntry.x * RADIUS}
            y2={CENTER + primaryEntry.y * RADIUS}
            className="archive-selection-line"
          />}

          {!manual && <>
            <circle cx={CENTER + point.x * RADIUS} cy={CENTER + point.y * RADIUS} r="18" className="radar-dot-halo" />
            <circle cx={CENTER + point.x * RADIUS} cy={CENTER + point.y * RADIUS} r="10" className="radar-dot" />
          </>}
        </svg>
        <div className="radar-status"><span>{manual ? "FINE TUNE ACTIVE // DRAG TO RETURN TO ARCHIVE" : dragging ? "ARCHIVE SCANNING" : "DRAG THROUGH 125 CASES"}</span><button type="button" onClick={reset}>RESET DAMAGE</button></div>
      </div>
    </section>

    <aside className="radar-result" aria-live="polite">
      <div className="eyebrow">CURRENT DAMAGE PROFILE</div>
      <div className="radar-family">{family}</div>
      <div className="radar-match-label">NEAREST CASE // {matchScore}% MATCH</div>

      <div className="profile-radar-card">
        <div className="eyebrow">DAMAGE PROFILE // 9D</div>
        <svg className="profile-radar-svg" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Nine-axis damage profile for the current recommendation">
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
        </svg>
        <div className="micro">THIS SHAPE IS THE ACTUAL NINE-AXIS PROFILE. THE ARCHIVE FIELD IS ONLY FOR NAVIGATION.</div>
      </div>

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
      <div className="section-head"><div><div className="eyebrow">FINE TUNE THE DAMAGE</div><h2>Nine knobs nobody asked for.</h2></div><p className="section-copy">The archive field explores all 125 cases. These knobs switch to exact nine-axis matching when approximation begins to offend you personally.</p></div>
      <div className="radar-sliders">
        {axes.map((axis) => <label key={axis} className="radar-slider"><span>{LABELS[axis]}</span><input type="range" min="0" max="100" value={profile[axis]} onChange={(event) => {
          const base = manual ? manualProfile : profile;
          setManualProfile({ ...base, [axis]: Number(event.target.value) });
          setManual(true);
        }}/><b>{profile[axis]}</b></label>)}
      </div>
    </section>
  </div>;
}
