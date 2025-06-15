'use client';
import { CandleData } from '@/types/backtest';

export default function BacktestCard({ result }: { result: CandleData }) {
  console.log('BacktestCard result:', result);
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold text-lg">{result.strategy.toUpperCase()} Stratejisi</h3>
      <div className="mt-2 space-y-2">
        <p>Başarı Oranı: <span className="font-semibold">{result.winRate}%</span></p>
        <p>Toplam Kâr: 
          <span className={`font-semibold ${result.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {result.profit.toFixed(2)}%
          </span>
        </p>
      </div>
    </div>
  );
}