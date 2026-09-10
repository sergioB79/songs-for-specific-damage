import { DamageRadar } from "@/components/DamageRadar";

export default function RadarPage(){
  return <main className="radar-page">
    <header className="radar-page-head">
      <div className="eyebrow">SSD// POSITIONAL DIAGNOSTICS // NO GENRES CONSULTED</div>
      <h1>Move the Damage</h1>
      <p className="case-desc">Drag one point through nine kinds of trouble. The nearest playlist changes as your damage moves.</p>
    </header>
    <DamageRadar />
  </main>;
}
