import type { CaseFile } from "@/types/ssd";

export const caseArtByTitle: Record<string, string> = {
  "F#ck This! I Am Out.": "/case-art/club-exit.webp",
  "Pizza, Pasta, Puttana": "/case-art/pizza-pasta-puttana.webp",
  "Grandma Took My Acid": "/case-art/grandma-took-my-acid.webp",
  "Punching Ghosts": "/case-art/punching-ghosts.webp",
  "Cows Wearing High Heels": "/case-art/cows-wearing-high-heels.webp",
};

export function getCaseArt(item: Pick<CaseFile, "title">){
  return caseArtByTitle[item.title] ?? null;
}
