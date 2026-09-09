import type { CaseFile } from "@/types/ssd";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const art = (file:string) => `${basePath}/case-art/${file}`;

export const caseArtByTitle: Record<string, string> = {
  "F#ck This! I Am Out.": art("club-exit.avif"),
  "Pizza, Pasta, Puttana": art("pizza-pasta-puttana.avif"),
  "Grandma Took My Acid": art("grandma-took-my-acid.avif"),
  "Punching Ghosts": art("punching-ghosts.avif"),
  "Cows Wearing High Heels": art("cows-wearing-high-heels.avif"),
};

export function getCaseArt(item: Pick<CaseFile, "title">){
  return caseArtByTitle[item.title] ?? null;
}
