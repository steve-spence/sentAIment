import finnhub
from dotenv import load_dotenv
import os
from typing import Optional
from .news_source import NewsSource
import requests
import json
import yfinance as yf
from tqdm import tqdm
import time

class FinnhubNews(NewsSource):
    def __init__(self):
        super().__init__()
        load_dotenv()
        api_key = os.environ.get("FINNHUB_API_KEY")
        if not api_key:
            raise ValueError("No FINNHUB_API_KEY found in environment variables.")
        
        # Instantiate Finnhub client
        self.finnhub_client = finnhub.Client(api_key=api_key)


    def _load_news(self, symbol: str, start_date: str, end_date: str):
        """
        Return a list of news for a given stock symbol
        """
        super()._load_news(symbol)
        news_entries = self.finnhub_client.company_news(symbol, _from=start_date, to=end_date)
        return [{'title': item['headline'], 'published' : item['datetime']} for item in news_entries]


    def get_news(self, start_date: str, end_date: str, symbol: Optional[str] = None) -> dict:
        """
        Get news for all data in accepted_stocks.json
        If you pass in a symbol it will only update news for that specific symbol
        """
        # initialize accepted_stocks
        super()._load_stocks()

        if symbol:
            return {symbol: self._load_news(symbol, start_date, end_date)}
        
        news_data = {}
        for symbol in tqdm(self.accepted_stocks.keys(), desc=f'Getting finnhub company news from {start_date} to {end_date}'):
            news_data[symbol] = self._load_news(symbol, start_date, end_date)
            time.sleep(1) # api limits
        return news_data


#print(FinnhubNews().get_news(symbol='AAPL',start_date='2024-06-01', end_date='2024-06-02'))