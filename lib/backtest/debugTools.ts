import { CandleData } from "@/types/backtest";

export const analyzeHybridFailure = (results: CandleData[]) => {
interface ConflictLogEntry {
    timestamp: string;
    price: number;
    rsi: number;
    macd: number;
    rsiSignal: 'BUY' | 'SELL' | 'HOLD';
    macdSignal: 'BUY' | 'SELL';
    finalSignal: string;
}

const conflictLog: ConflictLogEntry[] = [];
  let rsiMacdAgreement = 0;
  let totalSignals = 0;

  results.forEach((candle, i) => {
    if (['STRONG_BUY', 'STRONG_SELL'].includes(candle.finalSignal as string)) {
      totalSignals++;
      const rsiSignal = candle.rsi! < 30 ? 'BUY' : candle.rsi! > 70 ? 'SELL' : 'HOLD';
      const macdSignal = candle.macd! > candle.signalLine! ? 'BUY' : 'SELL';
      
      if (rsiSignal === macdSignal) rsiMacdAgreement++;

      if (rsiSignal !== macdSignal) {
        conflictLog.push({
          timestamp: new Date(candle.timestamp).toISOString(),
          price: candle.close,
          rsi: candle.rsi as number,
          macd: candle.macd as number,
          rsiSignal,
          macdSignal,
          finalSignal: candle.finalSignal as string
        });
      }
    }
  });

  console.log('🔍 Çakışma Analizi:');
  console.table(conflictLog.slice(0, 5));
  console.log(`🔍 Toplam Çakışma: ${conflictLog.length}`);
  const agreementPercent = totalSignals === 0 ? 0 : Number(((rsiMacdAgreement / totalSignals) * 100).toFixed(1));
  console.log(`📊 RSI-MACD Uyumu: ${isNaN(agreementPercent) ? 0 : agreementPercent}%`);

//   return {
//     conflictLog,
//     agreementRatio: rsiMacdAgreement / totalSignals
//   };
};