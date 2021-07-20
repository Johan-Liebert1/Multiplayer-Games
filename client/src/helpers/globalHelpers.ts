export const getStr = (r: number, c: number) => `${r},${c}`;
export const getRowCol = (str: string) => str.split(",").map(Number);
