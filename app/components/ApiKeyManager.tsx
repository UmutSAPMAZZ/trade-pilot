'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ApiKeyManager() {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isTestnet, setIsTestnet] = useState(true);

  const handleSave = () => {
    // Anahtarları güvenli şekilde sakla (örneğin localStorage veya şifrelenmiş cookie)
    localStorage.setItem('binanceApiKey', apiKey);
    localStorage.setItem('binanceApiSecret', apiSecret);
    localStorage.setItem('binanceTestnet', String(isTestnet));
    alert('API anahtarları kaydedildi!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Binance API Bağlantısı</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">API Key</label>
            <Input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Binance API Key"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">API Secret</label>
            <Input
              type="password"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Binance API Secret"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="testnet"
              checked={isTestnet}
              onChange={(e) => setIsTestnet(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="testnet">Testnet Kullan</label>
          </div>
          <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
            API Anahtarlarını Kaydet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}