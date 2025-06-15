import { Signal, CandleData } from "@/types/backtest";

export const applyTimeFilters = (data: CandleData[]) => {
  return data.map(candle => {
    const hour = new Date(candle.timestamp?.toString() as string).getUTCHours();

    // Sadece aktif piyasa saatlerinde işlem
    const isTradingHour = hour >= 8 && hour <= 22;
    
    // Haftasonları ve tatilleri filtrele
    const day = new Date(candle.timestamp?.toString() as string).getUTCDay();
    const isWeekday = day >= 1 && day <= 5;

    return {
      ...candle,
      finalSignal: 
        (isTradingHour && isWeekday) ? 
        candle.finalSignal : 'NEUTRAL' as Signal,
    };
  });
};