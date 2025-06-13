declare module 'ccxt' {
  interface Balance {
    free: number;
    used: number;
    total: number;
  }

  interface Balances {
    [key: string]: Balance;
  }
}