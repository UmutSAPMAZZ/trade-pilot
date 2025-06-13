import { NextResponse } from 'next/server';
import ccxt from 'ccxt';

export async function POST(req: Request) {
  const { apiKey, secret } = await req.json();
  
  try {
    // Tip güvenliği için bu şekilde kullanın
    const exchange = new (ccxt as any).binance({
      apiKey,
      secret,
      enableRateLimit: true,
      options: {
        defaultType: 'spot',
        test: true // Testnet için
      },
      urls: {
        api: {
          public: 'https://testnet.binance.vision/api/v3',
          private: 'https://testnet.binance.vision/api/v3'
        }
      }
    });

    const balance = await exchange.fetchBalance();
    
    return NextResponse.json({ 
      success: true,
      balance 
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Binance API Error',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}