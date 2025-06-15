import { CandleData } from "@/types/backtest";

export function mockCandleData(count: number): CandleData[] {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: new Date(Date.now() - (count - i) * 86400000),
    open: 30000 + Math.random() * 5000,
    high: 31000 + Math.random() * 5000,
    low: 29000 + Math.random() * 5000,
    close: 30000 + Math.random() * 5000,
    volume: 1000 + Math.random() * 500
  }));
}