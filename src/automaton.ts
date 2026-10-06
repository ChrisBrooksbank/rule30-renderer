export type Cell = 0 | 1;

export function clampRule(rule: number): number {
  if (!Number.isFinite(rule)) {
    return 30;
  }

  return Math.max(0, Math.min(255, Math.trunc(rule)));
}

export function nextCell(rule: number, left: Cell, center: Cell, right: Cell): Cell {
  const neighborhood = (left << 2) | (center << 1) | right;
  return ((clampRule(rule) >> neighborhood) & 1) as Cell;
}

export function nextRow(rule: number, row: Cell[]): Cell[] {
  const safeRule = clampRule(rule);
  return row.map((center, index) => {
    const left = row[index - 1] ?? 0;
    const right = row[index + 1] ?? 0;
    const neighborhood = (left << 2) | (center << 1) | right;
    return ((safeRule >> neighborhood) & 1) as Cell;
  });
}

export function centeredSeed(width: number): Cell[] {
  const cells = Array<Cell>(Math.max(1, Math.trunc(width))).fill(0);
  cells[Math.floor(cells.length / 2)] = 1;
  return cells;
}

export function randomSeed(width: number): Cell[] {
  return Array.from({ length: Math.max(1, Math.trunc(width)) }, () =>
    Math.random() > 0.5 ? 1 : 0,
  );
}

export function generateRows(rule: number, seed: Cell[], generations: number): Cell[][] {
  const rows: Cell[][] = [seed];

  for (let index = 1; index < generations; index += 1) {
    rows.push(nextRow(rule, rows[index - 1]));
  }

  return rows;
}

