import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) to allow requests from React frontend

# Set the OpenAI API key
API_KEY = os.getenv('AZURE_OPENAI_API_KEY')
ENDPOINT = os.getenv('AZURE_OPENAI_ENDPOINT')

headers = {
    "Content-Type": "application/json",
    "api-key": API_KEY,
}

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message', '')

    payload = {
        "messages": [
            {
                "role": "system",
                "content": "You are an AI assistant that helps people find information on a website and provide health-related information. The Vision: To be a one-stop center for excellent service delivery. The Mission: To reach the underserved population in particular and everyone with the best medical care. Contacts: +2347082210979, +2348173922714, enoobongmemorial@yahoo.com"
            },
            {
                "role": "user",
                "content": user_input
            }
        ],
        "temperature": 0.7,
        "top_p": 0.95,
        "max_tokens": 800
    }

    try:
        response = requests.post(ENDPOINT, headers=headers, json=payload)
        response.raise_for_status()
        response_json = response.json()
        assistant_message = response_json['choices'][0]['message']['content']
        return jsonify({"response": assistant_message})
    
    except requests.RequestException as e:
        return jsonify({"error": f"Failed to make the request. Error: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
