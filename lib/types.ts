// lib/types.ts
// シート確定フローの型定義

export type FlowStep = "confirm" | "card" | "dealer" | "done";

export interface SeatInfo {
  playerNumber: number;
  tableName: string;
  tableColor: string;
  seatNumber: number;
  gameTitle: string;
  eventName: string;
  deadline: string;
}
