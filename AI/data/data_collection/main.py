from sources import yahoo_news_data
from sources import finnhub_news_data
import stock_file_manager
from tqdm import tqdm
import requests
from datetime import datetime, timezone, timedelta
import yfinance as yf
import os
import time

def load_stock_data(news: list, accepted_stocks: dict):
    """
    Save the price data for all news data for each stock symbol
    """

    day_forecast = 7
    rounding_precision = 8
    
    # Get the price data for each symbol in the news directory
    for symbol in tqdm(accepted_stocks.keys(), desc='Getting price data for stocks'):
        if symbol not in news:
            continue
        recorded_dates = {} # list of dates we have already recorded stock data for
        for news_source in news[symbol]: # {'title':, 'published':}
            # Get the stock price at the time of the news

            # Get the dates for the stock data
            # We get current day and next because you cant input same day for both start and end
            news_obj = datetime.fromtimestamp(news_source['published'], tz=timezone.utc)
            start_date = str(news_obj).split(' ')[0]
            end_date = str(news_obj + timedelta(days=day_forecast)).split(' ')[0] # offset by day_forecast the amount of days to store

            # Check if we have data for that date
            if start_date not in recorded_dates:
                #print(f"Getting stock data for {symbol} from {start_date} to {end_date}")
                try: # Check if we have data for that date
                    yf_data = yf.download(tickers=symbol, start=start_date, end=end_date, progress=False)
                    for i in range(day_forecast):
                        # the next dates of the news
                        current_date = str(news_obj + timedelta(days=i)).split(' ')[0]

                        # Save the stock data for that date
                        recorded_dates[current_date] = {
                            'open': round(yf_data.iloc[i]['Open'].values[0], rounding_precision),
                            'close': round(yf_data.iloc[i]['Close'].values[-1], rounding_precision)
                            }
                        
                        # if the next day is in the recorded_dates, break
                        if str(news_obj + timedelta(days=1)).split(' ')[0] in recorded_dates:
                            break

                except IndexError as e:
                    #print(f"No stock data found for {symbol} on {start_date}, Error: ", e)
                    news[symbol].remove(news_source)
                    continue

            # Calculate the variables for that day
            posting_price = recorded_dates[start_date]['open']
            close_price = recorded_dates[start_date]['close']
            percent_change = round(((close_price - posting_price) / posting_price) * 100, rounding_precision)

            # Add the stock data to the news source
            news_source['posting_price'] = posting_price
            news_source['close_price'] = close_price
            news_source['percent_change'] = percent_change
            time.sleep(.1) # api limits


def load_news(start_date: str, end_date: str):
    # initialize news sources
    yahoo = yahoo_news_data.YahooNews()
    finnhub = finnhub_news_data.FinnhubNews()

    # initialize file manager for news data
    manager = stock_file_manager.StockNewsManager()

    # Get title and published from sources
    finnhub_news = finnhub.get_news(start_date=start_date, end_date=end_date)
    yahoo_news = yahoo.get_news()

    # Add more news sources here
    all_news = [yahoo_news, finnhub_news]

    # save the stock prices
    for news in all_news:
        load_stock_data(news=news, accepted_stocks=yahoo.get_accepted_stocks())

    # Save the news data to the file
    for news_data in all_news:
        for symbol, news_list in tqdm(news_data.items(), desc='Witing price data to file'):
            manager.save_news(symbol, news_list)

def main():
    start_date = '2024-04-01'
    end_date = '2024-04-05'
    load_news(start_date=start_date, end_date=end_date)


if __name__ == "__main__":
    main()