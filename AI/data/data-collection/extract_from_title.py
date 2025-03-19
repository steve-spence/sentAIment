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
from dotenv import load_dotenv
"""
Set Finnhub API key in .env file
FINNHUB_API_KEY=your_api_key_here
"""


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
    load_dotenv()
    finnhub_key = os.getenv("FINNHUB_API_KEY")
    finnhub_client = finnhub.Client(api_key=finnhub_key) 

    # .peers could be useful here
    # Get company peers. Return a list of peers operating in the same country and sector/industry.
    csv_filename = "stock_data.csv"

    # Check if the CSV file already exists otherwise populate it
    if not os.path.exists(csv_filename):
        url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
        sp500_table = pd.read_html(url)[0]
        sp500_table['Symbol']=sp500_table['Symbol'].str.replace('.', '-', regex=False)
        sp500_table['Security']=(sp500_table['Security'] \
            # clean up the data, will need updating 
            .str.strip()\
            .str.replace('"', '', regex=False)\
            .str.replace("',", "", regex=False)\
            .str.replace(", Inc.", "", regex=False)\
            .str.replace(", Inc", "", regex=False)\
            .str.replace("(the)", "", regex=False)\
            .str.lower()
            
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
            if re.search(r"\bS\s*&\s*P\b", entity, re.IGNORECASE): # Case S & P is detected in NER
                entity = "SPY"
            ticker = entity
            print(f"Assuming '{entity}' is a ticker symbol.")
            securities_in_title[entity] = finnhub_client.quote(ticker)
        else:
            # make the string lower to match the csv
            normalized_entity = entity.lower().strip()
            if normalized_entity in company_to_ticker:
                ticker = company_to_ticker[normalized_entity]
                print(f"Entity '{entity}' mapped to ticker '{ticker}'.")
                securities_in_title[entity] = finnhub_client.quote(ticker)
            else:
                print(f"Entity '{entity}' not found in mapping.")

    print(securities_in_title)
    return securities_in_title

if __name__ == "__main__":
    #setup(title="Stock market today: Dow, S&P 500, Nasdaq sink as Nvidia plummets 7%, Trump tariffs stalk markets")
    key = os.environ["FINNHUB_API_KEY"]
    finnhub_client = finnhub.Client(api_key=key)

    
    
    