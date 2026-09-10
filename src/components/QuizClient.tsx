"use client";
import { useEffect,useMemo,useState } from "react";
import Link from "next/link";
import { axes,caseSlug,cases,clamp,closestCases,closestFamily,distance } from "@/lib/data";
import { buildRandomQuiz,neutralProfile,quizQuestionPool } from "@/lib/quiz";
import type { Axis,CaseFile } from "@/types/ssd";

function severityLabel(value:number){if(value<35)return"COSMETIC";if(value<50)return"NOTICEABLE";if(value<68)return"FUNCTIONAL, SOMEHOW";if(value<82)return"STRUCTURALLY CONCERNING";return"MANAGEMENT HAS BEEN INFORMED"}
function caseProfile(item:CaseFile):Record<Axis,number>{return Object.fromEntries(axes.map((axis)=>[axis,item[axis]])) as Record<Axis,number>}

export function QuizClient(){
  const[questions,setQuestions]=useState(()=>quizQuestionPool.slice(0,8));
  const[step,setStep]=useState(0);
  const[profile,setProfile]=useState<Record<Axis,number>>({...neutralProfile});
  const[complete,setComplete]=useState(false);
  const[escalation,setEscalation]=useState<string[]>([]);

  useEffect(()=>{setQuestions(buildRandomQuiz())},[]);

  const results=useMemo(()=>closestCases(profile,3),[profile]);
  const family=useMemo(()=>closestFamily(profile),[profile]);
  const severity=Math.round(axes.reduce((sum,axis)=>sum+Math.abs(profile[axis]-50),0)/axes.length*2);
  const primary=results[0];

  const worseCandidate=useMemo(()=>{
    if(!complete||!primary)return null;
    const used=new Set([primary.case_id,...escalation]);
    const eligible=cases.filter((item)=>item.quiz_eligible!=="REVIEW"&&!used.has(item.case_id)&&item.damage_intensity>primary.damage_intensity);
    if(!eligible.length)return null;
    return eligible.map((item)=>{
      const intensityGain=item.damage_intensity-primary.damage_intensity;
      const familyPenalty=item.primary_damage===primary.primary_damage?0:item.secondary_damage===primary.primary_damage?8:18;
      const score=distance(profile,item)+familyPenalty-intensityGain*1.35;
      return{item,score};
    }).sort((a,b)=>a.score-b.score)[0].item;
  },[complete,primary,profile,escalation]);

  function choose(delta:Partial<Record<Axis,number>>){
    setProfile((prev)=>{const next={...prev};for(const[key,value]of Object.entries(delta)){const axis=key as Axis;next[axis]=clamp(next[axis]+(value??0))}return next});
    if(step===questions.length-1)setComplete(true);else setStep((s)=>s+1);
  }

  function makeItWorse(){
    if(!worseCandidate)return;
    setEscalation((current)=>[...current,primary.case_id]);
    setProfile(caseProfile(worseCandidate));
  }

  function reset(){
    setQuestions(buildRandomQuiz());setStep(0);setProfile({...neutralProfile});setComplete(false);setEscalation([]);
  }

  if(!complete){
    const q=questions[step];
    return <div className="quiz-wrap"><div className="quiz-progress">SSD//DIAGNOSIS — QUESTION {String(step+1).padStart(2,"0")}/{questions.length} // RANDOMIZED FROM {quizQuestionPool.length}</div><div className="quiz-card"><div className="eyebrow">Fine. Let’s find out what’s wrong with you.</div><h1>{q.prompt}</h1><div className="answers">{q.answers.map((answer)=><button className="answer" onClick={()=>choose(answer.delta)} key={answer.label}>{answer.label}</button>)}</div></div><p className="micro">This is not a medical diagnosis. It may, however, be more useful than your Discover Weekly.</p></div>;
  }

  return <div className="quiz-wrap"><div className="quiz-card"><div className="eyebrow">SSD // DAMAGE REPORT // DIAGNOSIS COMPLETE</div><h1 className="result-title">{family.family}</h1><div className="report-row"><b>Damage intensity</b><div>{severity}% — {severityLabel(severity)}<div className="meter"><span style={{width:`${severity}%`}}/></div></div></div><div className="report-row"><b>Recommended treatment</b><div><strong>{primary.title}</strong><p>{primary.ssd_description}</p></div></div><div className="report-row"><b>Symptoms</b><div>{primary.symptoms}</div></div><div className="report-row"><b>Dosage</b><div>{primary.dosage}</div></div><div className="report-row"><b>Prognosis</b><div>{primary.prognosis}</div></div><div className="report-row"><b>Alternative treatments</b><div>{results.slice(1).map((item)=><div key={item.case_id}><Link href={`/case/${caseSlug(item)}`}>{item.title} →</Link></div>)}</div></div><div className="action-row"><a className="button" href={primary.spotify_url} target="_blank" rel="noreferrer">Listen</a><button className="button alt" onClick={makeItWorse} disabled={!worseCandidate}>{worseCandidate?"Make It Worse":"Maximum Damage Reached"}</button><button className="button alt" onClick={reset}>Diagnosis Is Wrong</button></div>{escalation.length>0&&<p className="micro">ESCALATION LEVEL {escalation.length} // TREATMENT RECLASSIFIED // THIS WAS YOUR DECISION.</p>}</div></div>;
}
