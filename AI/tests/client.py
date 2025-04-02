# Importing required packages
import requests
import json
import os

# Composing a payload for API
payload = {'text': 'The beauty of the world is greatly dependent on the eyes seeing it.'}
# Defining content type for our payload
headers = {'Content-type': 'application/json'}

port = int(os.getenv("PORT", default=5000))+1
# Sending a post request to the server (API)
response = requests.post(url=f"http://localhost:{port}/", data=json.dumps(payload), headers=headers)
# Printing out the response of API
print(response.text)