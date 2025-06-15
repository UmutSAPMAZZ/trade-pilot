'use client';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { CandleData } from '@/types/backtest';

Chart.register(...registerables);

export default function StrategyChart({ data }: { data: CandleData[] }) {
  interface ChartDataPoint {
    timestamp: number;
    close: number;
  }

  interface ChartDataset {
    label: string;
    data: number[];
    borderColor: string;
    tension: number;
  }

  interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
  }

  const chartData: ChartData = {
    labels: data[0]?.data.map((d: ChartDataPoint) => new Date(d.timestamp).toLocaleDateString()),
    datasets: data.map((result): ChartDataset => ({
      label: result.strategy,
      data: result.data.map((d: ChartDataPoint) => d.close),
      borderColor: result.strategy === 'rsi' ? '#3B82F6' : '#10B981',
      tension: 0.1
    }))
  };

  return (
    <div className="h-96">
      <Line 
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false
            }
          }
        }}
      />
    </div>
  );
}