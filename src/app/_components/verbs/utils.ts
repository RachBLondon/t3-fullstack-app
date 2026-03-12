import { PRONOUNS, type Pronoun, type Verb, type VerbsPayload } from "./types";

export function shuffle<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function loadVerbs(): Promise<Verb[]> {
  const res = await fetch("/data/verbs.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load verbs.json: ${res.status}`);
  }

  const data = (await res.json()) as VerbsPayload;
  if (!data?.verbs?.length) {
    throw new Error("verbs.json is missing 'verbs'");
  }

  return data.verbs;
}

export function normalizeAnswer(value: string): string {
  return value.trim().toLocaleLowerCase("it-IT");
}

export function pickRandomIndex(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function pickRandomVerb(verbs: readonly Verb[], avoidInfinitive?: string): Verb {
  if (verbs.length === 0) {
    throw new Error("No verbs available");
  }

  if (verbs.length === 1) {
    return verbs[0]!;
  }

  let chosen = verbs[pickRandomIndex(verbs.length)]!;
  while (avoidInfinitive && chosen.infinitive === avoidInfinitive) {
    chosen = verbs[pickRandomIndex(verbs.length)]!;
  }
  return chosen;
}

export function pickRandomPronoun(): Pronoun {
  return PRONOUNS[pickRandomIndex(PRONOUNS.length)]!;
}

export function buildMeaningChoices(
  verbs: readonly Verb[],
  correctVerb: Verb,
  count = 4,
): string[] {
  const otherMeanings = verbs
    .filter((v) => v.infinitive !== correctVerb.infinitive)
    .map((v) => v.meaning);

  const pickedOthers = shuffle(otherMeanings).slice(0, Math.max(0, count - 1));
  return shuffle([correctVerb.meaning, ...pickedOthers]);
}
