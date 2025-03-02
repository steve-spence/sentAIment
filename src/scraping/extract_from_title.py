import pandas as pd
import numpy as np
import re
import yfinance as yf
import finnhub
import os
import re
from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline
from transformers import AutoModel



def extract_ticker_from_title(title: str) -> str:
    """
    Extracts the ticker from the title of a news article.
    "Vital Farms CEO predicts egg shortages will ease later this year"
    """
    df = pd.read_csv("stock_tickers.csv")
    stock_tickers = df["Symbol"].tolist()

def normalize_company_name(name: str) -> str:
    """
    Normalizes a company name by lowercasing and removing common suffixes.
    """
    name = name.lower().strip()
    # Remove common suffixes to improve matching (adjust as needed)
    for suffix in [" inc", " corporation", " corp", " llc", " ltd"]:
        if name.endswith(suffix):
            name = name.replace(suffix, "")
    return name.strip()

# Function to combine tokens belonging to the same entity
def combine_entity_tokens(ner_results):
    combined_entities = []
    current_entity = ""
    for token in ner_results:
        # Start a new entity if the token is a beginning token
        if token['entity'].startswith("B-"):
            # Save the previous entity (if any)
            if current_entity:
                combined_entities.append(current_entity)
            current_entity = token['word']
        elif token['entity'].startswith("I-") and current_entity:
            # Append the token, handling subword tokens (those starting with "##")
            if token['word'].startswith("##"):
                current_entity += token['word'][2:]
            else:
                current_entity += " " + token['word']
    # Append the last entity if there is one
    if current_entity:
        combined_entities.append(current_entity)
    return combined_entities

def setup(title: str):
    """
    IF YOU DONT HAVE THE ENV SET UP JUST COPY THIS
    export FINNHUB_API_KEY=""
    """
    key = os.environ["FINNHUB_API_KEY"] 
    finnhub_client = finnhub.Client(api_key=key) 

    # .peers could be useful here
    # Get company peers. Return a list of peers operating in the same country and sector/industry.
    csv_filename = "stock_data.csv"

    # Check if the CSV file already exists otherwise populate it
    if not os.path.exists(csv_filename):
        url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
        sp500_table = pd.read_html(url)[0]
        sp500_table['Symbol']=sp500_table['Symbol'].str.replace('.', '-', regex=False)
        sp500_table['Security']=(sp500_table['Security'].str \
            .strip()\
            .replace('"', '', regex=False)\
            .replace("',", "", regex=False)\
            .replace(", Inc.", "", regex=False)\
            .replace(", Inc", "", regex=False)
        )
        sp500_table.to_csv(csv_filename, index=False)
        print(f"CSV file created and saved as '{csv_filename}'.")
    else:
        print(f"CSV file '{csv_filename}' already exists.")


    # read the file into a dataframe and get all the stocks 
    # Might have to use .unique() here if 2 alphabet inc's are a problem
    df = pd.read_csv(csv_filename)
    company_to_ticker = {}
    for _, row in df.iterrows():
        normalized_name = row['Security'].lower().strip() # this still includes inc and stuff
        company_to_ticker[normalized_name] = row['Symbol'] # all already uppercase
    # symbols = set(df['Symbol'].unique())     # Get list of ticker symbols
    # security = set(df['Security'].unique().lower().strip())  # Get list of company names
    # symbol_security_set = symbols | security

    # import the pre-trained BERT-model for testing 
    # we will train our own later
    # Named Entity Recognition - https://huggingface.co/dslim/bert-base-NER
    tokenizer = AutoTokenizer.from_pretrained("dslim/bert-base-NER")
    model = AutoModelForTokenClassification.from_pretrained("dslim/bert-base-NER")
    nlp = pipeline("ner", model=model, tokenizer=tokenizer)

    results = nlp(title)
    print("NER tokens:", results)

    # Combine tokens into full entity strings
    entities = combine_entity_tokens(results)
    print("Extracted entities:", entities)

    # Check if any of the extracted entities match an entry in your lists
    securities_in_title = {}
    for entity in entities:
        # If the entity is all uppercase, assume it's a ticker symbol already
        if entity.isupper():
            ticker = entity
            print(f"Assuming '{entity}' is a ticker symbol.")
            securities_in_title[entity] = finnhub_client.quote(ticker)
        else:
            normalized_entity = entity.lower().strip()
            if normalized_entity in company_to_ticker:
                ticker = company_to_ticker[normalized_entity]
                print(f"Entity '{entity}' mapped to ticker '{ticker}'.")
                securities_in_title[entity] = finnhub_client.quote(ticker)
            else:
                print(f"Entity '{entity}' not found in mapping.")
        # if entity in symbol_security_set:
        #     print(f"Entity '{entity}' found in the list!")
        #     securities_in_title[entity] = finnhub_client.quote(entity)
        # else:
        #     print(f"Entity '{entity}' not found in the list.")

    print(securities_in_title)
    return securities_in_title

if __name__ == "__main__":
    setup(title="Tesla just wrapped up its second-worst month ever")
    