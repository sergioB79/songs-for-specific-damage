import type { CaseFile } from "@/types/ssd";

export const caseArtByTitle: Record<string, string> = {
  "F#ck This! I Am Out.": "/case-art/club-exit.avif",
  "Pizza, Pasta, Puttana": "/case-art/pizza-pasta-puttana.avif",
  "Grandma Took My Acid": "/case-art/grandma-took-my-acid.avif",
  "Punching Ghosts": "/case-art/punching-ghosts.avif",
  "Cows Wearing High Heels": "/case-art/cows-wearing-high-heels.avif",
};

export function getCaseArt(item: Pick<CaseFile, "title">){
  return caseArtByTitle[item.title] ?? null;
}
