import Image from "next/image";
import Link from "next/link";
import { caseArtMeta } from "@/data/case-art-meta";
import { getCaseArt } from "@/data/case-art";
import { caseSlug } from "@/lib/data";
import type { CaseFile } from "@/types/ssd";

export function CaseCard({item,compact=false}:{item:CaseFile;compact?:boolean}){
  const art = getCaseArt(item);
  const meta = caseArtMeta[item.title as keyof typeof caseArtMeta];
  const className = `${compact ? "index-card" : "case-card"}${art ? " has-art" : ""}`;

  return <article className={className}>
    {art && <Link href={`/case/${caseSlug(item)}`} className="case-art-crop" aria-label={`Open visual case file: ${item.title}`}>
      <Image src={art} alt={meta?.alt ?? ""} fill sizes={compact ? "(max-width: 760px) 100vw, 33vw" : "(max-width: 760px) 100vw, 50vw"} />
      <span className="evidence-stamp">VISUAL EVIDENCE // {item.case_id}</span>
    </Link>}
    <div className="case-card-copy">
      <div className="case-id">{item.case_id} // {item.status}</div>
      <h3><Link href={`/case/${caseSlug(item)}`}>{item.title}</Link></h3>
      <span className="damage-pill">{item.primary_damage}</span>
      <p>{item.ssd_description}</p>
    </div>
    <Link href={`/case/${caseSlug(item)}`} className="micro">OPEN CASE →</Link>
  </article>
}
