"use client";
import { useMemo,useState } from "react";
import { CaseCard } from "@/components/CaseCard";
import { cases } from "@/lib/data";
import type { DamageFamily } from "@/types/ssd";
const familyNames=[...new Set(cases.map((item)=>item.primary_damage))] as DamageFamily[];
export function IndexClient(){const[query,setQuery]=useState("");const[family,setFamily]=useState("ALL DAMAGE");const filtered=useMemo(()=>{const q=query.trim().toLowerCase();return cases.filter((item)=>{const familyMatch=family==="ALL DAMAGE"||item.primary_damage===family;const textMatch=!q||[item.title,item.ssd_description,item.primary_damage,item.secondary_damage,item.symptoms].join(" ").toLowerCase().includes(q);return familyMatch&&textMatch})},[query,family]);return <><div className="index-tools"><input className="search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search symptoms, bad ideas, questionable objects…"/><select className="select" value={family} onChange={(e)=>setFamily(e.target.value)}><option>ALL DAMAGE</option>{familyNames.map((name)=><option key={name}>{name}</option>)}</select></div><p className="micro">{filtered.length} documented cases visible. Classification may deteriorate after midnight.</p><div className="index-list">{filtered.map((item)=><CaseCard item={item} compact key={item.case_id}/>)}</div></>}
