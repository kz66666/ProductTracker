from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/api/scrape', methods=['POST'])
def start_scraping():
    data = request.get_json()
    url = data.get('url')

    if url:
        try:
            # Run amazon_scrape.py and pass the URL as an argument
            subprocess.Popen(['python3', 'amazon_scrape.py', url])
            return jsonify({'message': 'Scraping started successfully', 'url': url})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'No URL provided'}), 400

if __name__ == '__main__':
    app.run(debug=True)
