import 'ccxt';

declare module 'ccxt' {
  interface Exchange {
    // Genel exchange metodları için tip tanımları
    fetchBalance(): Promise<any>;
    createOrder(
      symbol: string,
      type: string,
      side: string,
      amount: number,
      price?: number
    ): Promise<any>;
    fetchOHLCV(
      symbol: string,
      timeframe?: string,
      since?: number,
      limit?: number
    ): Promise<any[]>;
  }
}