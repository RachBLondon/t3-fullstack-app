import { useMemo, useState } from "react";

import { PRONOUNS, type Pronoun, type Verb } from "./types";
import { buildMeaningChoices, pickRandomVerb, shuffle } from "./utils";

type Score = {
  correct: number;
  total: number;
};

type RoundState = {
  verb: Verb;
  conjugationTiles: string[];
  meaningChoices: string[];
};

function buildRound(verbs: readonly Verb[], avoidInfinitive?: string): RoundState {
  const verb = pickRandomVerb(verbs, avoidInfinitive);
  const conjugationTiles = shuffle(PRONOUNS.map((p) => verb.conjugations[p]));
  const meaningChoices = buildMeaningChoices(verbs, verb, 4);
  return { verb, conjugationTiles, meaningChoices };
}

export function EasyGame({
  verbs,
  score,
  setScore,
}: {
  verbs: Verb[];
  score: Score;
  setScore: (next: Score) => void;
}) {
  const [round, setRound] = useState<RoundState>(() => buildRound(verbs));
  const [selectedPronoun, setSelectedPronoun] = useState<Pronoun | null>(null);
  const [pairs, setPairs] = useState<Partial<Record<Pronoun, string>>>({});
  const [meaningGuess, setMeaningGuess] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const allPaired = useMemo(
    () => PRONOUNS.every((p) => Boolean(pairs[p])),
    [pairs],
  );

  const canCheck = allPaired && Boolean(meaningGuess) && !checked;

  const isFullyCorrect = useMemo(() => {
    if (!checked) return false;
    if (meaningGuess !== round.verb.meaning) return false;
    return PRONOUNS.every((p) => pairs[p] === round.verb.conjugations[p]);
  }, [checked, meaningGuess, pairs, round.verb]);

  function resetRound(nextRound: RoundState) {
    setRound(nextRound);
    setSelectedPronoun(null);
    setPairs({});
    setMeaningGuess(null);
    setChecked(false);
  }

  function handleSelectPronoun(pronoun: Pronoun) {
    if (checked) return;
    setSelectedPronoun(pronoun);
  }

  function handleSelectConjugation(tile: string) {
    if (checked) return;
    if (!selectedPronoun) return;

    setPairs((prev) => ({ ...prev, [selectedPronoun]: tile }));
    setSelectedPronoun(null);
  }

  function isTileUsed(tile: string): boolean {
    return PRONOUNS.some((p) => pairs[p] === tile);
  }

  function handleCheck() {
    if (!canCheck) return;

    const correct =
      meaningGuess === round.verb.meaning &&
      PRONOUNS.every((p) => pairs[p] === round.verb.conjugations[p]);

    setScore({
      correct: score.correct + (correct ? 1 : 0),
      total: score.total + 1,
    });
    setChecked(true);
  }

  function handleNext() {
    resetRound(buildRound(verbs, round.verb.infinitive));
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 text-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Easy mode</h2>
        <p className="mt-2 text-white/70">
          Match each pronoun to the correct conjugation and pick the correct
          English meaning. You only score when the whole round is correct.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-semibold">1) Match pronouns</h3>

          <div className="grid grid-cols-2 gap-3">
            {PRONOUNS.map((p) => {
              const isSelected = selectedPronoun === p;
              const current = pairs[p];
              const isCorrect = checked && current === round.verb.conjugations[p];
              const isWrong = checked && Boolean(current) && !isCorrect;

              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSelectPronoun(p)}
                  className={
                    "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition " +
                    (isSelected
                      ? "border-white/60 bg-white/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10") +
                    (isCorrect ? " ring-2 ring-emerald-400/60" : "") +
                    (isWrong ? " ring-2 ring-rose-400/60" : "")
                  }
                  aria-pressed={isSelected}
                >
                  <span className="font-semibold">{p}</span>
                  <span className="text-white/80">{current ?? "—"}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 text-sm text-white/70">
            Tip: click a pronoun, then click a conjugation tile.
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="mb-4 text-lg font-semibold">2) Pick conjugations</h3>

          <div className="grid grid-cols-2 gap-3">
            {round.conjugationTiles.map((tile, idx) => {
              const used = isTileUsed(tile);
              const canClick = !checked && selectedPronoun && !used;

              return (
                <button
                  key={`${tile}-${idx}`}
                  type="button"
                  onClick={() => handleSelectConjugation(tile)}
                  disabled={!canClick}
                  className={
                    "rounded-xl border px-4 py-3 text-center font-semibold transition " +
                    (used
                      ? "border-white/10 bg-white/5 text-white/40"
                      : canClick
                        ? "border-white/10 bg-white/5 hover:bg-white/10"
                        : "border-white/10 bg-white/5")
                  }
                >
                  {tile}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="mb-4 text-lg font-semibold">3) Meaning</h3>

        <div className="mb-3 text-white/80">
          What does <span className="font-semibold">{round.verb.infinitive}</span> mean?
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {round.meaningChoices.map((choice) => {
            const selected = meaningGuess === choice;
            const correct = checked && choice === round.verb.meaning;
            const wrongSelected = checked && selected && !correct;

            return (
              <button
                key={choice}
                type="button"
                onClick={() => {
                  if (checked) return;
                  setMeaningGuess(choice);
                }}
                className={
                  "rounded-xl border px-4 py-3 text-left transition " +
                  (selected
                    ? "border-white/60 bg-white/15"
                    : "border-white/10 bg-white/5 hover:bg-white/10") +
                  (correct ? " ring-2 ring-emerald-400/60" : "") +
                  (wrongSelected ? " ring-2 ring-rose-400/60" : "")
                }
              >
                {choice}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!checked ? (
          <button
            type="button"
            className={
              "rounded-full px-6 py-3 font-semibold transition " +
              (canCheck
                ? "bg-white/15 hover:bg-white/25"
                : "bg-white/5 text-white/40")
            }
            disabled={!canCheck}
            onClick={handleCheck}
          >
            Check round
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full bg-white/15 px-6 py-3 font-semibold transition hover:bg-white/25"
            onClick={handleNext}
          >
            Next round
          </button>
        )}

        {checked && (
          <div
            className={
              "text-sm font-semibold " +
              (isFullyCorrect ? "text-emerald-300" : "text-rose-300")
            }
          >
            {isFullyCorrect
              ? "Correct — you got the whole round!"
              : "Not quite — review the highlights and try the next one."}
          </div>
        )}
      </div>
    </div>
  );
}