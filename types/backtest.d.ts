export type Signal = 'BUY' | 'SELL' | 'HOLD' | 'STRONG_BUY' | 'STRONG_SELL' | 'NEUTRAL';

export interface MacdResult {
  MACD: number;
  signal: number;
  histogram: number;
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20?: number;
  ema50?: number;
  ema200?: number;
  atr?: number;
  rsi?: number;
  macd?: number;
  signalLine?: number;
  histogram?: number;
  finalSignal?: Signal | string;
  conditions?: {
    isMacdBullish?: boolean;
    isRsiOversold?: boolean;
    isTrendUp?: boolean;
  };
  [key: string]: any; // Dinamik özellikler için
}

export interface BacktestResult {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  finalSignal?: Signal | string;
  [key: string]: any; // Dinamik özellikler için
}