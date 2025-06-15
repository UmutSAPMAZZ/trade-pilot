import { NextResponse } from 'next/server';
import { runBacktest } from '@/lib/backtest/strategies';
import { fetchHistoricalData } from '@/lib/backtest/fetcher';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const strategy = searchParams.get('strategy') || 'hybrid';

  try {
    const data = await fetchHistoricalData();
    const results = runBacktest(data, strategy as any);
    
    // Basit başarı analizi
    const winRate = calculateWinRate(results);
    const profit = calculateProfit(results);

    return NextResponse.json([{
      strategy,
      winRate,
      profit,
      data: results.slice(-100) // Son 100 veri noktası
    }]);
  } catch (e) {
    return NextResponse.json(
      { error: 'Backtest failed', details: e.message },
      { status: 500 }
    );
  }
}

// Örnek metrik hesaplamalar
function calculateWinRate(data: any[]) {
  const signals = data.filter(d => d.signal !== 'HOLD');
  const correctSignals = signals.filter(d => 
    (d.signal === 'BUY' && d.close > d.open) || 
    (d.signal === 'SELL' && d.close < d.open)
  );
  return (correctSignals.length / signals.length) * 100 || 0;
}

function calculateProfit(data: any[]) {
  let profit = 0;
  data.forEach((d, i) => {
    if (d.signal === 'BUY' && i < data.length - 1) {
      profit += data[i + 1].close - d.close;
    }
  });
  return profit;
}