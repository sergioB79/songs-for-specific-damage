export const dynamic="force-dynamic";
import { redirect } from "next/navigation";
import { cases,caseSlug } from "@/lib/data";
export default function SurprisePage(){const eligible=cases.filter((item)=>item.quiz_eligible!=="REVIEW");const pick=eligible[Math.floor(Math.random()*eligible.length)];redirect(`/case/${caseSlug(pick)}?source=surprise`)}
