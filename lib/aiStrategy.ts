import talib from 'talib-binding';
import { BinanceService } from './binanceService';

interface StrategyResult {
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  indicators: {
    rsi?: number;
    macd?: number;
    ema?: number;
  };
}

export class AIStrategy {
  private binance: BinanceService;

  constructor(binanceService: BinanceService) {
    this.binance = binanceService;
  }

  async analyze(symbol: string, timeframe = '1h'): Promise<StrategyResult> {
    // 1. Piyasa verilerini al
    const ohlcv = await this.binance.fetchOHLCV(symbol, timeframe);
    
    // 2. Teknik göstergeleri hesapla
    const closes = ohlcv.map(candle => candle[4]); // Kapanış fiyatları
    
    // RSI hesapla
    const rsi = talib.RSI(closes, 14);
    const currentRsi = rsi[rsi.length - 1];
    
    // MACD hesapla
    const macdResult = talib.MACD(closes, 12, 26, 9);
    const macd = macdResult.macdHistogram[macdResult.macdHistogram.length - 1];
    
    // 3. Karar verme mantığı
    if (currentRsi < 30 && macd > 0) {
      return {
        action: 'BUY',
        confidence: 0.85,
        indicators: { rsi: currentRsi, macd }
      };
    } else if (currentRsi > 70 && macd < 0) {
      return {
        action: 'SELL',
        confidence: 0.8,
        indicators: { rsi: currentRsi, macd }
      };
    }
    
    return {
      action: 'HOLD',
      confidence: 0.65,
      indicators: { rsi: currentRsi, macd }
    };
  }

  async executeTrade(symbol: string, amount: number, action: 'BUY' | 'SELL') {
    return this.binance.createOrder(symbol, 'market', action, amount);
  }
}