import { hybridStrategy, weightedHybridStrategy } from '@/lib/backtest/strategies';
import { CandleData } from '@/types/backtest';
import { calculateEMA, calculateMACD, calculateRSI } from '@/lib/indicators/technicalIndicators';
import { calculateSuccessRate } from '@/lib/backtest/analytics';
import { applyVolatilityFilter } from '../filters/VolatilityFilter';

interface OptimizationResult {
  params: {
    rsiPeriod: number;
    macdFast: number;
    macdSlow: number;
  };
  successRate: number;
}

export const runOptimization = (data: CandleData[]): OptimizationResult[] => {
  const testCases = [
    { rsiPeriod: 10, macdFast: 8, macdSlow: 17 },
    { rsiPeriod: 12, macdFast: 10, macdSlow: 21 }
  ];

  return testCases.map(params => {
    const modifiedData = data.map((c, i) => ({
      ...c,
      ema20: calculateEMA(data.map(x => x.close), 20)[i],
      ema50: calculateEMA(data.map(x => x.close), 50)[i]
    }));

    const results = hybridStrategy(modifiedData);
    return {
      params,
      successRate: calculateSuccessRate(results)
    };
  });
};

const PARAM_GRID = {
  rsi: {
    low: [25, 28, 30, 32],
    high: [68, 70, 72, 75],
    period: [12, 14, 16]
  },
  macd: {
    fast: [8, 10, 12],
    slow: [17, 21, 26],
    signal: [7, 9, 12]
  },
  filters: {
    minVolatility: [0.8, 1.0, 1.2],
    maxVolatility: [1.5, 1.8, 2.0]
  }
};

export const runGridSearch = (data: CandleData[]) => {
  const results = [];
  
  // RSI Parametreleri
  for (const low of PARAM_GRID.rsi.low) {
    for (const high of PARAM_GRID.rsi.high) {
      // MACD Parametreleri
      for (const fast of PARAM_GRID.macd.fast) {
        for (const slow of PARAM_GRID.macd.slow) {
          
          const rsiResults = calculateRSI(data, low, high);
          const macdResults = calculateMACD(data, fast, slow);

          const modifiedData = data.map((c, i) => ({
            ...c,
            rsi: rsiResults[i]?.rsi,
            macd: macdResults[i]?.macd
          }));

          const strategyResults = weightedHybridStrategy(modifiedData);
          const filteredResults = applyVolatilityFilter(modifiedData, strategyResults);
          
          results.push({
            params: { rsi: { low, high }, macd: { fast, slow } },
            successRate: calculateSuccessRate(filteredResults),
            trades: filteredResults.filter(x => x.finalSignal !== 'NEUTRAL').length
          });
        }
      }
    }
  }

  return results.sort((a,b) => b.successRate - a.successRate);
};