import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const sourceDir = join(process.cwd(), "assets-src", "case-art");
const outputDir = join(process.cwd(), "public", "case-art");
const files = [
  "club-exit.avif.b64",
  "pizza-pasta-puttana.avif.b64",
  "grandma-took-my-acid.avif.b64",
  "punching-ghosts.avif.b64",
  "cows-wearing-high-heels.avif.b64",
];

await mkdir(outputDir, { recursive: true });

for (const file of files) {
  const encoded = (await readFile(join(sourceDir, file), "utf8")).trim();
  const target = basename(file, ".b64");
  await writeFile(join(outputDir, target), Buffer.from(encoded, "base64"));
  console.log(`SSD // MATERIALIZED ${target}`);
}
