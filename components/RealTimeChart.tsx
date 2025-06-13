'use client';
import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface ChartDataPoint {
  time: string; // Format: YYYY-MM-DD veya YYYY-MM-DD HH:MM:SS
  value: number;
}

export default function RealTimeChart({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Grafik oluşturma
    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      // Zaman formatını düzeltmek için:
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      }
    });

    seriesRef.current = chartRef.current.addLineSeries({
      color: '#3b82f6',
      lineWidth: 2,
    });

    // WebSocket bağlantısı
    wsRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
    
    const data: ChartDataPoint[] = [];

    wsRef.current.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const price = parseFloat(trade.p);
      const tradeDate = new Date(trade.T);
      
      // Düzeltilmiş zaman formatı: YYYY-MM-DD HH:MM:SS
      const year = tradeDate.getFullYear();
      const month = String(tradeDate.getMonth() + 1).padStart(2, '0');
      const day = String(tradeDate.getDate()).padStart(2, '0');
      const hours = String(tradeDate.getHours()).padStart(2, '0');
      const minutes = String(tradeDate.getMinutes()).padStart(2, '0');
      const seconds = String(tradeDate.getSeconds()).padStart(2, '0');
      
      const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      
      const newPoint = {
        time: formattedTime,
        value: price
      };
      
      data.push(newPoint);
      if (data.length > 100) data.shift();
      
      seriesRef.current?.setData(data);
      
      // Grafiği otomatik olarak kaydır
      chartRef.current?.timeScale().scrollToPosition(5, false);
    };

    const resizeObserver = new ResizeObserver(entries => {
      if (chartRef.current && entries[0].contentRect.width) {
        chartRef.current.applyOptions({ width: entries[0].contentRect.width });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      wsRef.current?.close();
      resizeObserver.disconnect();
      chartRef.current?.remove();
    };
  }, [symbol]);

  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4">{symbol} Gerçek Zamanlı Fiyat</h2>
      <div ref={chartContainerRef} className="w-full h-96" />
    </div>
  );
}