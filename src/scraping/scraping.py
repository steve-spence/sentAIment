from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
import json

def get_article_percent(print_output=False) -> dict:
    """
    Scrapes the Yahoo Finance website for the latest news for 
    titles, stock symbols, and stock value change %
    :param print_output: If True, will print the title, stock symbol, and stock value change
    :return: A dictionary of the article title, stock symbol, and stock value change
    """

    # Set up the Chrome options
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")

    driver = webdriver.Chrome(options=chrome_options)
    driver.get("https://finance.yahoo.com/news/")

    articleInfo = {}

    story_item = driver.find_elements(By.CLASS_NAME, "story-item")
    for item in story_item:
        try:
            titleElement = item.find_element(By.TAG_NAME, "h3")

            # Wait for the footer psuedo-element to be present and visible
            footer = WebDriverWait(item, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "footer"))
            )

            pattern = r"([A-Z]+)\s*(-?\d+\.\d+%)"
            match = re.search(pattern, footer.text)

            if match:
                stock_symbol = match.group(1)
                percent_change = match.group(2)
                if print_output:
                    print(f"Title: {titleElement.text}, Stock: {stock_symbol}, Change: {percent_change}")

                # Add to articleInfo dictionary
                articleInfo[titleElement.text] = {"stock_symbol": stock_symbol, "percent_change": percent_change}
            else:
                #print(f"Couldn't find percent change for: {titleElement.text}")
                pass
        except Exception:
            if print_output:
                print("No title found for this story item.")

    if not story_item:

        print("No story items found on Yahoo Finance.")
    
    driver.quit()
    json.dump(articleInfo, open("articleInfo.json", "w"))
    return articleInfo

get_article_percent()