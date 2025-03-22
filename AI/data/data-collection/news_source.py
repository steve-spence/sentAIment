import json
from typing import Optional
from abc import ABC, abstractmethod

class NewsSource:
    """
    Abstract class for fetching news for a given stock symbol
    """
    def __init__(self):
        self.accepted_stocks = {}

    def __load_stocks(self) -> None:
        """
        Load the accepted_stocks.json file
        """
        with open ('../json/accepted_stocks.json') as f:
            self.accepted_stocks = json.load(f)

        # make key the symbol
        self.accepted_stocks = {item.pop('symbol'): item for item in self.accepted_stocks}
    
    def __load_news(self, symbol: str):
        """
        Return a list of news for a given stock symbol
        """
        # make sure we accept the symbol
        if not self.accepted_stocks[symbol]:
            raise Exception("Stock symbol not found in accepted_stocks.json")
        
    @abstractmethod
    def get_news(self, *args, **kwargs) -> dict:
        """
        Subclasses should implement their logic to fetch news (possibly using a shared approach).
        Return format: {symbol: [news_items]} 
        """
        pass