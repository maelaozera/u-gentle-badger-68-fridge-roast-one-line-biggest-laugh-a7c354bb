// Fridge Roast: One Line, Biggest Laugh
// Entry: a single-line roast of a smart fridge (max 200 characters).
// Writes the roast to /output/entry.txt, as the competition requires.
//
// Structure of this file:
//   1. Constants — the output path, the character budget, and the roast.
//   2. Validation helpers — each rule gets its own small function so a
//      failure names the exact rule that was broken.
//   3. Writer — creates the output directory and writes the entry.
//   4. main() — wires validation and writing together.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MAX_CHARS = 200;
const MIN_CHARS = 1;

// The roast: three escalating absurdities (firmware, Wi-Fi, subscription)
// landing on the punchline that the "smart" fridge only reports the milk
// after it is already dead. Specific to smart fridges, no grocery-ordering
// or spying-on-you cliche.
const ENTRY =
  "My smart fridge needs a software update to make ice, Wi-Fi to stay cold, and a $4.99 subscription to tell me the milk died yesterday.";

// Counts characters the way a reader sees them (code points, so an emoji
// counts as one character rather than two UTF-16 units).
function countChars(text: string): number {
  return [...text].length;
}

// Rule 1: the entry must fit inside the competition's character budget.
function validateLength(text: string): void {
  const chars = countChars(text);
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(`entry is ${chars} characters, must be ${MIN_CHARS}-${MAX_CHARS}`);
  }
}

// Rule 2: the entry must contain real content, not just whitespace.
function validateNotBlank(text: string): void {
  if (text.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
}

// Rule 3: the entry must be exactly one line — no embedded newlines.
// A carriage return would also break the single-line format, so check
// for both line-break characters.
function assertSingleLine(text: string): void {
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

// Runs every validation rule in order. Keeping the rules separate means a
// future rule (for example, a banned-word check) slots in as one more call.
function validateLine(text: string): void {
  validateLength(text);
  validateNotBlank(text);
  assertSingleLine(text);
}

// Creates the output directory if needed and writes the entry verbatim —
// no trailing newline is added, so the file holds exactly the entry text.
function writeEntry(text: string, outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, text, "utf8");
}

function main(): void {
  // Validate first so a bad entry never produces a partial output file.
  validateLine(ENTRY);
  writeEntry(ENTRY, OUTPUT_PATH);
  console.log(`wrote ${countChars(ENTRY)} chars to ${OUTPUT_PATH}`);
}

main();
