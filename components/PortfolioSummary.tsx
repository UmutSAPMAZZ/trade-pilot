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

interface BinanceBalance {
  free: number;
  used: number;
  total: number;
  locked?: number;
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
        
        let total = 0;
        const portfolioItems: PortfolioItem[] = [];
        
        for (const [asset, info] of Object.entries(balance as Record<string, BinanceBalance>)) {
          const totalAmount = (info.free || 0) + (info.locked || 0);
          if (totalAmount > 0) {
            const usdValue = asset === 'USDT' 
              ? totalAmount 
              : totalAmount * 50000; // Gerçekte piyasa fiyatından hesaplanmalı
            
            portfolioItems.push({
              asset,
              free: info.free || 0,
              locked: info.locked || 0,
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
    
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  // ... (kalan kod aynı)
}