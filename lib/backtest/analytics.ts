import { BacktestResult, CandleData } from '@/types/backtest';

interface Trade {
  entry: number;
  exit: number | null;
  entrySignal: 'BUY' | 'SELL';
  pnl: number | null;
  duration: number | null;
}

interface PerformanceStats {
  successRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  winLossRatio: number;
  sharpeRatio?: number;
  maxDrawdown: number;
  totalTrades: number;
  profitableTrades: number;
}

// İşlemleri simüle eden yardımcı fonksiyon
const simulateTrades = (results: CandleData[]): Trade[] => {
  const trades: Trade[] = [];
  let currentTrade: Partial<Trade> | null = null;

  results.forEach((candle, i) => {
    // Açık işlem yoksa ve sinyal gelmişse
    if (!currentTrade && ['STRONG_BUY', 'STRONG_SELL'].includes(candle.finalSignal as string)) {
      currentTrade = {
        entry: candle.close,
        entrySignal: candle.finalSignal === 'STRONG_BUY' ? 'BUY' : 'SELL',
        exit: null,
        pnl: null,
        duration: 0
      };
    }

    // Açık işlem varsa
    if (currentTrade) {
      currentTrade.duration!++;

      // Çıkış koşulları (3 gün sonra veya ters sinyal)
      const shouldExit = 
        currentTrade.duration! >= 3 || 
        (currentTrade.entrySignal === 'BUY' && candle.finalSignal === 'STRONG_SELL') ||
        (currentTrade.entrySignal === 'SELL' && candle.finalSignal === 'STRONG_BUY');

      if (shouldExit) {
        const exitPrice = candle.close;
        const pnl = currentTrade.entrySignal === 'BUY' 
          ? (exitPrice - (currentTrade.entry ? currentTrade.entry : 0)) / (currentTrade.entry ? currentTrade.entry : 1) 
          : (currentTrade.entry ? currentTrade.entry : 1 - exitPrice) / (currentTrade.entry ? currentTrade.entry : 1);

        trades.push({
          entry: currentTrade.entry,
          entrySignal: currentTrade.entrySignal,
          exit: exitPrice,
          pnl,
          duration: currentTrade.duration
        } as Trade);

        currentTrade = null;
      }
    }
  });

  return trades;
};

// Ana başarı metriği hesaplama
export const calculateSuccessRate = (results: CandleData[]): number => {
  // console.log('Calculating success rate for results:', results);
  const trades = simulateTrades(results);
  if (trades.length === 0) return 0;

  const profitableTrades = trades.filter(t => t.pnl! > 0).length;
  return parseFloat(((profitableTrades / trades.length) * 100).toFixed(2));
};

// Detaylı performans analizi
export const calculateStats = (results: CandleData[]): PerformanceStats => {
  const trades = simulateTrades(results);
  const profitableTrades = trades.filter(t => t.pnl! > 0);
  const losingTrades = trades.filter(t => t.pnl! <= 0);

  // Win/Loss Hesaplamaları
  const avgWin = profitableTrades.length > 0 
    ? parseFloat((profitableTrades.reduce((sum, t) => sum + t.pnl!, 0) / profitableTrades.length).toFixed(4))
    : 0;
  
  const avgLoss = losingTrades.length > 0
    ? parseFloat((losingTrades.reduce((sum, t) => sum + t.pnl!, 0) / losingTrades.length).toFixed(4))
    : 0;

  // Profit Factor (Gross Profit / Gross Loss)
  const grossProfit = profitableTrades.reduce((sum, t) => sum + t.pnl!, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl!, 0));
  const profitFactor = grossLoss > 0 ? parseFloat((grossProfit / grossLoss).toFixed(2)) : Infinity;

  // Max Drawdown Hesaplama
  let maxDrawdown = 0;
  let peak = trades[0]?.entry || 0;
  trades.forEach(trade => {
    const currentVal = trade.entrySignal === 'BUY' ? trade.exit! : trade.entry;
    if (currentVal > peak) peak = currentVal;
    const drawdown = ((peak - currentVal) / peak) * 100;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });

  return {
    successRate: calculateSuccessRate(results),
    profitFactor,
    avgWin: Number(avgWin),
    avgLoss: Number(avgLoss),
    winLossRatio: losingTrades.length > 0 
      ? parseFloat((profitableTrades.length / losingTrades.length).toFixed(2)) 
      : profitableTrades.length,
    maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
    totalTrades: trades.length,
    profitableTrades: profitableTrades.length
  };
};

export const visualizeResults = (backtestResults: BacktestResult[]) => {
  const signals = backtestResults.filter(x => x.finalSignal !== 'NEUTRAL');
  
  // 1. Zaman Serisi Grafiği
  plotCandlestickChart(
    backtestResults.map(c => c.close),
    signals.filter(s => s.finalSignal === 'STRONG_BUY').map(s => s.timestamp),
    signals.filter(s => s.finalSignal === 'STRONG_SELL').map(s => s.timestamp)
  );

  // 2. Performans Metrikleri
  const stats = {
    winRate: calculateSuccessRate(backtestResults),
    profitFactor: calculateProfitFactor(backtestResults),
    sharpeRatio: calculateSharpeRatio(backtestResults)
  };

  console.table([
    { Metric: 'Win Rate', Value: `${stats.winRate.toFixed(1)}%` },
    { Metric: 'Profit Factor', Value: stats.profitFactor.toFixed(2) },
    { Metric: 'Sharpe Ratio', Value: stats.sharpeRatio.toFixed(2) }
  ]);
};

const plotCandlestickChart = (closes: number[], buySignals: number[], sellSignals: number[]) => {
  // Burada bir grafik kütüphanesi kullanarak mum grafiği çizimi yapılabilir.
  // Örneğin, Chart.js veya D3.js gibi kütüphaneler kullanılabilir.
  console.log('Plotting candlestick chart with closes:', closes);
  console.log('Buy signals at:', buySignals);
  console.log('Sell signals at:', sellSignals);
};

const calculateProfitFactor = (results: BacktestResult[]): number => {
  const trades = simulateTrades(results);
  const profitableTrades = trades.filter(t => t.pnl! > 0);
  const losingTrades = trades.filter(t => t.pnl! <= 0);

  const grossProfit = profitableTrades.reduce((sum, t) => sum + t.pnl!, 0);
  const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl!, 0));

  return grossLoss > 0 ? parseFloat((grossProfit / grossLoss).toFixed(2)) : Infinity;
};

const calculateSharpeRatio = (results: BacktestResult[], riskFreeRate = 0.01): number => {
  const trades = simulateTrades(results);
  if (trades.length === 0) return 0;

  const returns = trades.map(t => t.pnl!);
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / (returns.length - 1));

  return stdDev > 0 ? parseFloat(((meanReturn - riskFreeRate) / stdDev).toFixed(2)) : 0;
};