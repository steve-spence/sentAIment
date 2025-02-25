from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re

def get_article_percent(print_output=False):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    driver = webdriver.Chrome(options=chrome_options)
    driver.get("https://finance.yahoo.com/news/")
    driver.implicitly_wait(2)

    articleInfo = {}

    ActionChains(driver).scroll_by_amount(0, 800).perform()

    story_item = driver.find_elements(By.CLASS_NAME, "story-item")
    for item in story_item:
        try:
            titleElement = item.find_element(By.TAG_NAME, "h3")

            # Wait for the footer psuedo-selectors to be present and visible
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
    return articleInfo

get_article_percent()

"""
This code scrapes Yahoo Finance using browser-use
It is pretty expensive to do this, so I am going to comment it out for now
I tried using groq to do this, but it was not working
even though I followed the documentation. 
"""

    #if "GROQ_API_KEY" not in os.environ:
    #    os.environ["GROQ_API_KEY"] = getpass.getpass("Enter your Groq API key: ")

    # Initialize the model
    # llm = ChatOpenAI(
    #     model="gpt-4o-mini",
    #     temperature=0.0,
    # )

    # I think this should work in the future
    # llm = ChatGroq(
    #     model="llama-3.1-8b-instant",
    #     temperature=0.0,
    #     top_p=0.95,
    # )

    # Create agent with the model
    # agent = Agent(
    #     task="Go to Yahoo 'https://finance.yahoo.com/news/', find a story element and scroll to it\
    #     wait 3 seconds, get the text element of that and add it to a list.\
    #     Repeat this process until you have 10 story elements.\
    #     llm=llm
    # )
    #result = await agent.run(max_steps=15)
    #print(result)
    #scrape_yahoo_finance()