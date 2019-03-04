
export interface ITurnOrder {
  reset(): void;
  isGameCompleted(): boolean;
  addScore(value: number, playerName?: string): void;
}
