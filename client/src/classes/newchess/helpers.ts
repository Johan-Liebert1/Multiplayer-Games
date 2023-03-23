export const letters = "abcdefgh";
export const rowColToCellName = (row: number, col: number) =>
    `${letters[col]}${row + 1}`;

