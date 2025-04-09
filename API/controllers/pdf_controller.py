from flask import Blueprint, request, jsonify
from urllib.parse import urljoin
import PyPDF2
import os
from dotenv import load_dotenv
import requests
import json

load_dotenv()

pdf_controller = Blueprint('pdf_controller', __name__)
@pdf_controller.route('/read-pdf', methods=['POST'])
def read_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    if 'quizzes' not in request.form:
        return jsonify({'error': 'No quizzes part in the request'}), 400
   
    
    try:
        pdf_file = request.files['file']
        quizzes = request.form['quizzes']
        
        if pdf_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        json_quizzes = json.loads(quizzes)
        
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        # Convert all the text from the pdf into a single string
        text = ''
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        if not text.strip():
            return jsonify({'error': 'Failed to extract any text from PDF'}), 400
        
        # Pass to orchestrator
        api_endpoint = os.getenv("API_ENDPOINT")
        url = urljoin(api_endpoint, "format")
        res = requests.post(url, json={'text': text, 'quizzes': json_quizzes})
        return jsonify(res.json()), res.status_code
    
    except json.JSONDecodeError as e:
        return jsonify({'error': 'Failed to decode JSON response', 'details': str(e)}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500