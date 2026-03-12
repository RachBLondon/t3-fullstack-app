import { useEffect, useMemo, useRef, useState } from "react";

import { type Pronoun, type Verb } from "./types";
import { normalizeAnswer, pickRandomPronoun, pickRandomVerb } from "./utils";

type Score = {
  correct: number;
  total: number;
};

type RoundState = {
  verb: Verb;
  pronoun: Pronoun;
};

function buildRound(verbs: readonly Verb[], avoid?: RoundState): RoundState {
  const verb = pickRandomVerb(verbs, avoid?.verb.infinitive);
  const pronoun = pickRandomPronoun();
  return { verb, pronoun };
}

export function HardGame({
  verbs,
  score,
  setScore,
}: {
  verbs: Verb[];
  score: Score;
  setScore: (next: Score) => void;
}) {
  const [round, setRound] = useState<RoundState>(() => buildRound(verbs));
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const correctAnswer = useMemo(
    () => round.verb.conjugations[round.pronoun],
    [round.pronoun, round.verb],
  );

  const isCorrect = useMemo(() => {
    if (!checked) return false;
    return normalizeAnswer(input) === normalizeAnswer(correctAnswer);
  }, [checked, correctAnswer, input]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [round]);

  function handleSubmit() {
    if (checked) return;

    const correct = normalizeAnswer(input) === normalizeAnswer(correctAnswer);
    setScore({
      correct: score.correct + (correct ? 1 : 0),
      total: score.total + 1,
    });
    setChecked(true);
  }

  function handleNext() {
    setRound((prev) => buildRound(verbs, prev));
    setInput("");
    setChecked(false);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 text-white">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Hard mode</h2>
        <p className="mt-2 text-white/70">
          Type the correct conjugation for the given English meaning and pronoun.
        </p>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-white/70">Prompt</div>
          <div className="text-xl font-semibold">
            <span className="text-white/80">{round.verb.meaning}</span>
            <span className="mx-2 text-white/40">·</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-base font-semibold">
              {round.pronoun}
            </span>
          </div>
          <div className="text-sm text-white/60">
            Verb: <span className="font-semibold">{round.verb.infinitive}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!checked) handleSubmit();
              }
            }}
            placeholder="Type the conjugation…"
            className="w-full flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/30"
            disabled={checked}
          />

          {!checked ? (
            <button
              type="button"
              className={
                "rounded-xl px-5 py-3 font-semibold transition " +
                (input.trim().length
                  ? "bg-white/15 hover:bg-white/25"
                  : "bg-white/5 text-white/40")
              }
              disabled={!input.trim().length}
              onClick={handleSubmit}
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              className="rounded-xl bg-white/15 px-5 py-3 font-semibold transition hover:bg-white/25"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>

        {checked && (
          <div className="mt-4">
            <div
              className={
                "font-semibold " + (isCorrect ? "text-emerald-300" : "text-rose-300")
              }
            >
              {isCorrect ? "Correct" : "Incorrect"}
            </div>
            {!isCorrect && (
              <div className="mt-1 text-white/80">
                Correct answer: <span className="font-semibold">{correctAnswer}</span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
