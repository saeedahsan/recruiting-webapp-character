export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};
