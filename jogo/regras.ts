export const META = 2250;

export type Obstaculo = {
  id: number;
  x: number;
  lane: 0 | 1;
  kind: "poca" | "pedra" | "tronco";
};

export type Estrela = {
  id: number;
  x: number;
  lane: 0 | 1;
};

export const OBSTACULOS: Obstaculo[] = [
  // PISTA DO JOGADOR
  { id: 1, x: 400, lane: 0, kind: "poca" },
  { id: 2, x: 900, lane: 0, kind: "pedra" },
  { id: 3, x: 1400, lane: 0, kind: "tronco" },
  { id: 4, x: 1880, lane: 0, kind: "poca" },

  // PISTA DO ADVERSÁRIO
  { id: 5, x: 520, lane: 1, kind: "pedra" },
  { id: 6, x: 1020, lane: 1, kind: "poca" },
  { id: 7, x: 1520, lane: 1, kind: "tronco" },
  { id: 8, x: 1980, lane: 1, kind: "pedra" },
];

export const ESTRELAS: Estrela[] = [
  // PISTA DO JOGADOR
  { id: 1, x: 300, lane: 0 },
  { id: 2, x: 1050, lane: 0 },
  { id: 3, x: 1800, lane: 0 },

  // PISTA DO ADVERSÁRIO
  { id: 4, x: 500, lane: 1 },
  { id: 5, x: 1250, lane: 1 },
  { id: 6, x: 1950, lane: 1 },
];

export function clamp(
  value: number,
  min: number,
  max: number
) {
  return Math.max(
    min,
    Math.min(max, value)
  );
}