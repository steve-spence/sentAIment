import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import os

data_dir = '../data/news/'
path_to_accepted_stocks = 'accepted_stocks_p_to_s.json'


# Load the data
accepted_stocks = pd.read_json(path_to_accepted_stocks)

for symbol in accepted_stocks['symbol']:
    try:
        title = os.path.join(data_dir, f'{symbol}.json')
        
    except FileNotFoundError:
        print(f"File {title} not found. Skipping...")
        continue

# scaler = MinMaxScaler(feature_range=(0, 1))
# scaled_data = scaler.fit_transform(data)
