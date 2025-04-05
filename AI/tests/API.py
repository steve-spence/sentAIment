# Importing required packages
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# The endpoint of our flask app
@app.route(rule="/", methods=["GET", "POST"])
def handle_request():
    if request.method == "GET":
        # we will put our model response here I think
        return "This is the GET Endpoint of flask API."
    
    if request.method == "POST":
        # accesing the passed payload
        payload = request.get_json()
        
        cap_text = payload['text'].upper()
        
        response = {'cap-text': cap_text}
        
        # return the response as JSON
        return jsonify(response)

# Running the API
if __name__ == "__main__":
    # Setting host = "0.0.0.0" runs it on localhost
    app.run(host="0.0.0.0", debug=True, port=int(os.getenv("PORT", default=5000))+1)