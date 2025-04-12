# Server/api/predict.py

import json
import os
import sys
from urllib.parse import parse_qs

# Adjust Python’s path so the AI folder can be imported.
# This assumes your AI folder is one level up from the Server folder.
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'AI', 'models'))

from my_model import MyCustomModel  # Import your model class

def handler(request):
    """
    Vercel expects a handler function that accepts a request and returns a dict.
    Request parameters (GET parameters) are available via request.args.
    """
    symbol = request.args.get("symbol")
    if not symbol:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "No symbol provided"})
        }
    
    # Initialize your model (could be optimized to initialize only once if needed)
    model = MyCustomModel()
    score = model.predict(symbol)
    
    return {
        "statusCode": 200,
        "body": json.dumps({"symbol": symbol, "score": score})
    }
