import { CandleData } from '@/types/backtest';
import { SMA, EMA, RSI, MACD, ATR } from 'technicalindicators';

// EMA Hesaplama
export const calculateEMA = (prices: number[], period: number): number[] => {
  return EMA.calculate({ values: prices, period });
};


export const calculateEMAs = (data: CandleData[]) => {
  const closes = data.map(c => c.close);
  
  return data.map((candle, i) => ({
    ...candle,
    ema20: EMA.calculate({ values: closes, period: 20 })[i] || undefined,
    ema50: EMA.calculate({ values: closes, period: 50 })[i] || undefined,
    ema200: EMA.calculate({ values: closes, period: 200 })[i] || undefined
  }));
};

// RSI Hesaplama
export const calculateRSI = (data: CandleData[], fastPeriod = 14, slowPeriod = 28, signalPeriod = 9): CandleData[] => {
  try {
    const closes = data.map(c => {
      if (typeof c.close !== 'number' || isNaN(c.close)) {
        console.warn(`Geçersiz close değeri: ${c.close}`, c);
        return 0; // Fallback değer
      }
      return c.close;
    });

    // Kütüphane hatası durumunda manuel hesaplama
    let rsiValues: number[];
    try {
      rsiValues = RSI.calculate({ values: closes, period: fastPeriod });
    } catch (e) {
      console.error('RSI kütüphane hatası:', e);
      rsiValues = manualRSI(closes, fastPeriod);
    }

    return data.map((candle, i) => ({
      ...candle,
      rsi: i >= fastPeriod ? rsiValues[i - fastPeriod] : undefined // RSI gecikmeli döner
    }));
  } catch (error) {
    console.error('RSI hesaplama hatası:', error);
    return data.map(c => ({ ...c, rsi: undefined }));
  }
};


// MACD Hesaplama
export const calculateMACD = (data: CandleData[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9): CandleData[] => {
  const closes = data.map(c => c.close);
  const macdValues = MACD.calculate({ values: closes, fastPeriod, slowPeriod, signalPeriod, SimpleMAOscillator: false, SimpleMASignal: false });
  return data.map((candle, i) => ({
    ...candle,
    macd: macdValues[i]?.MACD ?? undefined,
    signalLine: macdValues[i]?.signal ?? undefined,
    histogram: macdValues[i]?.histogram ?? undefined
  }));
};

// Acil durum manuel RSI hesabı
const manualRSI = (closes: number[], period: number): number[] => {
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i-1];
    gains.push(diff > 0 ? diff : 0);
    losses.push(diff < 0 ? Math.abs(diff) : 0);
  }

  const avgGain = SMA.calculate({ values: gains.slice(0, period), period });
  const avgLoss = SMA.calculate({ values: losses.slice(0, period), period });

  return closes.map((_, i) => {
    if (i < period) return NaN;
    const rs = avgGain[i] / avgLoss[i];
    return 100 - (100 / (1 + rs));
  });
};

// Volume Ortalama
export const calculateVolumeAverage = (data: CandleData[], period: number): number[] => {
  return SMA.calculate({ values: data.map(c => c.volume as number), period });
};

// ATR Hesaplama (Volatilite Filtresi için)
export const calculateATR = (data: CandleData[], period = 14): number[] => {
  return ATR.calculate({
    high: data.map(c => c.high as number),
    low: data.map(c => c.low as number),
    close: data.map(c => c.close as number),
    period
  });
};

// Tüm teknik göstergeleri hesaplayan fonksiyon
export const calculateIndicators = (data: CandleData[], params: { rsi: {low: number, high: number}, macd: {fast: number, slow: number} }) => {
  const withEMAs = calculateEMAs(data);
  const withRSI = calculateRSI(withEMAs, params.rsi.low || 14);
  const withMACD = calculateMACD(withRSI, params.macd.fast || 12, params.macd.slow || 26);
  const withATR = calculateATR(withMACD);

  return withMACD.map((candle, i) => ({
    ...candle,
    rsi: withRSI[i].rsi,
    macd: withMACD[i].macd,
    signalLine: withMACD[i].signalLine,
    histogram: withMACD[i].histogram,
    atr: withATR[i]
  }));
}