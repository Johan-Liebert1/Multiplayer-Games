export const getStr = (r: number, c: number) => `${r},${c}`;
export const getRowCol = (str: string) => str.split(",").map(Number);

export const getEmptyMatrix = (size: number) =>
  new Array(size).fill(0).map(() => new Array(size).fill(0));
