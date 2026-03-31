// lib/types.ts
// シート確定フローの型定義

export type FlowStep = "select" | "confirm" | "card" | "done";
export type InteractionMode = "swipe" | "tap";

export interface SeatInfo {
  playerNumber: number;
  tableName: string;
  tableColor: string;
  seatNumber: number;
  gameTitle: string;
  eventName: string;
  deadline: string;
}
