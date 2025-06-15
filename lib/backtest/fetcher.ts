import ccxt from 'ccxt';

// 1. Binance İstemcisini Oluşturma
const createBinanceClient = () => {
  return new ccxt.binance({
    enableRateLimit: true,
    options: { defaultType: 'spot' }
  });
};

// 2. Tarihsel Veri Çekme Fonksiyonu
export async function fetchHistoricalData(
  symbol: string = 'BTC/USDT',
  timeframe: string = '1d',
  limit: number = 365
) {
  try {
    const binance = createBinanceClient();
    
    // API'den veri çek
    const ohlcv = await binance.fetchOHLCV(symbol, timeframe, undefined, limit);
    
    // Veriyi işle
    return ohlcv.map(([timestamp, open, high, low, close, volume]) => ({
      timestamp: new Date(timestamp),
      open,
      high,
      low,
      close,
      volume
    }));
    
  } catch (error) {
    console.error('Veri çekme hatası:', error);
    throw new Error('Binance API isteği başarısız oldu');
  }
}