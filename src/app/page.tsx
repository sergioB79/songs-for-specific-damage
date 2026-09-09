import Image from "next/image";
import Link from "next/link";
import { CaseCard } from "@/components/CaseCard";
import { caseArtMeta } from "@/data/case-art-meta";
import { getCaseArt } from "@/data/case-art";
import { caseSlug, cases } from "@/lib/data";

const featuredTitles=["Soft Anchors in the Chaos","404: Peace Not Found","Naked Wearing Gucci","Debugging the Universe","Cardio Is Murder","Drive to the End of the World","Forex Scalping Mode","Cows Wearing High Heels","Grandma Took My Acid","Crying in the Club Bathroom"];
const featured=featuredTitles.map((title)=>cases.find((item)=>item.title===title)).filter(Boolean) as typeof cases;
const cow=cases.find((item)=>item.title==="Cows Wearing High Heels")!;
const grandma=cases.find((item)=>item.title==="Grandma Took My Acid")!;
const club=cases.find((item)=>item.title==="F#ck This! I Am Out.")!;
const evidenceTitles=["Grandma Took My Acid","Punching Ghosts","Pizza, Pasta, Puttana","F#ck This! I Am Out."];
const evidence=evidenceTitles.map((title)=>cases.find((item)=>item.title===title)).filter(Boolean) as typeof cases;

function artAlt(title:string){return caseArtMeta[title as keyof typeof caseArtMeta]?.alt ?? ""}

export default function HomePage(){return <main>
  <section className="hero hero-v2">
    <div className="hero-copy">
      <div className="eyebrow">SSD//00125 &nbsp; AUDIO PSYCHOLOGY UNIT &nbsp; DAMAGE INDEX: UNSTABLE</div>
      <h1>Songs for<br/>Specific Damage</h1>
      <p className="descriptor">An Index of Bad Ideas &amp; Good Music</p>
      <p className="pitch">Some moods are too specific for genres. Music for whatever is specifically wrong with you today.</p>
      <div className="action-row"><Link className="button" href="/diagnose">Diagnose My Damage</Link><Link className="button alt" href="/index">Enter the Index</Link><Link className="button alt" href="/surprise">Surprise Me</Link></div>
      <p className="micro hero-warning">UNLICENSED EMOTIONAL DIAGNOSTICS // RESULTS MAY VARY AFTER MIDNIGHT</p>
    </div>

    <div className="hero-collage" aria-label="Recovered visual evidence from the damage archive">
      <Link href={`/case/${caseSlug(cow)}`} className="hero-evidence hero-evidence-main">
        <Image src={getCaseArt(cow)!} alt={artAlt(cow.title)} fill priority sizes="(max-width: 800px) 92vw, 43vw" />
        <span className="evidence-stamp">FIG. 01 // {cow.case_id}</span>
      </Link>
      <Link href={`/case/${caseSlug(grandma)}`} className="hero-evidence hero-evidence-small">
        <Image src={getCaseArt(grandma)!} alt={artAlt(grandma.title)} fill sizes="(max-width: 800px) 42vw, 17vw" />
        <span className="evidence-stamp">REALITY INTEGRITY: LOW</span>
      </Link>
      <Link href={`/case/${caseSlug(club)}`} className="hero-evidence hero-evidence-strip">
        <Image src={getCaseArt(club)!} alt={artAlt(club.title)} fill sizes="(max-width: 800px) 52vw, 21vw" />
        <span className="evidence-stamp">EXIT STRATEGY DETECTED</span>
      </Link>
      <div className="hero-arrow" aria-hidden="true">← THIS WAS APPROVED</div>
      <p className="caption hero-caption">FIG. 01 — Subject appears confident. Musical preference unknown.</p>
    </div>
  </section>

  <section className="section evidence-section">
    <div className="section-head"><div><div className="eyebrow">CASE ART // BATCH 001 // RECOVERED MATERIAL</div><h2>We found some evidence.</h2></div><p className="section-copy">Its relevance remains disputed. The music is not.</p></div>
    <div className="evidence-wall">
      {evidence.map((item,index)=>{const art=getCaseArt(item);return art?<Link href={`/case/${caseSlug(item)}`} className={`evidence-card evidence-card-${index+1}`} key={item.case_id}>
        <div className="evidence-image"><Image src={art} alt={artAlt(item.title)} fill sizes="(max-width: 760px) 92vw, 46vw" /></div>
        <div className="evidence-label"><span>{item.case_id} // VISUAL EVIDENCE</span><strong>{item.title}</strong><small>{item.primary_damage}</small></div>
      </Link>:null})}
      <div className="archive-note">NO GENRES WERE CONSULTED<br/>DURING CLASSIFICATION.</div>
    </div>
  </section>

  <section className="section"><div className="section-head"><h2>The operating principle</h2><p className="section-copy">Spotify asks what music you like. We ask what went wrong. The content may be absurd. The navigation may not.</p></div><div className="manifesto-grid"><article className="note-card"><strong>01 — Diagnose</strong><p>Answer eight questions that have no business being part of a music recommendation system.</p><span className="micro">UNLICENSED EMOTIONAL DIAGNOSTICS</span></article><article className="note-card"><strong>02 — Classify</strong><p>We map your current malfunction across nine emotional axes. No genres consulted.</p><span className="micro">CLASSIFICATION DISPUTED BY MANAGEMENT</span></article><article className="note-card"><strong>03 — Treat</strong><p>Receive one recommended playlist and two alternative treatments. MAKE IT WORSE remains available.</p><span className="micro">LISTENING ADVISED</span></article></div></section>

  <section className="section"><div className="section-head"><div><div className="eyebrow">SELECTED FILES / NOT A BEST-OF</div><h2>Cases currently on the desk</h2></div><Link className="button alt" href="/index">View all 125</Link></div><div className="case-grid">{featured.map((item)=><CaseCard key={item.case_id} item={item}/>)}</div></section>

  <section className="section closing-damage"><div className="section-head"><h2>Genres describe music.<br/>Damage describes why you need it.</h2><p className="section-copy">125 documented cases. Eight damage families. One suspiciously committed archive.</p></div><div className="action-row"><Link className="button" href="/diagnose">Start diagnosis</Link><Link className="button alt" href="/surprise">I refuse to think</Link></div><div className="bottom-warning">YOU HAVE REACHED THE BOTTOM. THIS HAS SOLVED NOTHING.</div></section>
</main>}
