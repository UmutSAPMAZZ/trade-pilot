import ccxt from 'ccxt';

interface BinanceConfig {
  apiKey: string;
  secret: string;
  testnet?: boolean;
}

export class BinanceService {
  private exchange: ccxt.binance;

  constructor(config: BinanceConfig) {
    this.exchange = new ccxt.binance({
      apiKey: config.apiKey,
      secret: config.secret,
      enableRateLimit: true,
      options: {
        defaultType: 'spot',
        test: config.testnet || true,
      },
      ...(config.testnet ? {
        urls: {
          api: {
            public: 'https://testnet.binance.vision/api/v3',
            private: 'https://testnet.binance.vision/api/v3',
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