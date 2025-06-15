import { RSI, MACD } from 'technicalindicators';
import { CandleData, Signal } from '@/types/backtest';
import { calculateATR, calculateEMA, calculateIndicators, calculateMACD, calculateRSI } from '../indicators/technicalIndicators';
import { analyzeHybridFailure } from './debugTools';
import { runGridSearch, runOptimization } from './optimizer';
import { processDataPipeline } from '../dataProcessing/pipeline';
import { validateIndicators } from '../utils/validation';
import { applyVolatilityFilter } from '../filters/VolatilityFilter';
import { applyTimeFilters } from '../filters/timeFilter';
import { calculateSuccessRate } from './analytics';

 

// 1. RSI Stratejisi
export const rsiStrategy = (data: CandleData[], period = 14) => {
  const closes = data.map(c => c.close);
  const rsiResults = RSI.calculate({ values: closes, period });
  
  return data.map((candle, i) => ({
    ...candle,
    rsi: rsiResults[i],
    signal: rsiResults[i] < 28 ? 'BUY' : rsiResults[i] > 72 ? 'SELL' : 'HOLD'
  }));
};

// Güncellenmiş MACD Stratejisi
export const macdStrategy = (data: CandleData[]) => {
  const macdResults = MACD.calculate({
    values: data.map(c => c.close),
    fastPeriod: 10,  // Optimize edilmiş parametreler
    slowPeriod: 21,
    signalPeriod: 7,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });

  return data.map((candle, i) => {
    const macd = macdResults[i] || { MACD: 0, signal: 0, histogram: 0 };
    let signal: Signal = 'HOLD';
    
    // Histogram momentum + Zero-cross filtre
    if (macd.histogram as number > 0 && macd.MACD as number > 0) signal = 'BUY';
    else if (macd.histogram as number < 0 && macd.MACD as number < 0) signal = 'SELL';

    return { ...candle, macd: macd.MACD, signal };
  });
};

// Hibrit Stratejiye Volume ve Trend Filtresi
export const hybridStrategy = (data: CandleData[]) => {
  const rsiResults = rsiStrategy(data, 14); // Daha agresif RSI periyodu
  const macdResults = macdStrategy(data);
  const atrValues = calculateATR(data, 10); // Daha kısa ATR periyodu

  return data.map((candle, i) => {
    // 1. MACD Zero-Cross Filtresi (Daha hassas)
    const isMacdBullish = macdResults[i].macd! > 0 && macdResults[i].histogram! > 0;
    const isMacdBearish = macdResults[i].macd! < 0 && macdResults[i].histogram! < 0;

    // 2. RSI Threshold Ayarlaması
    const isRsiOversold = rsiResults[i].rsi! < 25; // 30 -> 25
    const isRsiOverbought = rsiResults[i].rsi! > 75; // 70 -> 75

    // 3. Trend Onayı (EMA 50 > EMA 200)
    const isTrendUp = candle.close > candle.ema50! && candle.ema50! > candle.ema200!;
    const isTrendDown = candle.close < candle.ema50! && candle.ema50! < candle.ema200!;

    // Yeni Sinyal Mantığı
    const finalSignal = 
      (isMacdBullish && isRsiOversold && isTrendUp) ? 'STRONG_BUY' :
      (isMacdBearish && isRsiOverbought && isTrendDown) ? 'STRONG_SELL' :
      'NEUTRAL';

    return {
      ...candle,
      rsi: rsiResults[i].rsi,
      macd: macdResults[i].macd,
      finalSignal,
      conditions: { // Debug için
        isMacdBullish,
        isRsiOversold,
        isTrendUp
      }
    };
  });
};

// 4. Backtest Çalıştırıcı
export function runBacktest(data: CandleData[], strategy: 'rsi' | 'macd' | 'hybrid') {
  console.log(`Backtest running for strategy: ${strategy}`);
  switch(strategy) {
    case 'rsi': return rsiStrategy(data);
    case 'macd': return macdStrategy(data);
    case 'hybrid': {
      console.log('🔍 Hibrit strateji analizi başlatılıyor...');
      try {
        const processedData = processDataPipeline(data);
        
        if (!validateIndicators(processedData)) {
          // Acil düzeltme moduna geç
          console.warn('Temel göstergeler eksik, basit stratejiye geçiliyor');
          return rsiStrategy(data);
        }
        // Stratejiyi çalıştır
        const results = hybridStrategy(processedData);
      } catch (error) {
        console.error('İşlem hatası:', error);
      }
      const processedData = processDataPipeline(data);
      const optimizationResults = runGridSearch(processedData);
      console.log('🏆 En İyi 5 Parametre:', optimizationResults.slice(0, 5));
      const bestParams = optimizationResults[0].params;
      const finalStrategy = (data: CandleData[]) => {
        const withIndicators = calculateIndicators(data, bestParams);
        const signals = weightedHybridStrategy(withIndicators);
        const filtered = applyVolatilityFilter(withIndicators, signals);
        return applyTimeFilters(filtered);
      };
      analyzeHybridFailure(hybridStrategy(processedData)); // Debug analizi
      const topParams = runOptimization(processedData)[0];
      const forwardTestResults = finalStrategy(processedData);
      console.log('🚀 Forward Test Sonucu:', calculateSuccessRate(forwardTestResults));
      console.log('🏆 En İyi Parametreler:', topParams);
      console.log('🔍 Hibrit strateji analizi tamamlandı.')
      console.log('Veri Örnekleri:', processedData.slice(0, 3));
      console.log('EMA50 Değerleri:', processedData.map(c => c.ema50).filter(Boolean).slice(0, 3));
      console.log('RSI Değerleri:', processedData.map(c => c.rsi).filter(Boolean).slice(0, 3));
      return hybridStrategy(processedData);
    };
    default: throw new Error('Geçersiz strateji');
  }
}

// Calculates the moving average of volume for each candle, using the given period.
// For the first (period-1) candles, returns the average of available volumes so far.
function calculateVolumeAverage(data: CandleData[], period: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - period + 1);
    const slice = data.slice(start, i + 1);
    const avg = slice.reduce((sum, c) => sum + c.volume, 0) / slice.length;
    result.push(avg);
  }
  return result;
}

// function calculateVolumeAverage(data: CandleData[], arg1: number) {
//   throw new Error('Function not implemented.');
// }

export function weightedHybridStrategy(data: CandleData[]) {
  const rsiResults = calculateRSI(data);
  const macdResults = calculateMACD(data);
  const atrValues = calculateATR(data);

  return data.map((candle, i) => {
    const isRsiOverbought = rsiResults[i]?.rsi! > 70;
    const isRsiOversold = rsiResults[i]?.rsi! < 30;
    const isMacdBullish = macdResults[i]?.macd! > macdResults[i]?.signalLine!;
    const isMacdBearish = macdResults[i]?.macd! < macdResults[i]?.signalLine!;
    const isVolatile = atrValues[i] && atrValues[i] > 1.5;

    let finalSignal = 'NEUTRAL';
    if (isRsiOversold && isMacdBullish && isVolatile) {
      finalSignal = 'STRONG_BUY';
    } else if (isRsiOverbought && isMacdBearish && isVolatile) {
      finalSignal = 'STRONG_SELL';
    }

    return {
      ...candle,
      rsi: rsiResults[i]?.rsi,
      macd: macdResults[i]?.macd,
      finalSignal
    };
  });
}
