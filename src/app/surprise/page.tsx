"use client";

import { useEffect } from "react";
import { cases, caseSlug } from "@/lib/data";

export default function SurprisePage() {
  useEffect(() => {
    const eligible = cases.filter((item) => item.quiz_eligible !== "REVIEW");
    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    window.location.replace(`${base}/case/${caseSlug(pick)}/?source=surprise`);
  }, []);

  return (
    <main className="quiz-wrap">
      <div className="quiz-card">
        <div className="eyebrow">SSD // RANDOMIZED TREATMENT</div>
        <h1 className="result-title">Consulting questionable judgement…</h1>
        <p className="micro">PLEASE REMAIN EMOTIONALLY AVAILABLE.</p>
      </div>
    </main>
  );
}
