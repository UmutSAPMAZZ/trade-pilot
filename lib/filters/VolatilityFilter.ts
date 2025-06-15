import { CandleData } from "@/types/backtest";

export function applyVolatilityFilter(data: CandleData[], strategyResults: any[]) {
  const filtered = data.filter((candle, i) => {
    const isVolatile = candle.atr && candle.atr > 1.5;
    const isStrongSignal = strategyResults[i]?.finalSignal === 'STRONG_BUY' || strategyResults[i]?.finalSignal === 'STRONG_SELL';
    return isVolatile && isStrongSignal;
  });
  return filtered;
}
