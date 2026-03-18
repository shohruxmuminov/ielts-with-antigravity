export const calculateBandScore = (correctCount: number): string => {
  if (correctCount >= 39) return "9.0";
  if (correctCount >= 37) return "8.5";
  if (correctCount >= 35) return "8.0";
  if (correctCount >= 33) return "7.5";
  if (correctCount >= 30) return "7.0";
  if (correctCount >= 27) return "6.5";
  if (correctCount >= 23) return "6.0";
  if (correctCount >= 19) return "5.5";
  if (correctCount >= 15) return "5.0";
  if (correctCount >= 13) return "4.5";
  if (correctCount >= 10) return "4.0";
  if (correctCount >= 8) return "3.5";
  if (correctCount >= 6) return "3.0";
  if (correctCount >= 4) return "2.5";
  return "0.0";
};
