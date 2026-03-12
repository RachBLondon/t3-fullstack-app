type Score = {
  correct: number;
  total: number;
};

export function ScoreBar({
  modeLabel,
  score,
  onReset,
  onBack,
}: {
  modeLabel: string;
  score: Score;
  onReset: () => void;
  onBack: () => void;
}) {
  return (
    <div className="sticky top-0 z-10 w-full border-b border-white/10 bg-[#15162c]/80 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 text-white">
        <div className="flex flex-col">
          <div className="text-sm text-white/70">Mode</div>
          <div className="font-semibold">{modeLabel}</div>
        </div>

        <div className="flex flex-col text-center">
          <div className="text-sm text-white/70">Score</div>
          <div className="font-semibold">
            {score.correct} / {score.total}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            onClick={onReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            onClick={onBack}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
