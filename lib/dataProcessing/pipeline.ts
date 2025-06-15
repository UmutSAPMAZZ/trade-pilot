import { calculateEMAs } from '@/lib/indicators/technicalIndicators';
import { calculateRSI } from '@/lib/indicators/technicalIndicators';
import { macdStrategy } from '@/lib/backtest/strategies';
import { CandleData } from '@/types/backtest';

export const processDataPipeline = (rawData: CandleData[]) => {
  // 1. Ham veri kontrolü
  if (!rawData || rawData.length < 200) {
    throw new Error('Yetersiz veri! Minimum 200 mum gereklidir');
  }

   // 2. Veri temizleme
  const cleanData = rawData.filter(c => 
    c.close && !isNaN(c.close) && c.high >= c.low
  );

  // 3. Sıralama kontrolü (zaman artan sırada)
  cleanData.sort((a, b) => a.timestamp - b.timestamp);

  // 4. Temel göstergeleri hesapla
  let processedData = calculateEMAs(cleanData);
  processedData = calculateRSI(processedData).map(item => ({
    ...item,
    rsi: item.rsi === null ? undefined : item.rsi,
    ema20: typeof item.ema20 !== 'undefined' ? item.ema20 : undefined,
    ema50: typeof item.ema50 !== 'undefined' ? item.ema50 : undefined,
    ema200: typeof item.ema200 !== 'undefined' ? item.ema200 : undefined,
  }));

  // 5. MACD ekle (önceki adımlar tamamlandığından emin ol)
  processedData = macdStrategy(processedData).map(item => ({
    ...item,
    ema20: typeof item.ema20 !== 'undefined' ? item.ema20 : undefined,
    ema50: typeof item.ema50 !== 'undefined' ? item.ema50 : undefined,
    ema200: typeof item.ema200 !== 'undefined' ? item.ema200 : undefined,
  }));

  return processedData;
};