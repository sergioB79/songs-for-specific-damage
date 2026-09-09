import Link from "next/link";
import { caseSlug } from "@/lib/data";
import type { CaseFile } from "@/types/ssd";
export function CaseCard({item,compact=false}:{item:CaseFile;compact?:boolean}){return <article className={compact?"index-card":"case-card"}><div><div className="case-id">{item.case_id} // {item.status}</div><h3><Link href={`/case/${caseSlug(item)}`}>{item.title}</Link></h3><span className="damage-pill">{item.primary_damage}</span><p>{item.ssd_description}</p></div><Link href={`/case/${caseSlug(item)}`} className="micro">OPEN CASE →</Link></article>}
