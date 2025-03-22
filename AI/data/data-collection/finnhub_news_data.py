import finnhub
from dotenv import load_dotenv
import os
import json
from typing import Optional

from news_source import NewsSource

load_dotenv()

finnhub_client = finnhub.Client(os.environ.get('FINNHUB_API_KEY'))

finnhub_client.company_news('AAPL', _from="2024-06-01", to="2024-06-02")

class FinnhubNews(NewsSource):
    def __init__(self):
        super().__init__()

        api_key = os.environ.get("FINNHUB_API_KEY")
        if not api_key:
            raise ValueError("No FINNHUB_API_KEY found in environment variables.")
        
        # Instantiate Finnhub client
        self.finnhub_client = finnhub.Client(api_key=api_key)


    def __load_news(self, symbol: str, start_date: str, end_date: str):
        """
        Return a list of news for a given stock symbol
        """
        super().__load_news()

        news = self.finnhub_client.company_news(symbol, _from=start_date, to=end_date)

        news_data = {item.pop('symbol'): item for item in news}
        print(news_data)
        news_list = []
        for key, value in news.items():
            news_data = {
                'symbol': value['related'],
                'title': value['headline'],
                'published': value['datetime']
            }
            news_list.append(news_data)
        return news_list


    def get_news(self, start_date: str, end_date: str, symbol: Optional[str] = None) -> dict:
        """
        Get news for all data in accepted_stocks.json
        If you pass in a symbol it will only update news for that specific symbol
        """
        # initialize accepted_stocks
        super().__load_stocks()

        if symbol:
            return {symbol: self.__load_news(symbol, start_date, end_date)}
        
        news_data = {}
        for symbol in self.accepted_stocks.keys():
            news_data[symbol] = self.__load_news(symbol, start_date, end_date)
        return news_data


FinnhubNews().get_news(symbol='APPL',start_date='2024-06-01', end_date='2024-06-02')