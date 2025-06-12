import { NextResponse } from 'next/server';
import ccxt from 'ccxt';

export async function POST(req: Request) {
  const { apiKey, secret, symbol } = await req.json();
  
  try {
    const exchange = new ccxt.binance({ apiKey, secret });
    const balance = await exchange.fetchBalance();
    
    return NextResponse.json({ balance });
  } catch (error) {
    return NextResponse.json({ error: 'API Hatası' }, { status: 500 });
  }
}