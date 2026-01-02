export const formatSeconds = (s: number) => {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const calculateAverage = (history: Array<{ percentage: number }>) => {
  if (history.length === 0) return 0;
  const sum = history.reduce((acc, curr) => acc + curr.percentage, 0);
  return Math.round(sum / history.length);
};
