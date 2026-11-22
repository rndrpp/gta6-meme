// main.ts — gta6-meme-x-01 entry (node22, standard library only).
//
// The entry is the post on X; this program's only job is to hand the post's address to the grader, so it reads
// POST.json from the repository root and writes the very same bytes to /output/POST.json, where the gate looks.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir: string = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

/** The post's address, read as bytes: whatever POST.json holds is what the gate must read. */
const postBytes: Buffer = readFileSync(join(botDir, 'POST.json'));

let post: unknown;
try {
  post = JSON.parse(postBytes.toString('utf8'));
} catch (err) {
  console.error(`POST.json is not JSON: ${(err as Error).message}`);
  process.exit(1);
}

const url = (post as { url?: unknown } | null)?.url;
// The address as X's Share button gives it; www., mobile. and twitter.com spellings are the same post.
const POST_URL = /^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/[^/]+\/status(?:es)?\/\d+/;
if (typeof url !== 'string' || !POST_URL.test(url)) {
  console.error(`POST.json must hold {"url": "https://x.com/<handle>/status/<id>"}, not ${JSON.stringify(url)}`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, 'POST.json'), postBytes);
