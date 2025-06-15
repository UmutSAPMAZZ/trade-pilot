import { CandleData } from "@/types/backtest";

export const validateIndicators = (data: CandleData[]) => {
  const errors = [];
  
  if (!data.some(c => c.ema50 !== undefined)) {
    errors.push('EMA50 hesaplanamadı');
  }
  
  if (!data.some(c => c.rsi !== undefined)) {
    errors.push('RSI hesaplanamadı');
  }

  if (errors.length > 0) {
    console.error('Hata! Göstergeler eksik:', errors);
    return false;
  }
  
  return true;
};