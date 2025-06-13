'use client';
import { useEffect, useState } from 'react';
import { BinanceService } from '@/lib/binanceService';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PortfolioItem {
  asset: string;
  free: number;
  locked: number;
  total: number;
  usdValue: number;
  change24h: number;
}

export default function PortfolioSummary() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalChange, setTotalChange] = useState(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const apiKey = localStorage.getItem('binanceApiKey') || '';
        const apiSecret = localStorage.getItem('binanceApiSecret') || '';
        const testnet = localStorage.getItem('binanceTestnet') === 'true';
        
        if (!apiKey || !apiSecret) return;
        
        const binance = new BinanceService({ apiKey, secret: apiSecret, testnet });
        const balance = await binance.fetchBalance();
        
        // Toplam bakiyeyi hesapla
        let total = 0;
        const portfolioItems: PortfolioItem[] = [];
        
        for (const [asset, info] of Object.entries(balance)) {
          const totalAmount = info.free + info.locked;
          if (totalAmount > 0) {
            // USD değerini hesapla (basitleştirilmiş)
            const usdValue = asset === 'USDT' 
              ? totalAmount 
              : totalAmount * 50000; // Gerçekte piyasa fiyatından hesaplanmalı
            
            portfolioItems.push({
              asset,
              free: info.free,
              locked: info.locked,
              total: totalAmount,
              usdValue,
              change24h: Math.random() * 10 - 5 // Gerçek veri için API'den alınmalı
            });
            
            total += usdValue;
          }
        }
        
        setPortfolio(portfolioItems);
        setTotalBalance(total);
        setTotalChange(portfolioItems.reduce((sum, item) => sum + (item.usdValue * item.change24h / 100), 0));
        setLoading(false);
      } catch (error) {
        console.error('Portföy bilgileri alınamadı:', error);
        setLoading(false);
      }
    };
    
    fetchPortfolio();
    
    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portföy Özeti</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portföy Özeti</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-2xl font-bold">
            ${totalBalance.toFixed(2)}
          </div>
          <div className={`text-sm ${totalChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalChange >= 0 ? '↑' : '↓'} ${Math.abs(totalChange).toFixed(2)} ({(totalChange / totalBalance * 100).toFixed(2)}%)
          </div>
        </div>
        
        <div className="space-y-3">
          {portfolio.map(item => (
            <div key={item.asset} className="flex justify-between items-center">
              <div className="font-medium">{item.asset}</div>
              <div className="text-right">
                <div>${item.usdValue.toFixed(2)}</div>
                <div className={`text-xs ${item.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {item.change24h.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <button className="text-sm text-blue-500 hover:underline">
          Detaylı Görüntüle
        </button>
      </CardFooter>
    </Card>
  );
}