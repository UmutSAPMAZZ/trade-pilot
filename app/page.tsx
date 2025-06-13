'use client';
import RealTimeChart from '@/components/RealTimeChart';
import ApiKeyManager from '@/app/components/ApiKeyManager';
import TradingCard from '@/app/components/TradingCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 p-6">
      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 w-10 h-10 rounded-lg"></div>
            <h1 className="text-2xl font-bold">TradePilot</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RealTimeChart symbol="BTCUSDT" />
          
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">AI Ticaret Stratejileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TradingCard 
                title="RSI Stratejisi" 
                description="RSI 30 altında al, 70 üstünde sat" 
              />
              <TradingCard 
                title="MACD Stratejisi" 
                description="MACD sinyal çizgisini kestiğinde işlem" 
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <ApiKeyManager />
          
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Portföy Özeti</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Toplam Bakiye:</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>24h Değişim:</span>
                <span className="text-red-500">-0.5%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Son İşlemler</h2>
            <div className="text-slate-400 text-center py-8">
              Henüz işlem bulunmamaktadır
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}