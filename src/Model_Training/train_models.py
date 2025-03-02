import json
import torch
from transformers import BertTokenizer, BertForSequenceClassification, AdamW
from torch.utils.data import DataLoader, Dataset
import numpy as np
from torch.nn import MSELoss
import os

# Load your data
with open("../scraping/articleInfo.json", "r") as file:
    data = json.load(file)

# Flatten the data into a list of tuples (title, stock_symbol, percent_change)
data_list = []
for title, info in data.items():
    stock_symbol = info["stock_symbol"]
    percent_change = float(info["percent_change"].replace("%", ""))
    data_list.append((title, stock_symbol, percent_change))

# Tokenizer and model setup
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Custom Dataset for BERT
class StockDataset(Dataset):
    def __init__(self, data, tokenizer, max_length=512):
        self.data = data
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        title, stock_symbol, percent_change = self.data[idx]
        # Concatenate title and stock_symbol as input text
        input_text = f"{stock_symbol} {title}"
        # Tokenize the input text
        encoding = self.tokenizer.encode_plus(
            input_text,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        input_ids = encoding['input_ids'].squeeze(0)
        attention_mask = encoding['attention_mask'].squeeze(0)

        return {
            'input_ids': input_ids,
            'attention_mask': attention_mask,
            'labels': torch.tensor(percent_change, dtype=torch.float)
        }


def train_model(dataloader, model, optimizer, epochs=3):
    model.train()
    
    for epoch in range(epochs):
        total_loss = 0
        for batch in dataloader:
            optimizer.zero_grad()
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            outputs = model(input_ids=input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            total_loss += loss.item()

            loss.backward()
            optimizer.step()
        
        avg_loss = total_loss / len(dataloader)
        print(f"Epoch {epoch + 1}/{epochs}, Loss: {avg_loss:.4f}")

# Adjusting the loss for regression
loss_fn = MSELoss()

def train_model_regression(dataloader, model, optimizer, epochs=3):
    model.train()
    
    for epoch in range(epochs):
        total_loss = 0
        for batch in dataloader:
            optimizer.zero_grad()
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            labels = batch['labels'].to(device)
            
            # Get predictions
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            predictions = outputs.logits.squeeze(1)  # Shape: (batch_size,)
            
            # Calculate the regression loss
            loss = loss_fn(predictions, labels)
            total_loss += loss.item()

            loss.backward()
            optimizer.step()
        
        avg_loss = total_loss / len(dataloader)
        print(f"Epoch {epoch + 1}/{epochs}, Loss: {avg_loss:.4f}")

def predict(input_text, model, tokenizer):
    model.eval()
    encoding = tokenizer.encode_plus(
        input_text,
        add_special_tokens=True,
        max_length=512,
        padding='max_length',
        truncation=True,
        return_tensors='pt'
    )
    
    input_ids = encoding['input_ids'].to(device)
    attention_mask = encoding['attention_mask'].to(device)
    
    with torch.no_grad():
        output = model(input_ids=input_ids, attention_mask=attention_mask)
        prediction = output.logits.item()
        
    return prediction


# Create Dataset and DataLoader
dataset = StockDataset(data_list, tokenizer)
dataloader = DataLoader(dataset, batch_size=4, shuffle=True)

model_dir = "stock_predictor_model"

if os.path.exists(model_dir):
    print("Loading pre-trained model and tokenizer...")
    model = BertForSequenceClassification.from_pretrained(model_dir)
    model.to(device)
    tokenizer = BertTokenizer.from_pretrained(model_dir)
else:
    # Tokenizer and model setup
    print("Training new model...")
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=1)

    model.to(device)
    # Optimizer
    optimizer = AdamW(model.parameters(), lr=1e-5)

    # Train the model
    train_model(dataloader, model, optimizer)

    # Save the model and tokenizer after training
    model.save_pretrained(model_dir)
    tokenizer.save_pretrained(model_dir)

# Test the model
input_text = "Nvidia Stock Climbs Ahead of Chipmaker's Highly Anticipated Earnings"
prediction = predict(input_text, model, tokenizer)
print(f"Predicted percent change: {prediction:.2f}%")