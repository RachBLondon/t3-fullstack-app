"use client";

import { useEffect, useState } from "react";

import { EasyGame } from "~/app/_components/verbs/EasyGame";
import { HardGame } from "~/app/_components/verbs/HardGame";
import { ScoreBar } from "~/app/_components/verbs/ScoreBar";
import { type Verb } from "~/app/_components/verbs/types";
import { loadVerbs } from "~/app/_components/verbs/utils";

type Mode = "home" | "easy" | "hard";

type Score = {
  correct: number;
  total: number;
};

export default function Home() {
  const [mode, setMode] = useState<Mode>("home");
  const [verbs, setVerbs] = useState<Verb[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });

  useEffect(() => {
    let active = true;
    loadVerbs()
      .then((v) => {
        if (!active) return;
        setVerbs(v);
      })
      .catch((e: unknown) => {
        if (!active) return;
        setError(e instanceof Error ? e.message : "Failed to load verbs");
      });

    return () => {
      active = false;
    };
  }, []);

  function resetScore() {
    setScore({ correct: 0, total: 0 });
  }

  function goHome() {
    setMode("home");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {mode !== "home" && (
        <ScoreBar
          modeLabel={mode === "easy" ? "Easy" : "Hard"}
          score={score}
          onReset={resetScore}
          onBack={() => {
            resetScore();
            goHome();
          }}
        />
      )}

      {mode === "home" && (
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-8 px-4 py-16 text-white">
          <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-6xl">
            Italian Irregular Verbs
          </h1>
          <p className="max-w-2xl text-center text-white/70">
            Learn 20 common irregular verbs through quick rounds. No login, no
            backend, your score resets when you refresh.
          </p>

          {error && (
            <div className="w-full rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-rose-100">
              {error}
            </div>
          )}

          <div className="grid w-full gap-4 sm:grid-cols-2">
            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:bg-white/10"
              onClick={() => {
                resetScore();
                setMode("easy");
              }}
              disabled={!verbs}
            >
              <div className="text-2xl font-bold">Easy</div>
              <div className="mt-2 text-white/70">
                Match the six pronouns to the correct conjugations, then answer a
                multiple-choice meaning question.
              </div>
            </button>

            <button
              type="button"
              className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:bg-white/10"
              onClick={() => {
                resetScore();
                setMode("hard");
              }}
              disabled={!verbs}
            >
              <div className="text-2xl font-bold">Hard</div>
              <div className="mt-2 text-white/70">
                Type the correct conjugation given the English meaning and a
                pronoun.
              </div>
            </button>
          </div>

          {!verbs && !error && (
            <div className="text-sm text-white/60">Loading verbs…</div>
          )}
        </div>
      )}

      {mode === "easy" && verbs && (
        <EasyGame verbs={verbs} score={score} setScore={setScore} />
      )}
      {mode === "hard" && verbs && (
        <HardGame verbs={verbs} score={score} setScore={setScore} />
      )}
    </main>
  );
}
