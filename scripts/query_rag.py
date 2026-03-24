import requests

url = "http://localhost:8000/query"

payload = {
 "question": "What spacing should footer maintain?"
}

response = requests.post(url, json=payload)

print(response.json())