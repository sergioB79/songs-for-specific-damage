import familiesRaw from "@/data/families.json";
import c01 from "@/data/chunks/cases-01.json";
import c02 from "@/data/chunks/cases-02.json";
import c03 from "@/data/chunks/cases-03.json";
import c04 from "@/data/chunks/cases-04.json";
import c05 from "@/data/chunks/cases-05.json";
import c06 from "@/data/chunks/cases-06.json";
import c07 from "@/data/chunks/cases-07.json";
import c08 from "@/data/chunks/cases-08.json";
import c09 from "@/data/chunks/cases-09.json";
import c10 from "@/data/chunks/cases-10.json";
import type { Axis, CaseFile, DamageFamily, FamilyPrototype } from "@/types/ssd";
export const cases = [...c01,...c02,...c03,...c04,...c05,...c06,...c07,...c08,...c09,...c10] as CaseFile[];
export const families = familiesRaw as FamilyPrototype[];
export const axes: Axis[] = ["energy","melancholy","aggression","sensuality","absurdity","introspection","cinematicity","escape","sociality"];
export function caseSlug(item: CaseFile){return item.case_id.replace("CASE//","").toLowerCase();}
export function getCaseBySlug(slug:string){return cases.find((item)=>caseSlug(item)===slug);}
export function spotifyId(url:string){return url.split("/playlist/")[1]?.split("?")[0] ?? "";}
export function familySlug(family:DamageFamily){return family.toLowerCase().replaceAll(" ","-");}
export function clamp(n:number,min=0,max=100){return Math.max(min,Math.min(max,n));}
export function distance(profile:Record<Axis,number>,item:CaseFile){return Math.sqrt(axes.reduce((sum,axis)=>sum+Math.pow(profile[axis]-item[axis],2),0));}
export function closestCases(profile:Record<Axis,number>,count=3){return cases.filter((item)=>item.quiz_eligible!=="REVIEW").map((item)=>({item,score:distance(profile,item)})).sort((a,b)=>a.score-b.score).slice(0,count).map(({item})=>item);}
export function closestFamily(profile:Record<Axis,number>){return [...families].map((family)=>({family,score:Math.sqrt(axes.reduce((sum,axis)=>sum+Math.pow(profile[axis]-family[axis],2),0))})).sort((a,b)=>a.score-b.score)[0].family;}
