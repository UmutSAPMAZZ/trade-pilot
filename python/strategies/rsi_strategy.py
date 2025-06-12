import pandas as pd
import talib

def calculate_rsi(prices: list, period=14):
    df = pd.DataFrame(prices, columns=['close'])
    df['rsi'] = talib.RSI(df['close'].values.astype(float), timeperiod=period)
    current_rsi = df['rsi'].iloc[-1]
    
    if current_rsi < 30:
        return 'BUY'
    elif current_rsi > 70:
        return 'SELL'
    return 'HOLD'