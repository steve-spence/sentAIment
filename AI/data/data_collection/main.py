from sources import yahoo_news_data
from sources import finnhub_news_data
import stock_file_manager
from tqdm import tqdm

def load_news(start_date: str, end_date: str):
    # initialize news sources
    yahoo = yahoo_news_data.YahooNews()
    finnhub = finnhub_news_data.FinnhubNews()

    # initialize file manager for news data
    manager = stock_file_manager.StockNewsManager()

    # Get news from sources
    yahoo_news = yahoo.get_news('AAPL')
    finnhub_news = finnhub.get_news(symbol='AAPL', start_date=start_date, end_date=end_date)

    all_news = [yahoo_news, finnhub_news]
    for news_data in all_news:
        for symbol, news_list in tqdm(news_data.items(), desc='Witing news to file'):
            manager.save_news(symbol, news_list)

def main():
    start_date = '2024-06-01'
    end_date = '2024-06-03'
    load_news(start_date=start_date, end_date=end_date)

if __name__ == "__main__":
    main()