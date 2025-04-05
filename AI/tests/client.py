# Importing required packages
import requests
import json
import os

payload = {'text': 'The beauty of the world is greatly dependent on the eyes seeing it.'}
headers = {'Content-type': 'application/json'}
port = int(os.getenv("PORT", default=5000))+1
response = requests.post(url=f"http://localhost:{port}/", data=json.dumps(payload), headers=headers)

# Printing out the response of API
print(response.text)