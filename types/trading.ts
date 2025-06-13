export interface TradingSignal {
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  indicators: {
    rsi?: number;
    macd?: number;
    ema?: number;
    // Diğer göstergeler...
  };
}