'use client';
import { useEffect, useState } from 'react';
import BacktestCard from '@/components/dashboard/BacktestCard';
import StrategyChart from '@/components/dashboard/Chart';
import { CandleData } from '@/types/backtest';

export default function Dashboard() {
  const [hybridResults, setHybridResults] = useState<CandleData[]>([]);
  const [macdResults, setMacdResults] = useState<CandleData[]>([]);
  const [rsiResults, setRsiResults] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBacktestData = async () => {
      try {
        const hybridRes = await fetch('/api/backtest?strategy=hybrid');
        const macdRes = await fetch('/api/backtest?strategy=macd');
        const rsiRes = await fetch('/api/backtest?strategy=rsi');

        const [hybridData, macdData, rsiData] = await Promise.all([
          hybridRes.json(),
          macdRes.json(),
          rsiRes.json()
        ]);

        setHybridResults(hybridData);
        setMacdResults(macdData);
        setRsiResults(rsiData);
      } catch (error) {
        console.error('Backtest verisi çekilemedi:', error);
      } finally {
        setLoading(false);
      }
    };
    // Backtest verilerini çek
    fetchBacktestData();
  }, []);

  if (loading) return <div className="p-4">Analiz yapılıyor...</div>;

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Trading Strateji Analizi</h1>
      
      {/* Sonuç Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {hybridResults.map((result) => (
          <BacktestCard key={result.strategy} result={result} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {macdResults.map((result) => (
          <BacktestCard key={result.strategy} result={result} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rsiResults.map((result) => (
          <BacktestCard key={result.strategy} result={result} />
        ))}
      </div>

      {/* Grafikler */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Hybrid Stratejisi</h2>
        <StrategyChart data={hybridResults} />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">MACD Stratejisi</h2>
        <StrategyChart data={macdResults} />
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">RSI Stratejisi</h2>
        <StrategyChart data={rsiResults} />
      </div>  
    </div>
  );
}