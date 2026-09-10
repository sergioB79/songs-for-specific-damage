"use client";

import { useEffect, useState } from "react";
import { caseSlug, cases } from "@/lib/data";

export function ShuffleAgain({ currentCaseId }: { currentCaseId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVisible(params.get("source") === "surprise");
  }, []);

  if (!visible) return null;

  function shuffleAgain() {
    const eligible = cases.filter(
      (item) => item.quiz_eligible !== "REVIEW" && item.case_id !== currentCaseId,
    );
    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    window.location.assign(`${base}/case/${caseSlug(pick)}/?source=surprise`);
  }

  return (
    <section className="section surprise-again">
      <div className="section-head">
        <div>
          <div className="eyebrow">RANDOMIZED TREATMENT // SECOND OPINION NOT REQUESTED</div>
          <h2>Still not convinced?</h2>
        </div>
        <p className="section-copy">The archive contains 124 other ways this could go wrong.</p>
      </div>
      <div className="action-row">
        <button className="button" type="button" onClick={shuffleAgain}>Shuffle Again</button>
      </div>
      <p className="micro">NEW CASE // SAME QUESTIONABLE JUDGEMENT</p>
    </section>
  );
}
