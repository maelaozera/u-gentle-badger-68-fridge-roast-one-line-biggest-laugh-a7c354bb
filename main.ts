// Fridge Roast — One Line, Biggest Laugh
// Entry: one roast line aimed at a smart fridge (200-character limit).
// The program checks the line against the competition rules and then
// writes it verbatim to /output/entry.txt.
//
// Layout of this file:
//   1. Settings — where the entry goes, the character budget, the roast.
//   2. Character counting — code points, so an emoji counts as one.
//   3. Writer — creates the output folder and saves the entry.
//   4. Validation — each rule is its own function, run in order.
//   5. main() — validates first, then writes.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY_FILE = "/output/entry.txt";
const CHAR_BUDGET = 200;
const MIN_LENGTH = 1;

// The roast: three escalating absurdities (firmware, Wi-Fi, subscription)
// landing on the punchline that the "smart" fridge only reports the milk
// after it is already dead. Specific to smart fridges, no grocery-ordering
// or spying-on-you cliche.
const ROAST =
  "My smart fridge needs a software update to make ice, Wi-Fi to stay cold, and a $4.99 subscription to tell me the milk died yesterday.";

// Counts characters the way a reader sees them (code points, so an emoji
// counts as one character rather than two UTF-16 units).
function countChars(text: string): number {
  return [...text].length;
}

// Creates the output directory if needed and writes the entry verbatim —
// no trailing newline is added, so the file holds exactly the entry text.
function saveEntry(text: string, outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, text, "utf8");
}

// Throws with the rule's name attached whenever a condition is false.
// Every check below goes through this one helper so the error message
// always says which rule tripped instead of failing silently.
function requireRule(ruleName: string, holds: boolean, detail: string): void {
  if (!holds) {
    throw new Error(`rule "${ruleName}" failed: ${detail}`);
  }
}

// Rule 1: the entry must fit inside the competition's character budget.
function validateLength(text: string): void {
  const chars = countChars(text);
  requireRule(
    "length",
    chars >= MIN_LENGTH && chars <= CHAR_BUDGET,
    `entry is ${chars} characters, must be ${MIN_LENGTH}-${CHAR_BUDGET}`,
  );
}

// Rule 2: the entry must contain real content, not just whitespace.
function validateNotBlank(text: string): void {
  requireRule("not-blank", text.trim().length > 0, "entry must not be only white space");
}

// Rule 3: the entry must be exactly one line — no embedded newlines.
// A carriage return would also break the single-line format, so check
// for both line-break characters.
function assertSingleLine(text: string): void {
  requireRule(
    "single-line",
    !text.includes("\n") && !text.includes("\r"),
    "entry must be a single line",
  );
}

// Runs every validation rule in order. Keeping the rules separate means a
// future rule (for example, a banned-word check) slots in as one more call.
function validateLine(text: string): void {
  const checks: Array<() => void> = [() => validateLength(text), () => validateNotBlank(text), () => assertSingleLine(text)];
  for (const check of checks) {
    check();
  }
}

function main(): void {
  // Validate first so a bad entry never produces a partial output file.
  validateLine(ROAST);
  saveEntry(ROAST, ENTRY_FILE);
  console.log(`wrote ${countChars(ROAST)} chars to ${ENTRY_FILE}`);
}

main();
