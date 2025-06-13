import { RSI, MACD, SMA } from 'technicalindicators';

export class ModernAIStrategy {
  async analyze(symbol: string, closes: number[]): Promise<TradingSignal> {
    // 1. Göstergeleri hesapla
    const rsiResults = RSI.calculate({ values: closes, period: 14 });
    const macdResults = MACD.calculate({
      values: closes,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9
    });
    
    const currentRsi = rsiResults[rsiResults.length - 1];
    const currentMacd = macdResults[macdResults.length - 1];

    // 2. AI Karar Mekanizması
    const confidence = this.calculateConfidence(currentRsi, currentMacd.histogram);
    
    if (currentRsi < 30 && currentMacd.histogram > 0) {
      return { action: 'BUY', confidence };
    } else if (currentRsi > 70 && currentMacd.histogram < 0) {
      return { action: 'SELL', confidence };
    }
    
    return { action: 'HOLD', confidence: 0.5 };
  }

  private calculateConfidence(rsi: number, macdHist: number): number {
    // Basit bir confidence hesaplama algoritması
    const rsiConfidence = Math.abs(50 - rsi) / 50; // 0-1 arası
    const macdConfidence = Math.min(Math.abs(macdHist) * 10, 1); 
    return (rsiConfidence * 0.6 + macdConfidence * 0.4);
  }
}