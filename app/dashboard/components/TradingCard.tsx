import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TradingCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Otomatik İşlem</CardTitle>
        <CardDescription>RSI Stratejisi ile BTC/USDT</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label>Bakiye Limiti ($)</label>
            <Input type="number" placeholder="1000" />
          </div>
          <div>
            <label>Risk Faktörü (1-5)</label>
            <Input type="range" min="1" max="5" />
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Stratejiyi Başlat
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}   