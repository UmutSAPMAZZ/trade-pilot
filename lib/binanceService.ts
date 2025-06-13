import ccxt from 'ccxt';

export class BinanceService {
  private exchange: any; // Tip sorunlarını aşmak için any kullanıyoruz

  constructor(config: {
    apiKey: string;
    secret: string;
    testnet?: boolean;
  }) {
    // Dinamik olarak binance exchange'i oluşturuyoruz
    const ExchangeClass = (ccxt as any)['binance'];
    this.exchange = new ExchangeClass({
      apiKey: config.apiKey,
      secret: config.secret,
      enableRateLimit: true,
      options: {
        defaultType: 'spot',
        ...(config.testnet ? { test: true } : {})
      },
      ...(config.testnet ? {
        urls: {
          api: {
            public: 'https://testnet.binance.vision/api/v3',
            private: 'https://testnet.binance.vision/api/v3'
          }
        }
      } : {})
    });
  }

  async fetchBalance() {
    return this.exchange.fetchBalance();
  }

  async createOrder(symbol: string, type: 'market' | 'limit', side: 'buy' | 'sell', amount: number, price?: number) {
    return this.exchange.createOrder(symbol, type, side, amount, price);
  }

  async fetchOHLCV(symbol: string, timeframe = '1h', since?: number, limit = 100) {
    return this.exchange.fetchOHLCV(symbol, timeframe, since, limit);
  }
}