export const getScoreColor = (score: number) => {
  if (score >= 70)
    return "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]";
  if (score >= 50) return "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]";
  return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
};

export const getProgressBarColor = (score: number) => {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
};
