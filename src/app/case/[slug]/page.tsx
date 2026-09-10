import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShuffleAgain } from "@/components/ShuffleAgain";
import { caseArtMeta } from "@/data/case-art-meta";
import { getCaseArt } from "@/data/case-art";
import { axes,caseSlug,cases,getCaseBySlug,spotifyId } from "@/lib/data";

export function generateStaticParams(){return cases.map((item)=>({slug:caseSlug(item)}))}

export default async function CasePage({params}:{params:Promise<{slug:string}>}){
  const{slug}=await params;
  const item=getCaseBySlug(slug);
  if(!item)notFound();
  const art=getCaseArt(item);
  const meta=caseArtMeta[item.title as keyof typeof caseArtMeta];
  const related=cases.filter((other)=>other.case_id!==item.case_id&&(other.primary_damage===item.primary_damage||other.secondary_damage===item.primary_damage)).slice(0,3);

  return <main className={`case-page${art?" case-page-has-art":""}`}>
    <div className="eyebrow">{item.case_id} — {item.status}</div>
    <div className="case-layout">
      <div className="case-main">
        <h1>{item.title}</h1>
        <p className="case-desc">{item.ssd_description}</p>
        {art&&<figure className={`case-art-full case-art-${meta?.tone??"archive"}`}>
          <div className="case-art-image"><Image src={art} alt={meta?.alt??""} fill priority sizes="(max-width: 900px) 94vw, 62vw" /></div>
          <figcaption><span>VISUAL EVIDENCE // {item.case_id}</span><strong>RELEVANCE: UNCONFIRMED</strong><small>{meta?.tone?.toUpperCase()??"ARCHIVE"} MATERIAL // DO NOT OVER-INTERPRET</small></figcaption>
        </figure>}
        <div className="treatment-label"><span>RECOMMENDED TREATMENT // AUDIO ADMINISTRATION</span><a className="spotify-direct" href={item.spotify_url} target="_blank" rel="noreferrer">OPEN PLAYLIST IN SPOTIFY ↗</a></div>
        <iframe className="spotify-frame" src={`https://open.spotify.com/embed/playlist/${spotifyId(item.spotify_url)}`} allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title={`Spotify playlist: ${item.title}`}/>
      </div>
      <aside className="report">
        <div className="eyebrow">AUDIO PSYCHOLOGY UNIT</div>
        <div className="report-row"><b>Primary damage</b><div>{item.primary_damage}</div></div>
        <div className="report-row"><b>Secondary damage</b><div>{item.secondary_damage}</div></div>
        <div className="report-row"><b>Diagnosis</b><div>{item.diagnosis_label}</div></div>
        <div className="report-row"><b>Symptoms</b><div>{item.symptoms}</div></div>
        <div className="report-row"><b>Dosage</b><div>{item.dosage}</div></div>
        <div className="report-row"><b>Prognosis</b><div>{item.prognosis}</div></div>
        <div className="report-row"><b>Damage intensity</b><div>{item.damage_intensity}%<div className="meter"><span style={{width:`${item.damage_intensity}%`}}/></div></div></div>
        <div className="axis-grid">{axes.map((axis)=><div key={axis}><span>{axis}</span><b>{item[axis]}</b></div>)}</div>
        {art&&<div className="report-stamp">VISUAL EVIDENCE ATTACHED</div>}
      </aside>
    </div>
    <section className="section related"><div className="section-head"><h2>Alternative treatments</h2><Link href="/index" className="micro">RETURN TO INDEX →</Link></div><div className="manifesto-grid">{related.map((other)=><article className="note-card" key={other.case_id}><span className="case-id">{other.case_id}</span><h3>{other.title}</h3><p>{other.ssd_description}</p><Link className="micro" href={`/case/${caseSlug(other)}`}>OPEN CASE →</Link></article>)}</div></section>
    <ShuffleAgain currentCaseId={item.case_id}/>
  </main>
}
