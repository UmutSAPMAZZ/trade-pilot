import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TradingCard({ title, description }: { 
  title: string; 
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Bakiye Limiti ($)</label>
          <Input type="number" placeholder="1000" />
        </div>
        <div>
          <label className="block text-sm mb-1">Risk Faktörü (1-5)</label>
          <Input type="number" min="1" max="5" defaultValue="3" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-green-600 hover:bg-green-700">
          Stratejiyi Etkinleştir
        </Button>
      </CardFooter>
    </Card>
  );
}