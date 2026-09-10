import type { CaseFile } from "@/types/ssd";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const art = (file: string) => `${basePath}/case-art/${file}`;

export const caseArtByTitle: Record<string, string> = {
  "F#ck This! I Am Out.": art("club-exit.jpeg"),
  "Pizza, Pasta, Puttana": art("pizza-pasta-puttana.jpeg"),
  "Grandma Took My Acid": art("grandma-took-my-acid.jpeg"),
  "Punching Ghosts": art("punching-ghosts.jpeg"),
  "Cows Wearing High Heels": art("cows-wearing-high-heels.jpeg"),
  "All In (Poker Face of Steel)": art("all-in-poker-face-of-steel.jpeg"),
  "Slow Dancing with a Ghost": art("slow-dancing-with-a-ghost.jpeg"),
  "The “Trust Me, I Have a Plan” Playlist": art("trust-me-i-have-a-plan.jpeg"),
  "God I Miss You Like I Miss Herpes": art("god-i-miss-you-like-i-miss-herpes.jpeg"),
  "High Heels, Low Morals": art("high-heels-low-morals.jpeg"),
  "404: Peace Not Found": art("404-peace-not-found.jpeg"),
  "Debugging the Universe": art("debugging-the-universe.jpeg"),
  "Crying in the Club Bathroom": art("crying-in-the-club-bathroom.jpeg"),
  "Soft Anchors in the Chaos": art("soft-anchors-in-the-chaos.jpeg"),
};

export function getCaseArt(item: Pick<CaseFile, "title">) {
  return caseArtByTitle[item.title] ?? null;
}
